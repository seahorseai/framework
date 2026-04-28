import requests

BASE = "http://127.0.0.1:5000"

# Create an item
response = requests.post(f"{BASE}/item/apple", json={"price": 1.25})
print("POST /item/apple:", response.json())

# Fetch the newly created item
response = requests.get(f"{BASE}/item/apple")
print("GET /item/apple:", response.json())

# List all items
response = requests.get(f"{BASE}/items")
print("GET /items:", response.json())
