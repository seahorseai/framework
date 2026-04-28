from openai import OpenAI
from app.config.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

class LLMService:
    def generate_answer(self, question: str, context: list[str] = None):
        context_text = "\n\n".join(context) if context else "No additional context provided"

        prompt = f"""
You are a helpful assistant.

Answer the user's question using the provided context if relevant.

Question:
{question}

Context:
{context_text}

Rules:
- If the context is relevant, use it.
- If the context is insufficient, say so.
- Keep the answer concise and factual.
"""

        response = client.chat.completions.create(
            model=settings.CHAT_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        return response.choices[0].message.content

    def rewrite_query(self, question: str):
        prompt = f"""
Rewrite the following user question to improve semantic retrieval.

Question:
{question}

Return only the rewritten query.
"""

        response = client.chat.completions.create(
            model=settings.CHAT_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )

        return response.choices[0].message.content.strip()