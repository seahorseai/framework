from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain.tools import tool
from openapikey import load_openai_api_key


# ----------------------------
# 1. TOOL SIMPLE (KISS)
# ----------------------------
@tool
def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b


# ----------------------------
# 2. MODEL
# ----------------------------
model = init_chat_model(
    model="openai:gpt-4o-mini",
    temperature=0.1,
    max_tokens=1000,
    timeout=30,
    openai_api_key=load_openai_api_key(),
)


# ----------------------------
# 3. AGENT (NEW API)
# ----------------------------
agent = create_agent(
    model=model,
    tools=[multiply],
    system_prompt="You are a helpful assistant. Use tools when needed."
)


# ----------------------------
# 4. INVOKE (CORRECT FORMAT)
# ----------------------------
result = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "What is 23 multiplied by 7?"
            }
        ]
    }
)


# ----------------------------
# 5. OUTPUT
# ----------------------------
final_message = result["messages"][-1].content

print("\n=== Agent Response ===")
print(final_message)