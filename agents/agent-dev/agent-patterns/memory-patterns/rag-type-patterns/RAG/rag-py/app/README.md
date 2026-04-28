Here are clean `curl + jq` examples for both endpoints.

I’ll assume your API is running locally on `http://localhost:8000` and the router is mounted at the root (adjust if you have a prefix like `/api`).

---

## 🔹 1. `/ask` endpoint

### Request

```bash
curl -s -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is this system?"
  }' | jq
```

### Pretty filtered output (optional)

```bash
curl -s -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is this system?"
  }' | jq '.answer'
```

---

## 🔹 2. `/ingest` endpoint

### Request (default folder)

```bash
curl -s -X POST "http://localhost:8000/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "folder_path": "app/data/documents"
  }' | jq
```

### Minimal (since default exists in your model)

```bash
curl -s -X POST "http://localhost:8000/ingest" \
  -H "Content-Type: application/json" \
  -d '{}' | jq
```

---

## 🔹 Optional: cleaner dev aliases

If you want something reusable:

```bash
alias ask='curl -s -X POST http://localhost:8000/ask -H "Content-Type: application/json" -d'
alias ingest='curl -s -X POST http://localhost:8000/ingest -H "Content-Type: application/json" -d'
```

Usage:

```bash
ask '{"question":"hello"}' | jq
ingest '{"folder_path":"app/data/documents"}' | jq
```

---

If you tell me your actual base URL (or if you're using Docker / a gateway path), I can tailor these exactly to your setup.
