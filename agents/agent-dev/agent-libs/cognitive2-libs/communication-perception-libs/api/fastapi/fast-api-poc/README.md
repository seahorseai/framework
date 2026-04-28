# Run

```
uvicorn main:app --reload

```

# Create

```
curl -s -X POST http://127.0.0.1:8000/items/ \
  -H "Content-Type: application/json" \
  -d '{"name":"apple","price":1.5}' | jq
```

# Update

```
curl -s -X PUT http://127.0.0.1:8000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"banana","price":2.0}' | jq
  
```

# Get

```
curl -s http://127.0.0.1:8000/items/1 | jq

```