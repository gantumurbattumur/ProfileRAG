import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { contact } from "../data/profile";

const ICONS = { GitHub: Github, LinkedIn: Linkedin, Email: Mail };

export default function Hero() {
  const socials = contact.links.filter((l) => ICONS[l.label]);

  return (
    <section className="space-y-6 pt-8 sm:pt-16">
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {contact.location} · Open to opportunities
      </p>

      <h1
        className="text-4xl font-semibold tracking-tight sm:text-5xl"
        style={{ color: "var(--text-primary)" }}
      >
        Gana Battumur
      </h1>

      <p className="max-w-2xl text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        Software engineer building AI-powered applications: RAG systems, LLM evaluation tools,
        and full-stack products.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
        >
          See projects
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>

        <a
          href="/Gana_Battumur_Resume.pdf"
          download
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Resume
        </a>

        {socials.map((s) => {
          const Icon = ICONS[s.label];
          return (
            <a
              key={s.label}
              href={s.url}
              target={s.url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
