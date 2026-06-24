import OpenAI from "openai";
import { get_current_time , calculator } from "./tool";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const tools = [
  {
    type: "function" as const,
    function: {
      name: "get_current_time",
      description: "Get the current local time in HH:MM:SS format.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
  type: "function" as const,
  function: {
    name: "calculator",
    description: "Perform a basic arithmetic operation (add, subtract, multiply, divide) on two numbers.",
    parameters: {
      type: "object",
      properties: {
        a: { type: "number", description: "the first number" },
        b: { type: "number", description: "the second number" },
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"],
          description: "Which operation to perform",
        },
      },
      required: ["a", "b", "operation"],
    },
  },
},
];

const toolRegistry: Record<string, (...args: any[]) => Promise<string>> = {
  get_current_time,
  calculator,
};


async function  runAgent(userMessage : string) {
    const messages : OpenAI.Chat.ChatCompletionMessageParam[] = [
        {role : "user" , content : userMessage}
    ];

   const MAX_ITERATIONS = 5;
   let i = 0;

   while(i < MAX_ITERATIONS) {
    console.log(`\n--- Loop iteration ${i + 1} ---`)

    const response = await client.chat.completions.create({
        model : "gpt-4o-mini",
        messages,
        tools
    });

    const responseMessage :any  = response.choices[0]?.message;
    const toolCalls = responseMessage.tool_calls;

    if(!toolCalls || toolCalls.length === 0) {
        console.log("Final answer"  , responseMessage.content)
        return responseMessage.content
    }
    messages.push(responseMessage)

    for (const toolCall of toolCalls) {
    const toolName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments || "{}");

    const toolFn = toolRegistry[toolName];
    if (!toolFn) {
        throw new Error(`No tool registered for: ${toolName}`);
    }

    let result: string;

    if (toolName === "calculator") {
        result = await calculator(args.a, args.b, args.operation);
    } else {
        result = await (toolFn as () => Promise<string>)();
    }

    console.log("tool result :", result);

    messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
    });
}
    i++;
   }

   console.log("hit max interation withtout the finnal terminal")


   return null;

}
runAgent("What is 47 times 89? Also tell me the current time.");
