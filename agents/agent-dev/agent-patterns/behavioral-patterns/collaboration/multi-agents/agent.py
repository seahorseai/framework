from typing import TypedDict, Literal, List, Dict

from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from langchain_core.tools import Tool

from langchain_experimental.tools import PythonREPLTool
from langchain_community.tools import DuckDuckGoSearchRun

from openapikey import load_openai_api_key

import mlflow
import time

# =========================================================
# 📊 MLflow
# =========================================================

mlflow.set_tracking_uri("sqlite:///mlflow.db")
mlflow.set_experiment("langgraph-corrected-reasoning-system")

# =========================================================
# 🤖 MODEL
# =========================================================

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    api_key=load_openai_api_key()
)

# =========================================================
# 🧰 TOOLS
# =========================================================

python_tool = PythonREPLTool()
search_tool = DuckDuckGoSearchRun()

tools = [
    Tool(
        name="python_repl",
        func=python_tool.run,
        description="Run Python code"
    ),
    Tool(
        name="web_search",
        func=search_tool.run,
        description="Search the web"
    ),
]

llm_with_tools = llm.bind_tools(tools)

# =========================================================
# 🧠 STATE
# =========================================================

class State(TypedDict):
    input: str
    domain: str
    plan: List[str]
    step: int
    output: str
    reflection_count: int

# =========================================================
# 📊 HELPERS
# =========================================================

def log_metric(name: str, value: float):
    if mlflow.active_run():
        mlflow.log_metric(name, value)

def log_text(name: str, text: str):
    if mlflow.active_run():
        mlflow.log_text(text, name)

# =========================================================
# 🔀 ROUTER
# =========================================================

class RouteDecision(TypedDict):
    domain: Literal["math", "neuroscience", "computing"]

def router(state: State) -> State:
    start = time.time()

    res = llm.with_structured_output(RouteDecision).invoke(
        f"Classify the domain: {state['input']}"
    )

    log_metric("router_latency", time.time() - start)

    return {**state, "domain": res["domain"]}

# =========================================================
# 🧭 PLANNER (ONLY STEPS)
# =========================================================

class Plan(TypedDict):
    steps: List[str]

def planner(state: State) -> State:

    res = llm.with_structured_output(Plan).invoke(f"""
Break this task into 3–5 clear steps.

User task:
{state['input']}
""")

    return {
        **state,
        "plan": res["steps"],
        "step": 0,
        "output": ""
    }

# =========================================================
# 🤖 WORKERS (ACCUMULATING OUTPUT)
# =========================================================

def create_worker(role: str, domain: str):

    def worker(state: State):

        step = state["plan"][state["step"]]

        response = llm_with_tools.invoke([
            ("system", f"""
You are a {role}.

Domain: {domain}

Rules:
- Solve ONLY the given step
- Be precise and structured
- You may use tools if necessary
"""),
            ("user", f"""
Task: {state['input']}
Step: {step}

Previous work:
{state['output']}
""")
        ])

        new_output = state["output"] + "\n" + response.content

        return {
            **state,
            "output": new_output
        }

    return worker

# =========================================================
# 🧑‍🏫 WORKERS
# =========================================================

math_workers = {
    "algebra": create_worker("Algebra Teacher", "Mathematics"),
    "calculus": create_worker("Calculus Teacher", "Mathematics"),
    "statistics": create_worker("Statistics Teacher", "Mathematics"),
    "default": create_worker("General Math Teacher", "Mathematics"),
}

computing_workers = {
    "cloud": create_worker("Cloud Expert", "Computer Science"),
    "software": create_worker("Software Engineer", "Computer Science"),
    "ai": create_worker("AI Engineer", "Computer Science"),
    "default": create_worker("General CS Expert", "Computer Science"),
}

