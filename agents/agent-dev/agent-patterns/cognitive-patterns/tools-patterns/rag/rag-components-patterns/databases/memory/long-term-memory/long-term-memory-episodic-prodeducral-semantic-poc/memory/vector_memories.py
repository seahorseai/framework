# vector_memories.py
import chromadb
from chromadb.utils import embedding_functions
import uuid
from datetime import datetime

class VectorStore:
    def __init__(self, name, path):
        self.client = chromadb.PersistentClient(path=path)
        self.emb = embedding_functions.OpenAIEmbeddingFunction(
            model_name="text-embedding-3-large"
        )
        self.collection = self.client.get_or_create_collection(
            name=name,
            embedding_function=self.emb
        )

    def add(self, text, metadata):
        self.collection.add(
            ids=[str(uuid.uuid4())],
            documents=[text],
            metadatas=[metadata]
        )

    def search(self, query, k=5, where=None):
        return self.collection.query(
            query_texts=[query],
            n_results=k,
            where=where
        )


class EpisodicMemory(VectorStore):
    def add_episode(self, text, user_id: str, extra=None):
        metadata = {
            "type": "episode",
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id
        }
        if extra:
            metadata.update(extra)
        self.add(text, metadata)

    def search_user_episodes(self, query, user_id, k=5):
        results = self.search(query, k=k, where={"user_id": user_id})
        return results.get("documents", [[]])[0]


class SemanticMemory(VectorStore):
    def add_fact(self, text):
        self.add(text, {"type": "fact"})

