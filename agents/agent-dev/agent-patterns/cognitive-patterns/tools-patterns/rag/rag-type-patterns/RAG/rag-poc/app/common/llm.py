from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.config.config import settings

llm = ChatOpenAI(
    model=settings.CHAT_MODEL,
    temperature=settings.TEMPERATURE,
    api_key=settings.OPENAI_API_KEY
)

prompt = ChatPromptTemplate.from_template(
    """
    You are a helpful assistant.

    Answer the question using the provided context.

    Question:
    {question}

    Context:
    {context}

    If the context is empty, answer using general knowledge.
    """
)

chain = prompt | llm | StrOutputParser()


def generate(question, context=None):
    return chain.invoke(
        {
            "question": question,
            "context": context if context else "N/A"
        }
    )
