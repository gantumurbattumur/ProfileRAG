import { useState, useRef, useEffect } from "react";
import ChatInput from "./components/ChatInput";
import ActionCards from "./components/ActionCards";
import ProjectCard from "./components/ProjectCard";
import SkillsCard from "./components/SkillsCard";
import ExperienceCard from "./components/ExperienceCard";
import { chat } from "./api";
import { projects, experience, skills, contact } from "./data/profile";

// Static section keywords
const SECTION_KEYWORDS = {
  about: ["tell me about gana", "about gana", "who is gana", "about yourself"],
  projects: ["show projects", "projects", "what projects", "your projects"],
  skills: ["what skills", "skills", "your skills", "technologies"],
  experience: ["work experience", "experience", "job history", "where worked"],
};

function detectSection(query) {
  const q = query.toLowerCase().trim();
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some(k => q.includes(k) || q === k)) {
      return section;
    }
  }
  return null;
}

// Static about response
const aboutContent = `I'm Gana — a software engineer passionate about building AI-powered applications that solve real problems.

I specialize in full-stack development with a focus on LLMs, RAG systems, and production-grade backends. Currently based in Seattle, open to opportunities.

• Email: ${contact.email}
• Location: ${contact.location}
• LinkedIn: [linkedin.com/in/gantumur-battumur](https://linkedin.com/in/gantumur-battumur)

📄 [Download Resume](/Gana_Battumur_Resume.pdf)`;

// Helper to render markdown-style links
function renderContent(content) {
  // Match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    // Add the link
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target={match[2].startsWith('/') ? '_self' : '_blank'}
        rel="noopener noreferrer"
        download={match[2].endsWith('.pdf')}
        className="inline-flex items-center gap-1 font-medium hover:underline"
        style={{ color: 'var(--accent)' }}
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length > 0 ? parts : content;
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatInputRef = useRef(null);
  const messagesRef = useRef(null);

  const handleSendMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendQuery = async (queryText) => {
    if (!queryText.trim() || loading) return;

    const section = detectSection(queryText);
    handleSendMessage({ role: "user", content: queryText });

    // Handle static sections
    if (section === "about") {
      handleSendMessage({ role: "assistant", content: aboutContent });
      return;
    }
    if (section === "projects") {
      handleSendMessage({ role: "assistant", content: "Here are my projects:", viewType: "projects" });
      return;
    }
    if (section === "skills") {
      handleSendMessage({ role: "assistant", content: "Here are my technical skills:", viewType: "skills" });
      return;
    }
    if (section === "experience") {
      handleSendMessage({ role: "assistant", content: "Here's my work experience:", viewType: "experience" });
      return;
    }

    // Use RAG for other questions
    setLoading(true);
    try {
      const conversationHistory = messages
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await chat(queryText, conversationHistory);
      handleSendMessage({ role: "assistant", content: response.answer });
    } catch (error) {
      handleSendMessage({
        role: "assistant",
        content: `Sorry, I encountered an error. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleHomeClick = () => {
    setMessages([]);
    if (chatInputRef?.current?.setQuery) {
      chatInputRef.current.setQuery('');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {messages.length > 0 && (
        <button
          onClick={handleHomeClick}
          className="absolute top-6 left-6 rounded-full px-4 py-2 text-sm hover:opacity-80 transition"
          style={{
            backgroundColor: 'white',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          Home
        </button>
      )}

      <div className="flex flex-col items-center w-full max-w-2xl">
        {messages.length === 0 ? (
          <ActionCards onActionClick={sendQuery} />
        ) : (
          <>
            <div ref={messagesRef} className="w-full mb-6 space-y-4 max-h-[65vh] overflow-y-auto py-4">
              {messages.map((msg, idx) => (
                <div key={idx}>
                  {/* User message */}
                  {msg.role === "user" && (
                    <div className="flex justify-end">
                      <div
                        className="max-w-[85%] rounded-2xl px-4 py-3"
                        style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  )}

                  {/* Assistant message */}
                  {msg.role === "assistant" && (
                    <div className="space-y-3">
                      <div className="flex justify-start">
                        <div
                          className="max-w-[85%] rounded-2xl px-4 py-3"
                          style={{
                            backgroundColor: 'white',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{renderContent(msg.content)}</p>
                        </div>
                      </div>

                      {/* Projects cards */}
                      {msg.viewType === "projects" && (
                        <div className="space-y-3 mt-2">
                          {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                          ))}
                        </div>
                      )}

                      {/* Skills card */}
                      {msg.viewType === "skills" && (
                        <div className="mt-2">
                          <SkillsCard />
                        </div>
                      )}

                      {/* Experience cards */}
                      {msg.viewType === "experience" && (
                        <div className="space-y-3 mt-2">
                          {experience.map((exp) => (
                            <ExperienceCard key={exp.id} experience={exp} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="rounded-2xl px-4 py-3"
                    style={{ backgroundColor: 'white', border: '1px solid var(--border)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <ChatInput
              onSendMessage={handleSendMessage}
              onQuery={sendQuery}
              loading={loading}
              ref={chatInputRef}
            />

            {/* Quick prompts at bottom */}
            <div className="w-full mt-4">
              <ActionCards onActionClick={sendQuery} isChat={true} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
