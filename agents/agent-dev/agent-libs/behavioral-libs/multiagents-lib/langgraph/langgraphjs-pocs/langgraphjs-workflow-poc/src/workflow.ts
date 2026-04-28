import { ChatOpenAI } from "@langchain/openai";
import { loadOpenAIApiKey } from "./loadEnv.js";
import { HumanMessage } from "@langchain/core/messages";
import { StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";

const StateSchema = z.object({
  input: z.string(),
  output: z.string().optional(),
});

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: loadOpenAIApiKey(),
});

const llmNode = async (state: z.infer<typeof StateSchema>) => {
  const response = await llm.invoke([
    new HumanMessage(state.input),
  ]);
  return { output: response.content as string };
};



const graph = new StateGraph({
  state: StateSchema,
  input: z.object({ input: z.string() }),
  output: z.object({ output: z.string() }),
})
  .addNode("llmNode", llmNode)
  .addEdge(START, "llmNode")
  .addEdge("llmNode", END)
  .compile();


async function run() {
  const result = await graph.invoke({
    input: "Explain LangGraph in one sentence.",
  });

  console.log(result.output);
}

run();