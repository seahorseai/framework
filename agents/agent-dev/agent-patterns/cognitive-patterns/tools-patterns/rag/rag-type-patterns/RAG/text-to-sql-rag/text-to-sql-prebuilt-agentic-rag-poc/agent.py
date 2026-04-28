# -------------------- Imports --------------------
from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from openapikey import load_openai_api_key
from sql_etl import build_sql_tool
from vector_etl import build_schema_retriever_tool



# -------------------- 5. Create Agent --------------------

llm = init_chat_model(
    model="openai:gpt-4",       # or openai:gpt-4o
    temperature=0,
    max_tokens=1000,
    timeout=30,
    openai_api_key=load_openai_api_key,
)

agent = create_agent(
    model=llm,
    tools=[build_schema_retriever_tool, build_sql_tool],
    system_prompt=(
        "You are an assistant that helps answer product-related questions "
        "using SQL over a DuckDB database. Be concise and accurate."
    ),
)

# -------------------- 6. Runner --------------------

def ask_question(nl_query: str):
    result = agent.invoke({"input": nl_query})
    return result["messages"][-1].content

if __name__ == "__main__":
    query = "Show me all products under 20 dollars in the electronics category"
    print(ask_question(query))
