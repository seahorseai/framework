from memory.vector_memories import EpisodicMemory, SemanticMemory
from memory.procedural_memory import ProceduralMemoryMongo

# ----------------------------------------------------
# 1. Initialize Memories
# ----------------------------------------------------
episodic = EpisodicMemory(name="episodic", path="episodic_db")
semantic = SemanticMemory(name="semantic", path="semantic_db")
procedural = ProceduralMemoryMongo(mongo_uri="YOUR_MONGO_URI")