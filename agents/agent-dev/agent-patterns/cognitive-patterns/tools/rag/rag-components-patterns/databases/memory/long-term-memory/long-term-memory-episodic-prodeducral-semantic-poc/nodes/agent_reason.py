
from init.init_llm import llm
from memory.agent_state import AgentState

# ----------------------------------------------------
# 3. Node: LLM Reasoning
# ----------------------------------------------------
def agent_reason(state: AgentState):

    prompt = f"""
You are a multi-memory AI agent.

USER: {state.user_input}

EPISODIC MEMORY (User-specific):
{state.episodic_recall}

SEMANTIC MEMORY (facts):
{state.semantic_recall}

PROCEDURAL MEMORY (MongoDB workflows):
{state.procedural_recall}

Use episodic for personal history,
semantic for facts,
procedural for workflows.
"""

    answer = llm.invoke(prompt).content
    return {"response": answer}