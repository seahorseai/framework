from langchain.tools import tool
from etl_graph import driver


# --- Step 1: Define Neo4j search tool ---
@tool
def search_graph_database(query: str, limit: int = 5) -> str:
    """Search the Elizabeth I knowledge graph in Neo4j."""
    with driver.session() as session:
        result = session.run(
            """
            MATCH (p:Paragraph)
            WHERE toLower(p.text) CONTAINS toLower($kw)
            RETURN p.text AS paragraph
            LIMIT $limit
            """,
            kw=query,
            limit=limit
        )
        paragraphs = [record["paragraph"] for record in result]
        return "\n\n".join(paragraphs) if paragraphs else "No results found."