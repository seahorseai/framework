import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from app.common.embeddings import embed
from app.common.vectorstore import add
from app.config.config import settings
from app.common.llm import llm

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

_CHUNK_PROMPT = ChatPromptTemplate.from_messages([
    ("system",
     "You are a document chunking assistant. Given a passage of text, split it into "
     "self-contained, semantically coherent chunks. Return ONLY a JSON array of strings, "
     "one string per chunk, with no additional commentary."),
    ("human", "{text}"),
])

_presplitter = RecursiveCharacterTextSplitter(
    chunk_size=settings.CHUNK_SIZE * 4,
    chunk_overlap=0,
)

def chunk_text(text: str) -> list[str]:
    """Use an LLM to produce semantically meaningful chunks."""
    import json
    rough_chunks = _presplitter.split_text(text)
    final_chunks = []

    for rough in rough_chunks:
        response = (_CHUNK_PROMPT | llm).invoke({"text": rough})
        try:
            parsed = json.loads(response.content)
            final_chunks.extend(parsed)
        except json.JSONDecodeError:
            final_chunks.append(rough)

    return final_chunks

def ingest_documents(path: str) -> None:
    abs_path = os.path.join(BASE_DIR, path)
    all_chunks = []

    for file in os.listdir(abs_path):
        with open(os.path.join(abs_path, file), "r", encoding=settings.ENCODING) as f:
            text = f.read()
        all_chunks.extend(chunk_text(text))

    embeddings = embed(all_chunks)
    add(embeddings, all_chunks)