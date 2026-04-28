import faiss
import numpy as np

index = faiss.IndexFlatL2(1536)
chunks_store = []


def add(embeddings, chunks):
    vectors = np.array(embeddings).astype("float32")
    index.add(vectors)
    chunks_store.extend(chunks)


def search(query_embedding, k=3):
    D, I = index.search(np.array([query_embedding]).astype("float32"), k)
    return [chunks_store[i] for i in I[0] if i < len(chunks_store)]