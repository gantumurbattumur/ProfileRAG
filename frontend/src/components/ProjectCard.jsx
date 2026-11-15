import { ExternalLink } from "lucide-react";

const MAX_TAGS = 8;

export default function ProjectCard({ project }) {
  const techTags = Array.isArray(project.tech)
    ? project.tech
    : (project.tech || "").split(",").map((t) => t.trim()).filter(Boolean);

  const initials = project.title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className="flex flex-col overflow-hidden rounded-2xl"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Preview */}
      <div
        className="flex aspect-video w-full items-center justify-center overflow-hidden"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl font-semibold" style={{ color: "var(--accent)" }}>
            {initials}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
            {project.type} · {project.year}
          </p>
          <h3 className="mt-1 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {project.title}
          </h3>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {techTags.slice(0, MAX_TAGS).map((t) => (
            <span
              key={t}
              className="rounded px-2 py-0.5 text-xs"
              style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)" }}
            >
              {t}
            </span>
          ))}
          {techTags.length > MAX_TAGS && (
            <span className="px-2 py-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              +{techTags.length - MAX_TAGS} more
            </span>
          )}
        </div>

        {project.links?.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-2">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                style={{ color: "var(--accent)" }}
              >
                {link.label}
                {link.type === "live" && <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
