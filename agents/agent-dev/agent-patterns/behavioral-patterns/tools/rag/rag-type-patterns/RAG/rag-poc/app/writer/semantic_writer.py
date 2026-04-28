import os
from langchain_text_splitters import SemanticChunker
from app.common import embedding_model
from app.common.embeddings import embed
from app.common.vectorstore import add
from app.config.config import settings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

_splitter = SemanticChunker(
    embedding_model,
    breakpoint_threshold_type="percentile",
    breakpoint_threshold_amount=95,
)

def chunk_text(text: str) -> list[str]:
    """Semantically split text at topic boundaries."""
    docs = _splitter.create_documents([text])
    return [doc.page_content for doc in docs]

def ingest_documents(path: str) -> None:
    abs_path = os.path.join(BASE_DIR, path)
    all_chunks = []

    for file in os.listdir(abs_path):
        with open(os.path.join(abs_path, file), "r", encoding=settings.ENCODING) as f:
            text = f.read()
        all_chunks.extend(chunk_text(text))

    embeddings = embed(all_chunks)
    add(embeddings, all_chunks)