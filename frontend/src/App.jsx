import Hero from "./components/Hero";
import ProjectsWithFilter from "./components/ProjectsWithFilter";
import SkillsCard from "./components/SkillsCard";
import ExperienceCard from "./components/ExperienceCard";
import AskAI from "./components/AskAI";
import { experience, contact } from "./data/profile";

const NAV = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "ask", label: "Ask AI" },
  { id: "contact", label: "Contact" },
];

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-20 space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function App() {
  const contactLinks = contact.links.filter((l) => l.label !== "Portfolio");

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <header
        className="sticky top-0 z-10"
        style={{ backgroundColor: "var(--bg-primary)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
            Gana Battumur
          </a>
          <nav className="flex gap-4 overflow-x-auto whitespace-nowrap text-sm">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="hover:underline"
                style={{ color: "var(--text-secondary)" }}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-5xl space-y-20 px-4 pb-16 sm:px-6">
        <Hero />

        <Section id="projects" title="Projects">
          <ProjectsWithFilter />
        </Section>

        <Section id="skills" title="Skills">
          <SkillsCard />
        </Section>

        <Section id="experience" title="Experience">
          <div className="space-y-4">
            {experience.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </Section>

        <Section id="ask" title="Ask my AI">
          <AskAI />
        </Section>

        <Section id="contact" title="Contact">
          <p style={{ color: "var(--text-secondary)" }}>{contact.location}</p>
          <div className="flex flex-wrap gap-4">
            {contactLinks.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target={l.url.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline"
                style={{ color: "var(--accent)" }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </Section>

        <footer className="pt-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Gana Battumur
        </footer>
      </main>
    </div>
  );
}
