import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/profile";
import { filterProjects } from "../lib/filterProjects";

const ALL = "All";

export default function ProjectsWithFilter() {
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [query, setQuery] = useState("");

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
    () => filterProjects(sorted, { category: activeFilter, query }),
    [sorted, activeFilter, query]
  );

  const hasQuery = query.trim() !== "";

  return (
    <div className="space-y-6">
      <input
        type="search"
        aria-label="Search projects"
        placeholder="Search projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-sm outline-none"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
        }}
      />

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
          {hasQuery ? "No projects match your search." : "No projects in this category."}
        </p>
      )}
    </div>
  );
}
