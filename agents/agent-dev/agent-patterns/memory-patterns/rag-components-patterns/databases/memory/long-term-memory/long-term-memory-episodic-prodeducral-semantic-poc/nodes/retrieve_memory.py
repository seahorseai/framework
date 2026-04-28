from init.init_memory import episodic, semantic, procedural
from memory.agent_state import AgentState

# ----------------------------------------------------
# 2. Node: Retrieve Memory
# ----------------------------------------------------
def retrieve_memory(state: AgentState):

    user_id = state.user_id
    query = state.user_input

    episodic_docs = episodic.search_user_episodes(query, user_id=user_id)
    semantic_docs = semantic.search(query).get("documents", [[]])[0]
    procedural_docs = procedural.search(query)

    return {
        "episodic_recall": episodic_docs,
        "semantic_recall": semantic_docs,
        "procedural_recall": procedural_docs,
    }