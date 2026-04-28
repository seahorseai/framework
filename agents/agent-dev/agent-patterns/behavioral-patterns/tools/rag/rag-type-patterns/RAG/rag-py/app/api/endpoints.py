from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.rulerouter import RuleRouterService
from app.services.writer import WriterService

router = APIRouter()

rulerouter_service = RuleRouterService()
writer_service = WriterService()


class AskRequest(BaseModel):
    question: str


class IngestRequest(BaseModel):
    folder_path: str = "app/data/documents"


@router.post("/ingest")
def ingest(request: IngestRequest):
    try:
        total_chunks = writer_service.ingest_documents(request.folder_path)
        return {
            "status": "success",
            "chunks_indexed": total_chunks
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask")
def ask(request: AskRequest):
    try:
        answer = rulerouter_service.handle_question(request.question)
        return {
            "question": request.question,
            "answer": answer
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





@router.get("/health")
def health():
    return {
        "status": "ok"
    }