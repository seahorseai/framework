from memory.agent_state import AgentState
from init.init_llm import llm
from init.init_memory import semantic, procedural, episodic
# ----------------------------------------------------
# 4. Node: Store Memories
# ----------------------------------------------------
def store_memory(state: AgentState):

    # Always store episodic memory per user
    episodic.add_episode(
        text=f"USER: {state.user_input}\nASSISTANT: {state.response}",
        user_id=state.user_id
    )

    # Extract semantic + procedural memories
    extraction = llm.invoke(f"""
Extract from the assistant response:

facts: [list of factual statements]
procedures: [list of workflows / step-by-step instructions]

Response:
{state.response}
""").json()

    for fact in extraction.get("facts", []):
        semantic.add_fact(fact)

    for proc in extraction.get("procedures", []):
        procedural.add_skill(
            skill_name="auto_extracted",
            steps=proc,
            tags=["auto"]
        )

    return {}