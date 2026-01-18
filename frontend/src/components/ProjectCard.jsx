import { cardFull } from "../styles/cardStyles";

export default function ProjectCard({ project }) {
  const initials = project.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const techTags = Array.isArray(project.tech)
    ? project.tech
    : (project.tech || "").split(",").map(t => t.trim()).filter(Boolean);

  return (
    <div className={cardFull}>
      <div className="flex gap-4 items-start flex-col sm:flex-row">
        {/* Image/GIF Thumbnail */}
        <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-2xl">{initials}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{project.title}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{project.type} • {project.year}</p>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm mt-3 leading-relaxed">{project.description}</p>

          <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {techTags.slice(0, 5).map((t, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-3 items-center">
              {project.links && project.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}