from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

app = FastAPI()

# Model
class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CRUD
@app.post("/items/")
def create_item(item: dict, db: Session = Depends(get_db)):
    db_item = Item(**item)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/items/")
def get_items(db: Session = Depends(get_db)):
    return db.query(Item).all()

@app.put("/items/{item_id}")
def update_item(item_id: int, item: dict, db: Session = Depends(get_db)):
    db_item = db.query(Item).get(item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    for key, value in item.items():
        setattr(db_item, key, value)

    db.commit()
    return db_item

@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Item).get(item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(db_item)
    db.commit()
    return {"ok": True}