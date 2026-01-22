import { useState, forwardRef, useImperativeHandle } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

const MAX_LENGTH = 2000;

const ChatInput = forwardRef(({ onSendMessage, loading, onQuery }, ref) => {
  const [query, setQuery] = useState("");

  useImperativeHandle(ref, () => ({
    setQuery: (text) => setQuery(text)
  }));

  const submit = async () => {
    if (!query.trim() || loading || query.length > MAX_LENGTH) return;

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

  const handleChange = (e) => {
    const value = e.target.value;
    // Allow typing but show warning if over limit
    setQuery(value);
  };

  const remaining = MAX_LENGTH - query.length;
  const isOverLimit = remaining < 0;
  const showCounter = query.length > MAX_LENGTH * 0.8; // Show when 80% full

  return (
    <div className="w-full max-w-xl mb-8">
      <div
        className="flex items-center w-full rounded-2xl px-4 py-2"
        style={{
          backgroundColor: 'white',
          border: `1px solid ${isOverLimit ? '#ef4444' : 'var(--border)'}`,
        }}
      >
        <input
          className="flex-1 bg-transparent outline-none px-2"
          style={{ color: 'var(--text-primary)' }}
          placeholder="Ask me anything..."
          value={query}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button
          onClick={submit}
          disabled={loading || !query.trim() || isOverLimit}
          className="rounded-xl w-10 h-10 flex items-center justify-center transition"
          style={{
            backgroundColor: loading || !query.trim() || isOverLimit ? 'var(--bg-secondary)' : 'var(--accent)',
            color: loading || !query.trim() || isOverLimit ? 'var(--text-secondary)' : 'white',
            cursor: loading || !query.trim() || isOverLimit ? 'not-allowed' : 'pointer',
            opacity: loading || !query.trim() || isOverLimit ? 0.5 : 1,
          }}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Character counter */}
      {showCounter && (
        <div 
          className="text-xs mt-1 px-2 text-right"
          style={{ 
            color: isOverLimit ? '#ef4444' : remaining < 200 ? '#f59e0b' : 'var(--text-secondary)'
          }}
        >
          {isOverLimit ? (
            <span>Message too long by {Math.abs(remaining)} characters</span>
          ) : (
            <span>{remaining} characters remaining</span>
          )}
        </div>
      )}
    </div>
  );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;
