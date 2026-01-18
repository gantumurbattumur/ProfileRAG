import ProjectCard from "./ProjectCard";
import { projects } from "../data/profile";

export default function ProjectsWithFilter() {
    return (
        <div className="space-y-4 w-full">
            {/* Projects List */}
            <div className="space-y-4">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-zinc-600 dark:text-zinc-400">No projects yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
