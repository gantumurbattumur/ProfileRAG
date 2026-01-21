import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";

// Quick prompt suggestions
const prompts = [
  "Tell me about Gana",
  "Show projects",
  "What skills?",
  "Work experience",
];

export default function ActionCards({ onActionClick, isChat = false }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const submit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    if (onActionClick) onActionClick(query);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(e);
    }
  };

  // Chat mode: show quick prompts at bottom
  if (isChat) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onActionClick(p)}
            className="px-3 py-1.5 rounded-full text-sm transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
            }}
          >
            {p}
          </button>
        ))}
      </div>
    );
  }

  // Home: minimal centered design
  return (
    <div className="w-full flex flex-col items-center max-w-xl mx-auto">
      {/* Simple headline */}
      <h1
        className="text-2xl sm:text-3xl font-medium mb-8 text-center"
        style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
      >
        Ask me about Gana
      </h1>

      {/* Input */}
      <form onSubmit={submit} className="w-full mb-6">
        <div
          className="flex items-center rounded-full px-4 py-2"
          style={{
            backgroundColor: 'white',
            border: '1px solid var(--border)',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a question..."
            className="flex-1 bg-transparent outline-none py-2 px-2"
            style={{ color: 'var(--text-primary)' }}
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              backgroundColor: query.trim() ? 'var(--accent)' : 'var(--bg-secondary)',
              color: query.trim() ? 'white' : 'var(--text-secondary)',
            }}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2 justify-center">
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onActionClick(p)}
            className="px-3 py-1.5 rounded-full text-sm transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}