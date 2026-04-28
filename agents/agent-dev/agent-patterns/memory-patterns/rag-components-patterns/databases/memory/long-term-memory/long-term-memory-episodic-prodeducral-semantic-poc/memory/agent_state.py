# agent_state.py
from pydantic import BaseModel, Field

class AgentState(BaseModel):
    user_input: str
    user_id: str

    episodic_recall: list = Field(default_factory=list)
    semantic_recall: list = Field(default_factory=list)
    procedural_recall: list = Field(default_factory=list)

    response: str = ""
