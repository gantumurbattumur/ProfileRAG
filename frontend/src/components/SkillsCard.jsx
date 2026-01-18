import { skills } from "../data/profile";
import { cardBase } from "../styles/cardStyles";

export default function SkillsCard() {
  return (
    <div className={cardBase}>
      <div className="space-y-5">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category}>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-sm">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {skillList.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-lg text-sm text-zinc-700 dark:text-zinc-300"
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
