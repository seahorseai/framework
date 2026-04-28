# agent.py
from langgraph.graph import StateGraph, END, START

from memory.agent_state import AgentState
from nodes.retrieve_memory import retrieve_memory
from nodes.agent_reason import agent_reason
from nodes.store_memory import store_memory


# ----------------------------------------------------
# 5. Build LangGraph Pipeline
# ----------------------------------------------------
graph = StateGraph(AgentState)

# Add nodes
graph.add_node("retrieve", retrieve_memory)
graph.add_node("reason", agent_reason)
graph.add_node("store", store_memory)

# Add edges
graph.add_edge(START, "retrieve")
graph.add_edge("retrieve", "reason")
graph.add_edge("reason", "store")
graph.add_edge("store", END)

app = graph.compile()
