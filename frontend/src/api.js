// Use environment variable for API URL, fallback to localhost for development
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Helper to retry requests with exponential backoff (for cold starts)
 */
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      // If we get a response (even error), return it
      return res;
    } catch (error) {
      // Network error or 502 - backend might be cold starting
      if (i === maxRetries - 1) throw error;
      
      // Wait before retry (exponential backoff: 2s, 4s, 8s)
      const delay = Math.pow(2, i + 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Send a chat query to the RAG backend.
 * @param {string} query - The user's question
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<{answer: string, sources: string[]}>}
 */
export async function chat(query, conversationHistory = []) {
  const res = await fetchWithRetry(`${API_BASE}/chat`, {
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
    // Handle rate limiting
    if (res.status === 429) {
      throw new Error("You're asking questions too quickly! Please wait a moment and try again.");
    }
    // Handle bad requests
    if (res.status === 400) {
      const error = await res.json().catch(() => ({ detail: "Invalid request" }));
      throw new Error(error.detail || "Please check your message and try again.");
    }
    // Handle server errors
    if (res.status >= 500) {
      throw new Error("The AI service is temporarily unavailable. Please try again in a moment.");
    }
    
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Something went wrong. Please try again.");
  }

  return res.json();
}

/**
 * Submit a contact form message.
 * @param {Object} data - Contact form data {name, email, message}
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitContact(data) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // Handle rate limiting
    if (res.status === 429) {
      throw new Error("Too many submissions. Please wait a few minutes before trying again.");
    }
    // Handle validation errors
    if (res.status === 400) {
      const error = await res.json().catch(() => ({ detail: "Invalid form data" }));
      throw new Error(error.detail || "Please check your form and try again.");
    }
    // Handle server errors
    if (res.status >= 500) {
      throw new Error("Unable to send message at this time. Please try reaching out via LinkedIn.");
    }
    
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Failed to send message. Please try again.");
  }

  return res.json();
}
