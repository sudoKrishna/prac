import OpenAI from "openai";
import { get_current_time } from "./tool";

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
];

const toolRegistry: Record<string, () => Promise<string>> = {
  get_current_time,
};

// async function runAgent(userMessage: string) {
//   const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
//     { role: "user", content: userMessage },
//   ];

//   const MAX_ITERATIONS = 5;

//   for (let i = 0; i < MAX_ITERATIONS; i++) {
//     console.log(`\n--- Loop iteration ${i + 1} ---`);

//     const response = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages,
//       tools,
//     });

//     const choice  :any= response.choices[0];
//     const responseMessage = choice.message;

//     const toolCalls = responseMessage.tool_calls;

//     if (!toolCalls || toolCalls.length === 0) {
//       console.log("Final answer:", responseMessage.content);
//       return responseMessage.content;
//     }


//     messages.push(responseMessage);

//     for (const toolCall of toolCalls) {
//       const toolName = toolCall.function.name;
//       console.log("Model wants to call tool:", toolName);

//       const args = JSON.parse(toolCall.function.arguments || "{}");

//       const toolFn = toolRegistry[toolName];
//       if (!toolFn) {
//         throw new Error(`No tool registered for: ${toolName}`);
//       }

//       const result = await toolFn();
//       console.log("Tool result:", result);

//       messages.push({
//         role: "tool",
//         tool_call_id: toolCall.id,
//         content: result,
//       });
//     }

//   }

//   console.log("Hit max iterations without a final answer.");
//   return null;
// }


async function  runAgent(userMessage : string) {
    const messages : OpenAI.Chat.ChatCompletionMessageParam[] = [
        {role : "user" , content : userMessage}
    ];

   const MAX_ITERATIONS = 5;
   let i = 0;

   while(i < MAX_ITERATIONS) {
    console.log(`\n--- Loop iteration ${i + 1} ---`)

    const response = await client.chat.completions.create({
        model : "get-4o-mini",
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

    for(const toolCall of toolCalls) {
        const toolName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments || "{}");

        const toolFn = toolRegistry[toolName];
        if(!toolFn) {
            throw new Error(`No tool regitered for : ${toolName}`)
        }

        const result = await toolFn();
        console.log("tool result :" , result);

        messages.push({
            role : "tool",
            tool_call_id : toolCall.id,
            content : result
        })
    }
    i++;
   }

   console.log("hit max interation withtout the finnal terminal")


   return null;

}
