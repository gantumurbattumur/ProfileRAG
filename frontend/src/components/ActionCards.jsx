import { useState, useRef } from "react";
import { User, Briefcase, Puzzle, Sparkles, Search, Mail } from "lucide-react";

const sections = [
  { label: "About Me", icon: User, value: "AboutMe" },
  { label: "Projects", icon: Briefcase, value: "Projects" },
  { label: "Skills", icon: Puzzle, value: "Skills" },
  { label: "Experience", icon: Sparkles, value: "Experience" },
  { label: "Contact", icon: Mail, value: "Contact" },
];

export default function ActionCards({ onActionClick, isChat = false }) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef(null);

  const submit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    if (onActionClick) onActionClick(query);
    setQuery("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  };

  // Chat mode: show only navigation buttons at bottom
  if (isChat) {
    return (
      <div className="flex gap-2 flex-wrap justify-center">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => onActionClick && onActionClick(s.value)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
            >
              <Icon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{s.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Home mode: show full hero with composer and buttons
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="mb-4 text-center text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
        I'm Gana Battumur!
      </h1>

      <form onSubmit={submit} className="w-full max-w-2xl">
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-md rounded-2xl p-3 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800">
            <Search className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
          </div>

          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything or search my portfolio"
            className="flex-1 resize-none bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 min-h-[44px] max-h-40 p-1"
            rows={1}
          />

          <button
            type="submit"
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow"
            aria-label="Search"
          >
            Ask
          </button>
        </div>
      </form>

      <div className="w-full max-w-2xl mt-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
        <div className="flex gap-3 flex-wrap justify-center">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => onActionClick && onActionClick(s.value)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
