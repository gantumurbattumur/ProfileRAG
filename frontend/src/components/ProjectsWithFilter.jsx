import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/profile";

const ALL = "All";

export default function ProjectsWithFilter() {
  const [activeFilter, setActiveFilter] = useState(ALL);

  // Newest first; filter options come from the categories actually present in the data.
  const sorted = useMemo(
    () => [...projects].sort((a, b) => Number(b.year) - Number(a.year)),
    []
  );

  const filters = useMemo(
    () => [ALL, ...new Set(sorted.flatMap((p) => p.categories || []))],
    [sorted]
  );

  const filtered = useMemo(
    () =>
      activeFilter === ALL
        ? sorted
        : sorted.filter((p) => p.categories?.includes(activeFilter)),
    [sorted, activeFilter]
  );

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = filter === activeFilter;
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveFilter(filter)}
              className="cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? "var(--accent)" : "var(--bg-secondary)",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((project) => (
            <div key={project.id} className="min-w-0">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center" style={{ color: "var(--text-secondary)" }}>
          No projects in this category.
        </p>
      )}
    </div>
  );
}
