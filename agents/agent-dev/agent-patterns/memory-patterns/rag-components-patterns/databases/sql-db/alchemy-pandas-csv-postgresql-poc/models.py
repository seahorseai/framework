from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, Numeric, String, MetaData

SCHEMA_NAME = "product"
DB_URL = "postgresql://postgres:postgres@localhost:5432/products_db"
metadata = MetaData(schema=SCHEMA_NAME)
Base = declarative_base(metadata=metadata)

class Product(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    price = Column(Numeric(10, 2))
    category = Column(String)
    stock = Column(Integer)
