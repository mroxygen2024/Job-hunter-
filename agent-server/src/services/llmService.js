import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MODEL_NAME, GOOGLE_API_KEY } from "../config/env.js";

export async function parseResumeLLM(resumeText) {
  const model = new ChatGoogleGenerativeAI({
    model: MODEL_NAME,
    apiKey: GOOGLE_API_KEY,
    temperature: 0.2,
  });

  const template = `
Extract structured resume data in JSON with:
- name
- skills
- experience
- education
- location

Resume:
{resume}

Return ONLY JSON.
`;
  const prompt = new PromptTemplate({
    template,
    inputVariables: ["resume"],
  });

  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  const response = await chain.invoke({ resume: resumeText });

  return JSON.parse(response.replace(/```json|```/g, "").trim());
}

export async function chatWithModel(context, question, jobs) {
  const model = new ChatGoogleGenerativeAI({
    model: MODEL_NAME,
    apiKey: GOOGLE_API_KEY,
  });

  const template = `
Use the resume and job search results to answer.

Resume:
{context}

User Question:
{question}

Job Results:
{jobs}

Give a clear short answer.
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
