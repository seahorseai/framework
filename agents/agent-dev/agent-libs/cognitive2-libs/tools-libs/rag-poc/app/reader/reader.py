from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional
from app.common.llm import generate
from app.common.embeddings import embed_query
from app.common.vectorstore import search


class AgentState(TypedDict):
    question: str
    rewritten_question: Optional[str]
    use_rag: bool
    context: Optional[list]
    answer: Optional[str]


def decide_rag(state: AgentState):
    question = state["question"]
    keywords = ["document", "based", "according", "file"]
    use_rag = any(k in question.lower() for k in keywords)

    return {
        **state,
        "use_rag": use_rag
    }


def rewrite_query(state: AgentState):
    rewritten = f"Detailed information about: {state['question']}"

    return {
        **state,
        "rewritten_question": rewritten
    }


def retrieve_context(state: AgentState):
    query = state.get("rewritten_question") or state["question"]
    query_embedding = embed_query(query)
    context = search(query_embedding)

    return {
        **state,
        "context": context
    }


def validate_context(state: AgentState):
    context = state.get("context", [])

    if not context:
        return {
            **state,
            "answer": "No relevant information found in the documents."
        }

    return state


def generate_answer(state: AgentState):
    answer = generate(
        question=state["question"],
        context=state.get("context")
    )

    return {
        **state,
        "answer": answer
    }


def route_after_decision(state: AgentState):
    return "rewrite" if state["use_rag"] else "generate"


def route_after_validation(state: AgentState):
    return "generate" if not state.get("answer") else END


builder = StateGraph(AgentState)

builder.add_node("decide", decide_rag)
builder.add_node("rewrite", rewrite_query)
builder.add_node("retrieve", retrieve_context)
builder.add_node("validate", validate_context)
builder.add_node("generate", generate_answer)

builder.set_entry_point("decide")

builder.add_conditional_edges(
    "decide",
    route_after_decision,
    {
        "rewrite": "rewrite",
        "generate": "generate"
    }
)

builder.add_edge("rewrite", "retrieve")
builder.add_edge("retrieve", "validate")

builder.add_conditional_edges(
    "validate",
    route_after_validation,
    {
        "generate": "generate",
        END: END
    }
)

builder.add_edge("generate", END)

agent_graph = builder.compile()


def handle_question(question: str):
    result = agent_graph.invoke(
        {
            "question": question,
            "rewritten_question": None,
            "use_rag": False,
            "context": None,
            "answer": None
        }
    )

    return result["answer"]