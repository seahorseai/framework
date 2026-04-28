from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# In-memory "database"
items = {}
next_id = 1


class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = False


@app.get("/")
def read_root():
    return {"message": "Simple API"}


# Get all items
@app.get("/items/")
def get_items():
    return items


# Get one item
@app.get("/items/{item_id}")
def get_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return items[item_id]


# Create item
@app.post("/items/")
def create_item(item: Item):
    global next_id

    items[next_id] = item.dict()
    created = {"id": next_id, **items[next_id]}

    next_id += 1
    return created


# Update item
@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")

    items[item_id] = item.dict()
    return {"id": item_id, **items[item_id]}


# Delete item
@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")

    deleted = items.pop(item_id)
    return {"id": item_id, **deleted}