import os

from app.config.config import settings
from app.services.embeddings import EmbeddingService
from app.services.vectorstore import VectorStoreService

class WriterService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vectorstore = VectorStoreService()
        self.vectorstore.load()



    def ingest_documents(self, folder_path: str):
        all_chunks = []

        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)

            if filename.endswith(".txt"):
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()

                chunks = self.chunk_text(text)
                all_chunks.extend(chunks)

        if not all_chunks:
            return 0

        embeddings = self.embedding_service.embed_texts(all_chunks)
        self.vectorstore.add(embeddings, all_chunks)
        self.vectorstore.save()

        return len(all_chunks)
    
    def chunk_text(self, text: str):
        chunks = []
        start = 0

        while start < len(text):
            end = start + settings.CHUNK_SIZE
            chunk = text[start:end]
            chunks.append(chunk)
            start += settings.CHUNK_SIZE - settings.CHUNK_OVERLAP

        return chunks