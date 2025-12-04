import { sessions } from "../utils/sessions.js";
import { tavilySearch } from "../services/tavilyService.js";
import { chatWithModel } from "../services/llmService.js";

export async function chat(req, res) {
  try {
    const { message, sessionId } = req.body;

    if (!sessions.has(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    const { resumeText, parsedData } = sessions.get(sessionId);

    const skills = parsedData.skills?.join(" ") || "";
    const location = parsedData.location || "Ethiopia";

    const query = `${skills} jobs in ${location}\nUser Ask: ${message}`;

    const jobs = await tavilySearch(query);

    const answer = await chatWithModel(resumeText, message, jobs);

    res.json({ text: answer, jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
