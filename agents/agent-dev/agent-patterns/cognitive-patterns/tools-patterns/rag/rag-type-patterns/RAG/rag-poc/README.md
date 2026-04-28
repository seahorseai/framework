"""
# RAG API (FastAPI, LangChain, LangGraph and Faiss)


## Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```


## Endpoints

- GET /health
```
curl -s http://localhost:8000/health | jq
{
  "status": "ok"
}
```

- POST /ingest
```
curl -X POST http://localhost:8000/ingest | jq

{
  "status": "ingested"
}
```

- POST /ask
```
curl -s -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What robots do you sell?"}' | jq

{
  "answer": "We sell a variety of robots, including:\n\n1. **Industrial Robots** - Used in manufacturing for tasks like welding, painting, and assembly.\n2. **Service Robots** - Designed to assist humans in tasks such as cleaning, delivery, and customer service.\n3. **Educational Robots** - Used in schools and universities to teach programming and robotics concepts.\n4. **Consumer Robots** - Such as robotic vacuum cleaners and lawn mowers for home use.\n5. **Medical Robots** - Employed in surgeries and rehabilitation to assist healthcare professionals.\n\nIf you have a specific type of robot in mind, feel free to ask!"
}
```


## Design
- Writer pipeline (static, semantic and agentic chunking)
- Reader pipeline (LangGraph flow for retrieving and generating)


## Improvements
- Add reranking
- Add query expansion
- Add conversational memory
- Add LLM-based evaluation



## Chunking
This poc has 3 types of chunking:

### Static
Static is the baseline — fixed character windows with overlap. Fast and predictable, but chunks split mid-sentence or mid-idea constantly, which hurts retrieval quality. Good only for prototyping or when speed is the only constraint.

### Semantic
Semantic is the best default for most RAG pipelines. It uses embedding similarity to find natural topic boundaries, so chunks are coherent units of meaning. The cost is a second embedding pass during ingestion (not at query time), but since you already have your embedding model loaded it's essentially free infrastructure-wise. Retrieval precision improves noticeably over static chunking.

### Agentic
Agentic produces the highest quality chunks — proposition-level, truly self-contained — but it makes one LLM call per rough chunk. For a 100-page document that means dozens of LLM calls just to ingest. It's hard to justify for general-purpose RAG unless your documents are high-value and ingested infrequently (legal contracts, technical specs, medical records).

### Recomendations
Recommendation: semantic. It hits the right balance — much better than static, no LLM cost, and your embedding model is already there. Switch to agentic only if you benchmark retrieval and find semantic chunking still misses critical context in your specific document type.