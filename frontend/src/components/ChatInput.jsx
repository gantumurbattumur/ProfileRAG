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
    <div className="flex items-center w-full max-w-xl bg-white dark:bg-zinc-900 shadow rounded-full px-4 py-2 mb-8">
      <input
        className="flex-1 bg-transparent outline-none px-2 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
        placeholder="Ask me anything"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />
      <button
        onClick={submit}
        disabled={loading || !query.trim()}
        className={`rounded-full w-10 h-10 flex items-center justify-center transition ${loading || !query.trim()
            ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-50"
            : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          }`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <ArrowUp className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;
