import { skills } from "../data/profile";

const cardStyle = {
  backgroundColor: 'white',
  border: '1px solid var(--border)',
  borderRadius: '1rem',
  padding: '1.5rem',
};

export default function SkillsCard() {
  return (
    <div style={cardStyle}>
      <div className="space-y-5">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category}>
            <h4
              className="font-semibold mb-3 text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {skillList.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
