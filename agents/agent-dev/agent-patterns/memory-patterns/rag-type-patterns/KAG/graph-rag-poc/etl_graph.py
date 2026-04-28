import wikipedia
import json
import re
from langchain.chat_models import init_chat_model
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.messages.human import HumanMessage
from neo4j import GraphDatabase
from openapikey import load_openai_api_key

# -----------------------------
# 1. Load Wikipedia page
# -----------------------------
page = wikipedia.page("Elizabeth I")
text = page.content[:3000]  # Limit to first 3000 chars for demo

# -----------------------------
# 2. Prompt LLM to extract entities and relationships
# -----------------------------
prompt = PromptTemplate(
    input_variables=["text"],
    template="""
Extract entities and relationships from the following text.
Return output in JSON with the format:
[
  {{ "subject": "...", "relationship": "...", "object": "..." }},
  ...
]

Text:
{text}
"""
)

# Initialize LLM
llm = init_chat_model(
    model="openai:gpt-4",
    temperature=0.1,
    max_tokens=1000,
    timeout=30,
    openai_api_key=load_openai_api_key()
)

# Format prompt
formatted_prompt = prompt.format(text=text)

# -----------------------------
# 2b. Generate response
# -----------------------------
# generate() expects a list of conversations, each conversation is a list of messages
chat_result = llm.generate([[HumanMessage(content=formatted_prompt)]])
llm_output = chat_result.generations[0][0].text

# -----------------------------
# 2c. Clean JSON if GPT adds extra text
# -----------------------------
match = re.search(r"\[.*\]", llm_output, re.DOTALL)
if match:
    json_text = match.group()
else:
    raise ValueError("Could not extract JSON from LLM output")

relations = json.loads(json_text)

# -----------------------------
# 3. Save to Neo4j (v5+ compatible)
# -----------------------------
uri = "bolt://localhost:7687"
username = "neo4j"
password = "your_password"  # <-- replace with your Neo4j password
driver = GraphDatabase.driver(uri, auth=(username, password))

def create_kg(tx, subject, relationship, object_):
    tx.run(
        """
        MERGE (a:Entity {name: $subject})
        MERGE (b:Entity {name: $object})
        MERGE (a)-[r:RELATION {type: $relationship}]->(b)
        """,
        subject=subject,
        object=object_,      # matches $object in Cypher
        relationship=relationship
    )

with driver.session() as session:
    for r in relations:
        session.execute_write(
            create_kg,
            r["subject"],
            r["relationship"],
            r["object"]
        )

print("Knowledge graph saved to Neo4j!")
