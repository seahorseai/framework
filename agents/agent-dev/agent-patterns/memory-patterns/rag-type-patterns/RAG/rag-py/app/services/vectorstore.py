import os
import pickle
import faiss
import numpy as np

from app.config.config import settings

class VectorStoreService:
    def __init__(self):
        self.dimension = 1536
        self.index = faiss.IndexFlatL2(self.dimension)
        self.documents = []

    def add(self, embeddings: list[list[float]], chunks: list[str]):
        vectors = np.array(embeddings).astype("float32")
        self.index.add(vectors)
        self.documents.extend(chunks)

    def search(self, query_embedding: list[float], top_k: int = None):
        if top_k is None:
            top_k = settings.TOP_K

        query_vector = np.array([query_embedding]).astype("float32")
        distances, indices = self.index.search(query_vector, top_k)

        results = []

        for idx in indices[0]:
            if idx < len(self.documents):
                results.append(self.documents[idx])

        return results

    def save(self):
        os.makedirs(settings.VECTOR_DB_PATH, exist_ok=True)

        faiss.write_index(
            self.index,
            os.path.join(settings.VECTOR_DB_PATH, "index.faiss")
        )

        with open(os.path.join(settings.VECTOR_DB_PATH, "documents.pkl"), "wb") as f:
            pickle.dump(self.documents, f)

    def load(self):
        index_path = os.path.join(settings.VECTOR_DB_PATH, "index.faiss")
        docs_path = os.path.join(settings.VECTOR_DB_PATH, "documents.pkl")

        if os.path.exists(index_path):
            self.index = faiss.read_index(index_path)

        if os.path.exists(docs_path):
            with open(docs_path, "rb") as f:
                self.documents = pickle.load(f)