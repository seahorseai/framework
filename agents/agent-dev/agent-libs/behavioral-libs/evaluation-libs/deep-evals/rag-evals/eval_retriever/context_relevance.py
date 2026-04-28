from deepeval.test_case import LLMTestCase
from deepeval.metrics import ContextualRelevancyMetric
from langchain_core.messages import ToolMessage
from agent import app, config

# Run agent
result = app.invoke(
    {"messages": [("user", "What did the president say about climate change?")]},
    config=config
)

# 1. Final answer
actual_output = result["messages"][-1].content

# 2. Extract retriever output (ToolMessage)
tool_messages = [m for m in result["messages"] if isinstance(m, ToolMessage)]

retrieval_context = []
if tool_messages:
    retrieval_context = [tool_messages[-1].content]

# 3. Test case
test_case = LLMTestCase(
    input="What did the president say about climate change?",
    actual_output=actual_output,
    retrieval_context=retrieval_context
)

# 4. Metric
metric = ContextualRelevancyMetric(threshold=0.7, model="gpt-4o")
metric.measure(test_case)

print("Contextual Relevancy Score:", metric.score)
print("Reason:", metric.reason)