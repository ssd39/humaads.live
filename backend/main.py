from dotenv import load_dotenv
load_dotenv()

import os
from typing import Union, Dict
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from db import mongo, test_migration
from db.models.ad_feedback import AdFeedBackDto
from db.models.ad_analytics import AdAnalyticsDto
from db.test_migration import prepare_test_data
from langchain_llm.rag import init_rag, ask_rag
from utils.helper import id_generator, create_form_data_from_base64
from db.models.system_state import Renderer
from db.models.whisper import WhisperPayload
from datetime import date
from utils.localstt import transcribe_local
import json
import random
import time
import base64
from fastapi.middleware.cors import CORSMiddleware
from threading import Thread
from theta_chain import billing, smart_contract
from web3 import Web3
from starlette.websockets import WebSocketState

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

renderers: Dict[str, Renderer] = {}

def get_available_renderer():
    for uid in renderers:
        if renderers[uid].user_connection == None:
            return uid
    return ""
        
async def answer_customer_question(question: str, uid: str):
    try:
        renderer = renderers[uid]
        ans = ask_rag(question, uid, renderer.conversational_rag_chain)
        outputs = ans["answer"].split("\n")
        answer = outputs[0].strip()
        tldr = ""
        for x in outputs[1:]:
            x = x.strip()
            if x != "":
                tldr = x.replace("tldr:", "").strip()
        await renderer.renderer_connection.send_json({
            "action": "speak",
            "answer": answer,
            "tldr": tldr,
            "display": random.choice(ans["context"]).metadata["poster"]
        })
    except Exception as e:
        print(e)

@app.websocket("/renderers")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    uid = id_generator(8)
    #TODO: use db to retrive campaign and smartly allocate to the renderer 
    ad = prepare_test_data()
    campaign_data = ad.data
    conversational_rag_chain = init_rag(campaign_data.product_details, campaign_data.name)
    renderers[uid] =  Renderer(renderer_connection=websocket, conversational_rag_chain=conversational_rag_chain, campaign_data=ad, is_locked=False, stream_url="", user_connection=None)
    print("display:",random.choice(campaign_data.product_details).poster)
    await websocket.send_json({"action": "init_scene",  "banner_url": campaign_data.banner_url, "greetings": campaign_data.greetings, "display": random.choice(campaign_data.product_details).poster })
    try:
        while True:
            if renderers[uid].user_connection and renderers[uid].user_connection.client_state != WebSocketState.CONNECTED:
                renderers[uid].user_connection = None
                await websocket.send_json({ "action": "reset" })
            data_json = await websocket.receive_json()
            if data_json["action"] == "update_stream":
                print("stream_uptdated:uid", uid, "stream_url:", data_json["stream_url"])
                renderers[uid].stream_url = data_json["stream_url"]
            elif data_json["action"] == "unlock":
                renderers[uid].is_locked = False
            #await websocket.send_text(f"Message text was: {data}")
    except WebSocketDisconnect:
        # TODO: Instead of closing user's connection try to match him with other available renderers
        user_connection = renderers[uid].user_connection
        if user_connection:
            await user_connection.send_json({ "action": "close", "message": "Render server error!" })
            await user_connection.close()
        del renderers[uid]
        
