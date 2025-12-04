const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export const parseResume = async (base64) => {
  const resp = await fetch(`${API_BASE}/parse-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileBase64: base64 }),
  });
  if (!resp.ok) throw new Error(await resp.text() || "Failed to parse resume");
  return await resp.json();
};

export const chatMessage = async (sessionId, message) => {
  const resp = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });
  if (!resp.ok) throw new Error(await resp.text() || "Chat request failed");
  return await resp.json();
};
