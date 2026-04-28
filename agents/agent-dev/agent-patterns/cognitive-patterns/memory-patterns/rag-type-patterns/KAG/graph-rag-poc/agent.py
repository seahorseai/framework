from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from search_graph_tool import search_graph_database
from openapikey import load_openai_api_key


# Create agent with the tool
agent = create_agent(
    model=init_chat_model(
        model="openai:gpt-4",  
        temperature=0.1,
        max_tokens=1000,
        timeout=30,
        openai_api_key=load_openai_api_key()
        ),
    tools=[search_graph_database],
    system_prompt="You are a helpful assistant. Be concise and accurate."
)

# Ask the agent a friendly question
result = agent.invoke({"input": "Tell me about Elizabeth I's childhood"})

final_message = result["messages"][-1].content
print("\n=== Agent Response ===")
print(final_message)
