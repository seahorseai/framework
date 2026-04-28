
from langchain.tools import tool
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings  # updated import
from langchain.tools.retriever import create_retriever_tool
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from openapikey import load_openai_api_key



@tool
def build_schema_retriever_tool():
    """Builds a FAISS vector store from schema docs and returns a retriever tool."""

    # --- Embeddings ---
    embedding = OpenAIEmbeddings(openai_api_key=load_openai_api_key)

    # --- Schema documents ---
    schema_docs = [
        Document(page_content="""
        Table: products
        Columns: id (int), name (text), price (float), category (text), stock (int)
        """),
        Document(page_content="""
        You can query products by filtering on price and category.
        For example: Find all electronics under $50.
        """),
    ]

    # --- Split ---
    splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=0)
    split_docs = splitter.split_documents(schema_docs)

    # --- FAISS Index ---
    faiss_index = FAISS.from_documents(split_docs, embedding)
    retriever = faiss_index.as_retriever()

    # --- Tool ---
    retriever_tool = create_retriever_tool(
        retriever,
        name="schema_context_tool",
        description="Provides context about the schema and how to query the product database."
    )

    return retriever_tool

