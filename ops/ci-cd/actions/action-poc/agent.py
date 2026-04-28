# agent.py
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

# Define a simple tool
@tool
def add(x: int, y: int) -> int:
    """Add two numbers together."""
    return x + y

tools = [add]

# Set up an LLM (requires OPENAI_API_KEY in env)
model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Create ReAct agent with tools
agent = create_react_agent(model, tools)

if __name__ == "__main__":
    # Run one interaction
    result = agent.invoke(
        {"messages": [{"role": "user", "content": "What is 2 + 3?"}]}
    )
    print(result["messages"][-1].content)
