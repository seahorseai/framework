from typing import TypedDict
from langchain_openai import ChatOpenAI

from langgraph.graph import StateGraph, START, END
from openapikey import load_openai_api_key

from typing import TypedDict
from typing_extensions import Literal

from pydantic import BaseModel, Field

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI

# Initialize OpenAI chat model
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    api_key=load_openai_api_key
    
)

# ---------------------------------------------------------
# 2. ROUTER SCHEMA — add new routes here
# ---------------------------------------------------------
class Route(BaseModel):
    route: Literal["story", "joke", "poem"] = Field(
        ..., description="Which generator to send the request to."
    )


router_llm = llm.with_structured_output(Route, method="function_calling")


# ---------------------------------------------------------
# 3. SHARED STATE
# ---------------------------------------------------------
class State(TypedDict):
    input: str          # user prompt
    route: str          # router decision
    output: str         # final result


# ---------------------------------------------------------
# 4. ROUTER NODE
# ---------------------------------------------------------
def choose_route(state: State) -> dict:
    """LLM decides the best route."""
    decision: Route = router_llm.invoke(
        [
            SystemMessage(content=(
                "You are a routing model. "
                "Decide if the user wants a story, joke, or poem."
            )),
            HumanMessage(content=state["input"])
        ]
    )
    return {"route": decision.route}


# ---------------------------------------------------------
# 5. ROUTE HANDLERS
# ---------------------------------------------------------
def write_story(state: State) -> dict:
    out = llm.invoke(f"Write a short story based on: {state['input']}")
    return {"output": out.content}


def write_joke(state: State) -> dict:
    out = llm.invoke(f"Write a joke about: {state['input']}")
    return {"output": out.content}


def write_poem(state: State) -> dict:
    out = llm.invoke(f"Write a poem about: {state['input']}")
    return {"output": out.content}


# ---------------------------------------------------------
# 6. DECISION MAPPER — simple + expandable
# ---------------------------------------------------------
def route_switch(state: State):
    return {
        "story": "story_node",
        "joke": "joke_node",
        "poem": "poem_node",
    }[state["route"]]


# ---------------------------------------------------------
# 7. BUILD THE GRAPH
# ---------------------------------------------------------
graph = StateGraph(State)

# Add nodes
graph.add_node("router", choose_route)
graph.add_node("story_node", write_story)
graph.add_node("joke_node", write_joke)
graph.add_node("poem_node", write_poem)

# Edges
graph.add_edge(START, "router")
graph.add_conditional_edges(
    "router",
    route_switch,
)

# End edges
graph.add_edge("story_node", END)
graph.add_edge("joke_node", END)
graph.add_edge("poem_node", END)

# Compile runnable workflow
workflow = graph.compile()


# ---------------------------------------------------------
# 8. EXAMPLE RUN
# ---------------------------------------------------------
if __name__ == "__main__":
    user_prompt = "Tell me a joke about engineers"
    result = workflow.invoke({"input": user_prompt})

    print("\n🎉 Final Output:\n")
    print(result["output"])