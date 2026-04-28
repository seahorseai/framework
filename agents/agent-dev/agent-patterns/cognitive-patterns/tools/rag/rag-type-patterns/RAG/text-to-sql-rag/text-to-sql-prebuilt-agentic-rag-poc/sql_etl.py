import os
import tempfile
import pandas as pd
from langchain.tools import tool
from sqlalchemy import create_engine, text
from langchain_community.utilities import SQLDatabase
from langchain_community.tools import QuerySQLDatabaseTool  # updated import for SQL tool


@tool
def build_sql_tool():
    """Creates a DuckDB database with a products table and returns a LangChain SQL query tool."""

    # -------------------- 1. Build products dataframe --------------------
    products_df = pd.DataFrame({
        'id': [1, 2, 3],
        'name': ['USB Charger', 'Bluetooth Speaker', 'Notebook'],
        'price': [15.99, 45.00, 3.50],
        'category': ['electronics', 'electronics', 'stationery'],
        'stock': [120, 35, 200]
    })

    # -------------------- 2. Create temporary DuckDB file --------------------
    temp_dir = tempfile.gettempdir()
    db_file_path = os.path.join(temp_dir, "temp_duckdb_rag.db")

    engine = create_engine(f"duckdb:///{db_file_path}")

    # -------------------- 3. Create table if not exists --------------------
    with engine.begin() as connection:
        existing_tables = connection.execute(text("SHOW TABLES")).fetchall()
        if not any("products" in row[0] for row in existing_tables):
            products_df.to_sql("products", con=connection, index=False, if_exists="replace")

    # -------------------- 4. LangChain SQLDatabase --------------------
    db = SQLDatabase.from_uri(
        f"duckdb:///{db_file_path}",
        include_tables=["products"]
    )

    # -------------------- 5. SQL Execution Tool --------------------
    sql_tool = QuerySQLDatabaseTool(db=db)

    return sql_tool
