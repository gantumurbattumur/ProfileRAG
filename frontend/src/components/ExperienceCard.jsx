import { cardBase } from "../styles/cardStyles";

export default function ExperienceCard({ experience }) {
  return (
    <div className={cardBase}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {experience.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {experience.company}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
            {experience.period}
          </p>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-right">
          {experience.location}
        </p>
      </div>

      <p className="text-zinc-700 dark:text-zinc-300 text-sm mt-4 leading-relaxed">
        {experience.description}
      </p>

      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">
        <strong>Tech:</strong> {experience.tech}
      </div>
    </div>
  );
}
