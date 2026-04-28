from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import Product, DB_URL  # if you store DB_URL somewhere

engine = create_engine(DB_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Fetch all products
products = session.query(Product).all()

for p in products:
    print(f"{p.id} | {p.name} | {p.price} | {p.category} | {p.stock}")

session.close()