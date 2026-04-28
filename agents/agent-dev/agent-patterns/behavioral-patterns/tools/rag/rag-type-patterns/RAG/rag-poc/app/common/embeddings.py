from langchain_openai import OpenAIEmbeddings
from app.config.config import settings

embedding_model = OpenAIEmbeddings(
    model=settings.EMBEDDING_MODEL,
    api_key=settings.OPENAI_API_KEY
)


def embed(texts):
    return embedding_model.embed_documents(texts)


def embed_query(text):
    return embedding_model.embed_query(text)
