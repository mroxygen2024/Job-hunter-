import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MODEL_NAME, GOOGLE_API_KEY } from "../config/env.js";

/** ---------------------------------------------
 *  Parse Resume Text → Structured JSON
 * --------------------------------------------- */
export async function parseResumeLLM(resumeText) {
  const model = new ChatGoogleGenerativeAI({
    model: MODEL_NAME,
    apiKey: GOOGLE_API_KEY,
    temperature: 0.2,
  });

  const template = `
Extract structured resume data in valid JSON with fields:
- name (string)
- skills (array)
- experience (array)
- education (array)
- location (string, optional)

Resume:
{resume}

Return ONLY JSON. No explanations.
`;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["resume"],
  });

  const chain = prompt.pipe(model).pipe(new StringOutputParser());

  // 👉 FIX: invoke the chain to get actual LLM output
  const response = await chain.invoke({ resume: resumeText });

  console.log("LLM Resume Parse Response:", response);

  // 👉 Clean Markdown fence if model adds it
  const jsonString = response.replace(/```json|```/g, "").trim();

  const parsed = JSON.parse(jsonString);

  // 👉 Normalize fields to avoid frontend crashes
  return {
    name: parsed.name || "",
    skills: Array.isArray(parsed.skills)
      ? parsed.skills
      : typeof parsed.skills === "string"
      ? parsed.skills.split(",").map(s => s.trim())
      : [],
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    location: parsed.location || "",
  };
}

/** ---------------------------------------------
 *  Chat + Job Recommendation
 * --------------------------------------------- */
export async function chatWithModel(context, question, jobs) {
  const model = new ChatGoogleGenerativeAI({
    model: MODEL_NAME,
    apiKey: GOOGLE_API_KEY,
  });

  const template = `
Use the resume details and the job search results to answer the user's question.

Resume:
{context}

User Question:
{question}

Job Results:
{jobs}

Give a clear, helpful, short response.
`;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["context", "question", "jobs"],
  });

  const chain = prompt.pipe(model).pipe(new StringOutputParser());

  return chain.invoke({
    context,
    question,
    jobs: JSON.stringify(jobs, null, 2),
  });
}
