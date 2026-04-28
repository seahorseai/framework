
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from openapikey import load_openai_api_key

#ETL

def build_retriever():
    """
    ETL pipeline:
    1. Write sample document
    2. Load → Split → Embed → Build FAISS index
    3. Return retriever
    """

    # 1. Create sample document
    with open("state_of_the_union.txt", "w") as f:
        f.write("""
Today, the president said: 'Climate change is one of the most pressing issues of our time, 
and we must act now to ensure a better future for our children and grandchildren.'
He also emphasized unity and economic recovery.
""")

    # 2. Load → Split → Embed → FAISS
    loader = TextLoader("state_of_the_union.txt")
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=0
    )
    texts = text_splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings(openai_api_key=load_openai_api_key())
    vectorstore = FAISS.from_documents(texts, embeddings)

    # 3. Return retriever
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    return retriever
