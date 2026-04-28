
from app.services.embeddings import EmbeddingService
from app.services.vectorstore import VectorStoreService

class ReaderService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vectorstore = VectorStoreService()
        self.vectorstore.load()


    def retrieve_context(self, query: str):
        query_embedding = self.embedding_service.embed_query(query)
        return self.vectorstore.search(query_embedding)