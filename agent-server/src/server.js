

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
// import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { TavilySearch } from "@langchain/tavily";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

const MODEL_NAME = "gemini-2.5-flash";
const sessions = new Map();

/** --------------------------
 *  Helper Functions
 * -------------------------*/

// Convert Base64 PDF → LangChain docs
async function base64ToPDFDocs(base64, filename) {
  const buffer = Buffer.from(base64, "base64");
  const tempPath = path.join(process.cwd(), `tmp-${Date.now()}-${filename}`);
  fs.writeFileSync(tempPath, buffer);

  const loader = new PDFLoader(tempPath);
  const docs = await loader.load();

  fs.unlinkSync(tempPath);
  return docs;
}

// Create vector store from PDF documents
async function createVectorStore(docs) {
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 150 });
  const chunks = await splitter.splitDocuments(docs);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  return MemoryVectorStore.fromDocuments(chunks, embeddings);
}

// Parse resume with structured output via LLM
async function parseResumeLLM(resumeText) {
  const model = new ChatGoogleGenerativeAI({
    model: MODEL_NAME,
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.2,
  });

  const template = `
Extract structured resume data in JSON format with fields:
- name
- skills (array)
- experience (array of objects)
- education (array of objects)
- location (optional)

Resume Text:
{resume}

Return ONLY valid JSON.
`;

  const prompt = new PromptTemplate({ template, inputVariables: ["resume"] });
  const chain = prompt.pipe(model).pipe(new StringOutputParser());

  const response = await chain.invoke({ resume: resumeText });
  return JSON.parse(response.replace(/```json|```/g, "").trim());
}

// Tavily Search using LangChain retriever
async function tavilySearch(query) {
  try {
    const retriever = new TavilySearch({
      maxResults: 5, // number of top results
      apiKey: process.env.TAVILY_API_KEY,
    });
    const results = await retriever.invoke(query);
    console.log("Tavily search results:", results);
    return results || [];
  } catch (err) {
    console.error("Tavily search error:", err);
    return [];
  }
}

/** --------------------------
 *  Routes
 * -------------------------*/

// 1️⃣ Parse Resume → Create Session
app.post("/parse-resume", async (req, res) => {
  try {
    const { fileBase64 } = req.body;

    const pdfDocs = await base64ToPDFDocs(fileBase64, "resume.pdf");
    const vectorStore = await createVectorStore(pdfDocs);

    const resumeText = pdfDocs.map((d) => d.pageContent).join("\n");
    const parsedData = await parseResumeLLM(resumeText);

    const sessionId = Date.now().toString();
    sessions.set(sessionId, { vectorStore, parsedData, resumeText });

    res.json({ parsedData, sessionId });
  } catch (err) {
    console.error("Parse Resume Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ Chat + Job Search
app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!sessions.has(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    const { resumeText, parsedData } = sessions.get(sessionId);

    // Build a query using skills and location
    const skills = parsedData.skills?.join(" ") || "";
    const location = parsedData.location || "Ethiopia";
    const query = `${skills} jobs in ${location}\n\nUser Question: ${message}`;

    // 🔍 Retrieve jobs from Tavily
    const jobsResults = await tavilySearch(query);
    console.log("Jobs Results:", jobsResults);

    // AI assistant response
    const model = new ChatGoogleGenerativeAI({ model: MODEL_NAME, apiKey: process.env.GOOGLE_API_KEY });
    const template = `
You are an AI assistant using the user's resume and online job search results.

Resume:
{context}

User Question:
{question}

Jobs Found Online:
{jobs}

Provide a concise, helpful answer recommending relevant jobs.
`;

    const prompt = new PromptTemplate({ template, inputVariables: ["context", "question", "jobs"] });
    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const answer = await chain.invoke({
      context: resumeText,
      question: message,
      jobs: JSON.stringify(jobsResults, null, 2),
    });

    res.json({ text: answer, jobs: jobsResults });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "Failed to generate response. " + err.message });
  }
});

/** --------------------------
 *  Start Server
 * -------------------------*/
app.listen(4000, () => console.log("🚀 Backend running on port 4000"));

// import dotenv from "dotenv";
// dotenv.config();
// import { TavilySearch } from "@langchain/tavily";

// const tool = new TavilySearch({
//   maxResults: 5,
//   // You can set other constructor parameters here, e.g.:
//   // topic: "general",
//   // includeAnswer: false,
//   // includeRawContent: false,
//   // includeImages: false,
//   searchDepth: "basic",
//    apiKey: process.env.TAVILY_API_KEY,
// });

// // Invoke with a query
// const results = await tool.invoke({
//   query: "what is the current weather in SF?",
// });

// console.log(results);