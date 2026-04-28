from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

class ResponseItem(BaseModel):
    received: Item

@app.post("/items/" , response_model=ResponseItem)
def create_item(item: Item):
    return {"received": item}