neuro_workers = {
    "computational": create_worker("Computational Neuroscience", "Neuroscience"),
    "bci": create_worker("Brain-Computer Interfaces", "Neuroscience"),
    "neuromorphic": create_worker("Neuromorphic Engineering", "Neuroscience"),
    "cognitive": create_worker("Cognitive Neuroscience", "Neuroscience"),
    "neuroethology": create_worker("Neuroethology", "Neuroscience"),
    "default": create_worker("General Neuroscience Expert", "Neuroscience"),
}

# =========================================================
# 🧑‍🏫 HEAD PROFESSOR (FINAL ANSWER)
# =========================================================

def create_head(domain: str):

    def head(state: State):

        res = llm.invoke([
            ("system", f"""
You are Head Professor of {domain}.

You must:
- Review all work
- Produce a final correct answer
- Be clear and structured
"""),
            ("user", state["output"])
        ])

        return {
            **state,
            "output": res.content
        }

    return head

math_head = create_head("Mathematics")
neuro_head = create_head("Neuroscience")
comp_head = create_head("Computer Science")

# =========================================================
# 🔁 REFLECTION (ONLY AFTER FINAL ANSWER)
# =========================================================

MAX_REFLECTIONS = 2

def reflect(state: State):

    critique = llm.invoke(f"""
Critique this answer:

{state['output']}
""").content

    improved = llm.invoke(f"""
Improve this answer using the critique:

Critique:
{critique}

Answer:
{state['output']}
""").content

    return {
        **state,
        "output": improved,
        "reflection_count": state["reflection_count"] + 1
    }

def should_reflect(state: State):
    return "again" if state["reflection_count"] < MAX_REFLECTIONS else "end"

# =========================================================
# 🎯 WORKER SELECTION (SIMPLE + SAFE)
# =========================================================

def select_worker(step_name: str, workers: Dict[str, any]):

    step = step_name.lower()

    for key in workers:
        if key in step:
            return workers[key]

    return workers["default"]

# =========================================================
# 🎯 ORCHESTRATOR
# =========================================================

def run_worker(worker, state: State):

    return worker(state)

def make_orchestrator(workers, head, domain):

    def orchestrator(state: State):

        step_idx = state["step"]
        step_name = state["plan"][step_idx]

        worker = select_worker(step_name, workers)

        state = run_worker(worker, state)

        step_idx += 1

        # FINAL STEP → HEAD FIRST → THEN REFLECTION ENTRY POINT
        if step_idx >= len(state["plan"]):

            final = head(state)

            return {
                **state,
                "step": step_idx,
                "output": final["output"]
            }

        return {
            **state,
            "step": step_idx
        }

    return orchestrator

# =========================================================
# 🔗 GRAPH
# =========================================================

graph = StateGraph(State)

graph.add_node("router", router)
graph.add_node("planner", planner)

graph.add_node("math_orch", make_orchestrator(math_workers, math_head, "math"))
graph.add_node("neuro_orch", make_orchestrator(neuro_workers, neuro_head, "neuro"))
graph.add_node("comp_orch", make_orchestrator(computing_workers, comp_head, "comp"))

graph.add_node("reflect", reflect)

graph.add_edge(START, "router")
graph.add_edge("router", "planner")

graph.add_conditional_edges(
    "planner",
    lambda s: s["domain"],
    {
        "math": "math_orch",
        "neuroscience": "neuro_orch",
        "computing": "comp_orch",
    },
)

graph.add_edge("math_orch", "reflect")
graph.add_edge("neuro_orch", "reflect")
graph.add_edge("comp_orch", "reflect")

graph.add_conditional_edges(
    "reflect",
    should_reflect,
    {"again": "reflect", "end": END},
)

app = graph.compile()

# =========================================================
# 🚀 RUN
# =========================================================

if __name__ == "__main__":

    with mlflow.start_run(run_name="fixed-reasoning-system"):

        result = app.invoke({
            "input": "Write Python code for quicksort",
            "domain": "",
            "plan": [],
            "step": 0,
            "output": "",
            "reflection_count": 0,
        })

        print("\n=========== FINAL OUTPUT ===========\n")
        print(result["output"])