# procedural_memory.py
from pymongo import MongoClient
import uuid
from datetime import datetime

class ProceduralMemoryMongo:

    def __init__(self, mongo_uri, db_name="memory_db", collection_name="procedures"):
        self.client = MongoClient(mongo_uri)
        self.collection = self.client[db_name][collection_name]

        # Ensure text index exists
        self.collection.create_index([
            ("skill_name", "text"),
            ("steps", "text"),
            ("tags", "text")
        ])

    def add_skill(self, skill_name: str, steps: str, tags=None):
        doc = {
            "_id": str(uuid.uuid4()),
            "type": "procedure",
            "skill_name": skill_name,
            "steps": steps,
            "tags": tags or [],
            "timestamp": datetime.utcnow().isoformat()
        }
        self.collection.insert_one(doc)
        return doc["_id"]

    def search(self, query: str):
        return list(self.collection.find(
            {"$text": {"$search": query}}
        ))
