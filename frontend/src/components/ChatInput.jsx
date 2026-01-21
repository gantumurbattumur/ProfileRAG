import { useState, forwardRef, useImperativeHandle } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

const ChatInput = forwardRef(({ onSendMessage, loading, onQuery }, ref) => {
  const [query, setQuery] = useState("");

  useImperativeHandle(ref, () => ({
    setQuery: (text) => setQuery(text)
  }));

  const submit = async () => {
    if (!query.trim() || loading) return;

    const userMessage = query.trim();
    setQuery("");

    if (onQuery) {
      onQuery(userMessage);
    } else {
      onSendMessage({ role: "user", content: userMessage });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className="flex items-center w-full max-w-xl rounded-2xl px-4 py-2 mb-8"
      style={{
        backgroundColor: 'white',
        border: '1px solid var(--border)',
      }}
    >
      <input
        className="flex-1 bg-transparent outline-none px-2"
        style={{ color: 'var(--text-primary)' }}
        placeholder="Ask me anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />
      <button
        onClick={submit}
        disabled={loading || !query.trim()}
        className="rounded-xl w-10 h-10 flex items-center justify-center transition"
        style={{
          backgroundColor: loading || !query.trim() ? 'var(--bg-secondary)' : 'var(--accent)',
          color: loading || !query.trim() ? 'var(--text-secondary)' : 'white',
          cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
          opacity: loading || !query.trim() ? 0.5 : 1,
        }}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <ArrowUp className="w-5 h-5" />
        )}
      </button>
    </div>
  );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;
