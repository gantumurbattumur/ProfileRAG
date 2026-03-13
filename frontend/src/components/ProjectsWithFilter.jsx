import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/profile";

const FILTERS = ["All", "RAG & AI", "Full Stack", "Research"];

export default function ProjectsWithFilter() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered =
        activeFilter === "All"
            ? projects
            : projects.filter(
                (p) => p.categories && p.categories.includes(activeFilter)
            );

    return (
        <div className="space-y-4 w-full">
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {FILTERS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className="text-xs px-3 py-1 rounded-full font-medium transition-colors"
                        style={{
                            backgroundColor:
                                activeFilter === filter
                                    ? 'var(--accent)'
                                    : 'var(--bg-secondary)',
                            color:
                                activeFilter === filter
                                    ? 'white'
                                    : 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Projects List */}
            <div className="space-y-4">
                {filtered.length > 0 ? (
                    filtered.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p style={{ color: 'var(--text-secondary)' }}>No projects found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
