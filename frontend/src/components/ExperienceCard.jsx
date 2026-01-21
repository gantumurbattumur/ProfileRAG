const cardStyle = {
  backgroundColor: 'white',
  border: '1px solid var(--border)',
  borderRadius: '0.75rem',
  padding: '1rem',
};

export default function ExperienceCard({ experience }) {
  // Split description into bullet points (by periods or already has bullets)
  const bullets = experience.description
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 10)
    .slice(0, 3);

  const techTags = (experience.tech || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div style={cardStyle}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3
            className="font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {experience.title}
          </h3>
          <p
            className="text-sm"
            style={{ color: 'var(--accent)' }}
          >
            {experience.company}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p
            className="text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            {experience.period}
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            {experience.location}
          </p>
        </div>
      </div>

      <ul className="mt-2 space-y-1">
        {bullets.map((bullet, idx) => (
          <li
            key={idx}
            className="text-sm flex items-start gap-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span style={{ color: 'var(--accent)' }}>•</span>
            <span>{bullet.trim()}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-1.5 flex-wrap mt-3">
        {techTags.map((t, idx) => (
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
      </div>
    </div>
  );
}
