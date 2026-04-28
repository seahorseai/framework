from openai import OpenAI
from app.config.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

class EmbeddingService:
    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        response = client.embeddings.create(
            model=settings.EMBEDDING_MODEL,
            input=texts
        )

        return [item.embedding for item in response.data]


    def embed_query(self, query: str) -> list[float]:
        response = client.embeddings.create(
            model=settings.EMBEDDING_MODEL,
            input=[query]
        )

        return response.data[0].embedding