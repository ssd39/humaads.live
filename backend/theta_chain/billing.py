from web3 import Web3
from theta_chain import smart_contract
from db.models.ad_transaction import AdTrasnsactionDto
from datetime import date
from db import mongo
import os

def charge(timespent):
    try:
        # currently CPTS (cost per time spent) fixed to 0.1 per minuite
        charge = timespent / 60 * 0.1
        in_token = Web3.to_wei(charge, 'ether')
        tx_reciept = smart_contract.call_smart_contract_function("charge", [0, in_token], "0x2E833968E5bB786Ae419c4d13189fB081Cc43bab", os.environ["WALLET_PK"])
        print(tx_reciept)
        mongo.insert_data(AdTrasnsactionDto(tx_hash=tx_reciept, on_Chain_id=0, created_at=date.today().ctime(), amount=charge), mongo.ad_transactions)
    except Exception as e:
        print("billing_charge:", e)