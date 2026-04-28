import pandas as pd
from sqlalchemy import create_engine, text
from models import Base, SCHEMA_NAME, DB_URL

CSV_FILE = "products.csv"


engine = create_engine(DB_URL)

# 1️⃣ Create schema BEFORE metadata.create_all()
with engine.begin() as conn:   # <-- IMPORTANT: begin(), not connect()
    conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA_NAME};"))


# 2️⃣ Now create tables inside the schema
Base.metadata.create_all(engine, checkfirst=True)


# 3️⃣ Load CSV
df = pd.read_csv(CSV_FILE)

df.to_sql(
    "items",
    engine,
    schema=SCHEMA_NAME,
    if_exists="append",
    index=False
)

print("CSV successfully loaded!")
