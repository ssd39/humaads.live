import pymongo
from pymongo.collection import Collection
import os
import dataclasses

db_client = pymongo.MongoClient(os.environ["MONGO_URL"])

db = db_client["smart_ads"]

ads_collection = db["ads_collection"]
ad_feedBacks = db["ad_feedBacks"]
ad_analytics = db["ad_analytics"]
ad_transactions = db["ad_transactions"]

def upsert_data(query, data, collection: Collection):
    collection.update_one(query, {"$set": dataclasses.asdict(data)}, upsert=True)

def insert_data(data, collection: Collection):
    collection.insert_one(dataclasses.asdict(data))
    
