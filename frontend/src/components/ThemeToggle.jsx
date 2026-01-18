import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label="Toggle theme"
      className="absolute top-6 right-6 bg-white dark:bg-zinc-900 shadow rounded-full p-2 flex items-center gap-2 hover:scale-105 transition"
    >
      <Sun className={`w-5 h-5 ${isDark ? 'opacity-40' : 'opacity-100'}`} />
      <Moon className={`w-5 h-5 ${isDark ? 'opacity-100' : 'opacity-40'}`} />
    </button>
  );
}
