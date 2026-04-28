from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio
import json

app = FastAPI()

# Simulated "agent response generator"
async def fake_agent_stream(user_message: str):
    steps = [
        f"User said: {user_message}",
        "Thinking...",
        "Breaking problem into steps...",
        "Step 1: Understanding intent",
        "Step 2: Formulating response",
        "Step 3: Generating answer",
        "Final answer: Hello! This is a streamed agent response 🚀"
    ]

    for step in steps:
        # simulate "thinking time"
        await asyncio.sleep(0.8)

        # stream as JSON line
        yield json.dumps({"chunk": step}) + "\n"


@app.get("/chat/stream")
async def chat_stream(message: str):
    return StreamingResponse(
        fake_agent_stream(message),
        media_type="text/event-stream"
    )