from fastapi import FastAPI
from app.api.endpoints import router
from fastapi import Response

app = FastAPI()
app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)
