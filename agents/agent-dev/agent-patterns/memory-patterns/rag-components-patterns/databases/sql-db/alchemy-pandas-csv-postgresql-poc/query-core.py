from sqlalchemy import create_engine, select, Table, MetaData
from models import DB_URL

engine = create_engine(DB_URL)
metadata = MetaData(schema="product")
metadata.reflect(bind=engine)

items_table = Table("items", metadata, autoload_with=engine)

stmt = select(items_table)
with engine.connect() as conn:
    results = conn.execute(stmt)
    for row in results:
        print(row)
