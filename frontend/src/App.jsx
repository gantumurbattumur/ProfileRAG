import { useState, useRef, useEffect } from "react";
import ChatInput from "./components/ChatInput";
import ActionCards from "./components/ActionCards";
import ThemeToggle from "./components/ThemeToggle";
import ProjectsWithFilter from "./components/ProjectsWithFilter";
import SkillsCard from "./components/SkillsCard";
import ExperienceCard from "./components/ExperienceCard";
import AboutMeCard from "./components/AboutMeCard";
import ContactForm from "./components/ContactForm";
import { chat } from "./api";
import { experience } from "./data/profile";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState(null); // 'projects', 'skills', 'experience', 'contact' or null
  const chatInputRef = useRef(null);
  const messagesRef = useRef(null);

  const handleSendMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendQuery = async (queryText) => {
    if (!queryText.trim() || loading) return;

    setLoading(true);

    // Add user message immediately
    handleSendMessage({ role: "user", content: queryText });

    try {
      // Build conversation history from existing messages
      const conversationHistory = messages
        .slice(-6) // Keep last 3 exchanges (6 messages)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await chat(queryText, conversationHistory);

      // Don't attach sources to assistant message for security / privacy in UI
      handleSendMessage({
        role: "assistant",
        content: response.answer,
        isCustomView: activeView === "aboutMe"
      });
    } catch (error) {
      handleSendMessage({
        role: "assistant",
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    // Handle special views that show custom components
    if (action === "Projects") {
      setActiveView("projects");
      handleSendMessage({ role: "user", content: "What are your projects?" });
      handleSendMessage({
        role: "assistant",
        content: "Sure, I can show you my projects",
        isCustomView: true
      });
    } else if (action === "Skills") {
      setActiveView("skills");
      handleSendMessage({ role: "user", content: "What are your skills? Give me a list of your soft and hard skills." });
      handleSendMessage({
        role: "assistant",
        content: "Sure, I can list my skills for you",
        isCustomView: true
      });
    } else if (action === "Experience") {
      setActiveView("experience");
      handleSendMessage({ role: "user", content: "What is your work experience?" });
      handleSendMessage({
        role: "assistant",
        content: "Here's my work experience",
        isCustomView: true
      });
    } else if (action === "AboutMe") {
      setActiveView("aboutMe");
      handleSendMessage({ role: "user", content: "Tell me about yourself" });
      handleSendMessage({
        role: "assistant",
        content: "Here's information about me",
        isCustomView: true
      });
    } else if (action === "Contact") {
      setActiveView("contact");
      handleSendMessage({ role: "user", content: "Contact me" });
      handleSendMessage({
        role: "assistant",
        content: "Send me a message directly",
        isCustomView: true
      });
    } else {
      // For regular chat queries
      setActiveView(null);
      sendQuery(action);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, activeView]);

  const handleHomeClick = () => {
    // Reset to home state
    setMessages([]);
    setActiveView(null);
    // Clear input
    if (chatInputRef && chatInputRef.current && chatInputRef.current.setQuery) {
      chatInputRef.current.setQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center px-4 relative">
      {/* Home button */}
      <button
        onClick={handleHomeClick}
        className="absolute top-6 left-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Home"
      >
        Home
      </button>

      <ThemeToggle />

      {/* Main content */}
      <div className="flex flex-col items-center w-full max-w-4xl">
        {/* Show home hero only when no messages */}
        {messages.length === 0 ? (
          <ActionCards onActionClick={handleActionClick} />
        ) : (
          <>
            {/* Chat messages container - shown when messages exist */}
            <div ref={messagesRef} className="w-full max-w-4xl mb-6 space-y-4 max-h-[520px] overflow-y-auto pt-4 pb-4">
              {messages.map((msg, idx) => (
                <div key={idx}>
                  {/* Regular chat message */}
                  {!msg.isCustomView && (
                    <div
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 shadow ${msg.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                          }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  )}

                  {/* Custom view components */}
                  {msg.isCustomView && msg.role === "assistant" && (
                    <div className="space-y-4">
                      {/* Assistant message */}
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg px-4 py-2 shadow bg-gray-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                          <p>{msg.content}</p>
                        </div>
                      </div>

                      {/* Projects View */}
                      {activeView === "projects" && (
                        <ProjectsWithFilter />
                      )}

                      {/* Skills View */}
                      {activeView === "skills" && <SkillsCard />}

                      {/* Experience View */}
                      {activeView === "experience" && (
                        <div className="space-y-4">
                          {experience.map((exp) => (
                            <ExperienceCard key={exp.id} experience={exp} />
                          ))}
                        </div>
                      )}

                      {/* About Me View */}
                      {activeView === "aboutMe" && (
                        <AboutMeCard />
                      )}

                      {/* Contact View */}
                      {activeView === "contact" && (
                        <ContactForm />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat input - shown when messages exist */}
            <ChatInput
              onSendMessage={handleSendMessage}
              onQuery={sendQuery}
              loading={loading}
              ref={chatInputRef}
            />

            {/* Always show section buttons at the bottom */}
            <div className="w-full mt-4">
              <ActionCards onActionClick={handleActionClick} isChat={true} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
