import os
from app.common.embeddings import embed
from app.common.vectorstore import add
from app.config.config import settings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def chunk_text(text, size=settings.CHUNK_SIZE, overlap=settings.CHUNK_OVERLAP):
    chunks = []
    for i in range(0, len(text), size - overlap):
        chunks.append(text[i:i+size])
    return chunks

def ingest_documents(path):
    abs_path = os.path.join(BASE_DIR, path)
    all_chunks = []
    for file in os.listdir(abs_path):
        with open(os.path.join(abs_path, file), "r", encoding=settings.ENCODING) as f:
            text = f.read()
            chunks = chunk_text(text)
            all_chunks.extend(chunks)
    embeddings = embed(all_chunks)
    add(embeddings, all_chunks)