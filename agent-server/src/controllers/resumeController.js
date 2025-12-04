import { base64ToPDFDocs } from "../services/pdfService.js";
import { createVectorStore } from "../services/vectorService.js";
import { parseResumeLLM } from "../services/llmService.js";
import { sessions } from "../utils/sessions.js";

export async function parseResume(req, res) {
  try {
    const { fileBase64 } = req.body;

    const docs = await base64ToPDFDocs(fileBase64, "resume.pdf");
    const vectorStore = await createVectorStore(docs);

    const resumeText = docs.map(d => d.pageContent).join("\n");
    const parsedData = await parseResumeLLM(resumeText);

    const sessionId = Date.now().toString();
    sessions.set(sessionId, { vectorStore, parsedData, resumeText });

    res.json({ parsedData, sessionId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
