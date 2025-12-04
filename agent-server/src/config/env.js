import dotenv from "dotenv";
dotenv.config();

export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
export const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
export const MODEL_NAME = "gemini-2.5-flash";
