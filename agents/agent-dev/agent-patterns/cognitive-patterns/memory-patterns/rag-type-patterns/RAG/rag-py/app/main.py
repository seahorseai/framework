from fastapi import FastAPI
from app.api.endpoints import router

app = FastAPI(
    title="RAG Assistant API",
    version="1.0.0"
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "RAG Assistant API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }