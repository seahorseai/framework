import { ChatOpenAI } from "@langchain/openai";
import { createAgent, tool } from "langchain";
import { loadOpenAIApiKey } from "./loadEnv.js";
import { z } from "zod";

export const multiplyTool = tool(
  async ({ a, b }: { a: number; b: number }) => {
    return `${a} × ${b} = ${a * b}`;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number().describe("First number"),
      b: z.number().describe("Second number")
    })
  }
);


const agent = createAgent({
  model: new ChatOpenAI({
    model: "gpt-4",
    temperature: 0.1,
    maxTokens: 1000,
    timeout: 60_000, // 60 seconds
    apiKey: loadOpenAIApiKey()
  }),
  tools: [multiplyTool],
  systemPrompt: "You are a helpful assistant. Be concise and accurate."
});



const result = await agent.invoke({
  messages: [{ role: "user", content: "use the tool for multiply 2 x 2" }],  
});


// Get the last message
const messages = result.messages;
const finalMessage = messages[messages.length - 1]?.content ?? "No response";

// ------------------------------------------------------------------
// Final output
// ------------------------------------------------------------------
console.log("\n=== Agent Response ===");
console.log(finalMessage);
