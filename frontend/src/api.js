const API_BASE = "http://127.0.0.1:8000";

export async function chat(query, conversationHistory = []) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      conversation_history: conversationHistory,
    }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }
  
  return res.json();
}
