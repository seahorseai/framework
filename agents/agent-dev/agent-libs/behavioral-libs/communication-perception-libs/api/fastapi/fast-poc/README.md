
py -m venv venv
source venv/bin/activate
pip install -r requirements.txt


py -m uvicorn fastapi_server:app --reload


curl -X POST "http://127.0.0.1:8000/items/" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Apple\",\"price\":1.99}"