@app.websocket("/ads-manager")
async def ads_manager_ws(websocket: WebSocket):
    await websocket.accept()
    uid = get_available_renderer()
    if uid == "":
        await websocket.send_json({ "action": "close", "message": "No renderer available" })
        await websocket.close()
        return
    print("user_connection:uid:", uid)
    start_time = time.time()
    qna_count = 0
    feedback_given = False
    skipped = False
    renderers[uid].user_connection = websocket
    await websocket.send_json({"action":"stream", "video": renderers[uid].campaign_data.data.video, "stream_url": renderers[uid].stream_url })
    try:
        while True:
            data_json = await websocket.receive_json()
            if data_json["action"] == "question":
                qna_count += 1
                await answer_customer_question(data_json["question"], uid)
            elif data_json["action"] == "start":
                await renderers[uid].renderer_connection.send_json({ "action" : "start" })
            elif data_json["action"] == "skip":
                if qna_count == 0:
                    skipped = True
                await renderers[uid].renderer_connection.send_json({
                    "action": "speak",
                    "answer": "I appreciate your time. Do you have any feedback to share?",
                    "tldr": "Thank You!",
                    "display": random.choice(renderers[uid].campaign_data.data.product_details).poster
                })
            elif data_json["action"]  == "feedback":
                feedback_given = True
                msg = data_json["message"]
                mongo.insert_data(AdFeedBackDto(message=msg, created_at=date.today().ctime()), mongo.ad_feedBacks)
                await websocket.send_json({ "action": "close" })
    except Exception as e:
        if uid in renderers:
            timespent = time.time() - start_time
            renderers[uid].user_connection = None
            await renderers[uid].renderer_connection.send_json({ "action": "reset" })
            mongo.insert_data(AdAnalyticsDto(on_chain_id=renderers[uid].campaign_data.on_chain_id, timespent=timespent, qna_count=qna_count, is_redirected=False, feedback_given=feedback_given, skipped=skipped, created_at=date.today().ctime()), mongo.ad_analytics)
            #send transaction to record the payment
            t = Thread(target=billing.charge, args=[timespent])
            t.start()


@app.post("/whisper")
def whisper(payload: WhisperPayload):
    id_ = id_generator()
    files = create_form_data_from_base64(payload.audio, 'file', 'audio.webm')
    response = requests.post(os.environ["EDGECLOUD_WHISPER_API"], files=files)
    return response.json()

@app.get("/insights")
def insights():
    views = mongo.ad_analytics.count_documents({})
    pipeline = [
        {
            '$group': {
                '_id': None,
                'sum_skipped': {
                    '$sum': {
                        '$cond': {
                            'if': '$skipped',
                            'then': 1,
                            'else': 0
                        }
                    }
                },
                'sum_qna_count': {'$sum': '$qna_count'},
                'avg_timespent': {'$avg': '$timespent'}
            }
        }
    ]
    result = list(mongo.ad_analytics.aggregate(pipeline))[0]
    skipped = result['sum_skipped']
    qna = result['sum_qna_count']
    avg_timespent = f"{result['avg_timespent']:.2f}"
    pipeline = [
        {
            '$group': {
                '_id': None,
                'amount_spent': {'$sum': '$amount'},
            }
        }
    ]
    result = list(mongo.ad_transactions.aggregate(pipeline))[0]
    amount_spent = result["amount_spent"]
    feedbacks = list(filter(lambda x: x["message"] != "No", list(mongo.ad_feedBacks.find(projection={"_id": 0}))))
    balance = Web3.from_wei(smart_contract.read_smart_contract_value("topupbalance", ["0x7896d9e85Cfed5Ab60E0Fc802cA4419629b3D3F8"]), 'ether')
    transactions = list(mongo.ad_transactions.find(projection={"_id": 0}))
    return {
        "feedback_count": len(feedbacks),
        "views": views,
        "qna": qna,
        "avg_timespent": avg_timespent,
        "skipped": skipped,
        "balance": f"{balance:.2f}",
        "amount_spent": amount_spent,
        "feedbacks":  list(reversed(feedbacks)),
        "transactions":  list(reversed(transactions))
    }


@app.get("/campaing-info")
def campaign_info():
    info = mongo.ads_collection.find_one({ "on_chain_id": 0 }, { "_id": 0 })
    return { "info": info }

@app.post("/localstt")
def whisper(payload: WhisperPayload):
    id_ = id_generator()
    audio = base64.b64decode(payload.audio.split(',')[1])
    text = transcribe_local(audio)
    return { "success": True, "text": text }

@app.get("/")
def read_root():
    return {"version": "v0.1", "author": "Dwij Patel", "git": "https://github.com/ssd39"}