from fastapi import APIRouter
from app.reader.reader import handle_question
from app.writer.static_writer import ingest_documents
from pydantic import BaseModel
class QuestionRequest(BaseModel):
    question: str

router = APIRouter()

@router.post("/ingest")
def ingest():
    ingest_documents("app/data/documents")
    return {"status": "ingested"}

@router.post("/ask")
def ask(req: QuestionRequest):
    return {"answer": handle_question(req.question)}
