import { TavilySearch } from "@langchain/tavily";
import { TAVILY_API_KEY } from "../config/env.js";

export async function tavilySearch(query) {
  try {
    const client = new TavilySearch({
      maxResults: 5,
      apiKey: TAVILY_API_KEY,
      searchDepth: "basic",
    });

    const results = await client.invoke({ query });
    return results || [];
  } catch (err) {
    console.error("Tavily error:", err);
    return [];
  }
}
