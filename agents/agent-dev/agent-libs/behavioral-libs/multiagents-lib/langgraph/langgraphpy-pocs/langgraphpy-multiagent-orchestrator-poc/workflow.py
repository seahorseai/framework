from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from langgraph.graph import StateGraph, START, END
from openapikey import load_openai_api_key
from typing import TypedDict

# Initialize LLM
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    api_key=load_openai_api_key()
)

from typing import TypedDict

class State(TypedDict):
    input: str
    output: str

# --- Define Agents ---
agent_a = create_agent(
    model=llm,
    tools=[],
    system_prompt="You are a summarization agent. Summarize the given text in 2-3 sentences."
)

agent_b = create_agent(
    model=llm,
    tools=[],
    system_prompt="You are an entity extraction agent. Extract all key entities (people, places, organizations) from the input text."
)

# --- Node Functions ---
def summarizer_node(state: State) -> State:
    result = agent_a.invoke({"messages": [{"role": "user", "content": state["input"]}]})
    # Extract the final message content
    final_message = result["messages"][-1]
    text = final_message.content if hasattr(final_message, "content") else str(final_message)
    return {"input": state["input"], "output": text}

def entity_extractor_node(state: State) -> State:
    result = agent_b.invoke({"messages": [{"role": "user", "content": state["output"]}]})
    final_message = result["messages"][-1]
    text = final_message.content if hasattr(final_message, "content") else str(final_message)
    return {"input": state["output"], "output": text}




# --- Initialize Graph ---
graph = StateGraph(State)

# 1️⃣ Add nodes
graph.add_node("summarizer", summarizer_node)
graph.add_node("extrator", entity_extractor_node)

# 2️⃣ Connect edges using node objects
graph.add_edge(START, "summarizer")
graph.add_edge("summarizer", "extrator")
graph.add_edge("extrator", END)

# 3️⃣ Compile the graph
app = graph.compile()

# -----------------------------
# 4️⃣ Run the workflow
# -----------------------------
text_input = """
OpenAI recently released GPT-4, a new large language model.
It can generate code, summarize articles, and even write poetry.
Many companies like Microsoft and Google are exploring similar AI technologies.
"""

# Invoke the compiled graph
result = app.invoke({"input": text_input})

# Print the output from the last node
print(result["output"])
