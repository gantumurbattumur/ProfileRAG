const cardStyle = {
  backgroundColor: 'white',
  border: '1px solid var(--border)',
  borderRadius: '0.75rem',
  padding: '1rem',
};

export default function ProjectCard({ project }) {
  const techTags = Array.isArray(project.tech)
    ? project.tech
    : (project.tech || "").split(",").map(t => t.trim()).filter(Boolean);

  return (
    <div style={cardStyle}>
      <div className="flex gap-4 items-start">
        {/* Image Thumbnail */}
        <div
          className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              className="font-semibold text-lg"
              style={{ color: 'var(--accent)' }}
            >
              {project.title.substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className="font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {project.title}
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                {project.type} • {project.year}
              </p>
            </div>
            <div className="flex gap-2">
              {project.links && project.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <p
            className="text-sm mt-2 line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {project.description}
          </p>

          <div className="flex gap-1.5 flex-wrap mt-2">
            {techTags.slice(0, 6).map((t, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                }}
              >
                {t}
              </span>
            ))}
            {techTags.length > 6 && (
              <span
                className="text-xs px-2 py-0.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                +{techTags.length - 6} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}