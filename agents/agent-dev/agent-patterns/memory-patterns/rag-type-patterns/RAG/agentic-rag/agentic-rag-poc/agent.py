# ========================
# WORKING AGENTIC RAG – November 2025 (v1.0 fixed)
# ========================


#from langchain_openai import ChatOpenAI
from langchain.chat_models import init_chat_model
from langchain_core.tools import tool

# UPDATED IMPORT FOR NOV 2025 (post-v1.0): Moved to langchain.agents
from langchain.agents import create_agent
from openapikey import load_openai_api_key
from vector_etl import build_retriever




#Agent

# ------------------------------
# 3. Retrieval tool
# ------------------------------
@tool
def doc_retriever(query: str) -> str:
    """Search the State of the Union document for relevant passages."""
    docs = build_retriever().invoke(query)
    return "\n\n".join([doc.page_content for doc in docs]) if docs else "No relevant documents found."




# ------------------------------
# 4. LLM + FORCE tool use on first turn (v1.0 way)
# ------------------------------
#llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=load_openai_api_key())


# System prompt for custom behavior
system_prompt = """
You are an assistant that answers questions using ONLY the doc_retriever tool.

MANDATORY RULES:
- You MUST call doc_retriever on the very first turn.
- Pass the user's original question to the tool exactly as-is (never rephrase).
- After getting the results, give a clear final answer based ONLY on the retrieved text.
"""



# v1.0 Signature: create_agent(llm, tools, system_prompt=..., checkpointer=...)
app = create_agent(
    model=init_chat_model(
        model="openai:gpt-4",  # or "openai:gpt-4o" for GPT-4o
        temperature=0.1,
        max_tokens=1000,
        timeout=30,
        openai_api_key=load_openai_api_key),
    tools=[doc_retriever],
    system_prompt = """
        You are an assistant that answers questions using ONLY the doc_retriever tool.

        MANDATORY RULES:
        - You MUST call doc_retriever on the very first turn.
        - Pass the user's original question to the tool exactly as-is (never rephrase).
        - After getting the results, give a clear final answer based ONLY on the retrieved text.
        """
)

# ------------------------------
# 5. Run it!
# ------------------------------
config = {"configurable": {"thread_id": "123"}}

result = app.invoke(
    {"messages": [("user", "What did the president say about climate change?")]},
    config=config
)

print("\nFinal Answer:")
print(result["messages"][-1].content)