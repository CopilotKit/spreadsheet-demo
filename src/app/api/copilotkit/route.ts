import { CopilotBackend, OpenAIAdapter } from "@copilotkit/backend";
import { Action } from "@copilotkit/shared";
import { research } from "./tavily";

const researchAction: Action<any> = {
  name: "research",
  description: "Call this function to conduct research on a certain query.",
  parameters: [
    {
      name: "query",
      type: "string",
      description:
        "The query for doing research. 5 characters or longer. Might be multiple words",
    },
  ],
  handler: async ({ query }) => {
    console.log("Research query: ", query);
    const result = await research(query);
    console.log("Research result: ", result);
    return result;
  },
};

// ...

export async function POST(req: Request): Promise<Response> {

  const copilotKit = new CopilotBackend({
    actions: [ /* ... */ ],
    agents: [ /* ... */ ],
    // ...
    
    copilotCloud: {
      url: "https://cloud.copilotkit.ai",
      apiKey: "myVerySecretApiKey"
    }
  });

  return copilotKit.response(req, new OpenAIAdapter());
}
