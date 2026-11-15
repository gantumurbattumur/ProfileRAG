const ALL = "All";

function normalizeTech(tech) {
  if (Array.isArray(tech)) return tech;
  if (typeof tech === "string") return tech.split(",");
  return [];
}

function matchesQuery(project, needle) {
  const fields = [
    project.title,
    project.description,
    project.type,
    ...normalizeTech(project.tech),
  ];
  return fields.some(
    (value) => typeof value === "string" && value.toLowerCase().includes(needle)
  );
}

/**
 * Returns a new array of projects matching the category and text query.
 * Does not mutate the input.
 *
 * @param {Array<object>} projects
 * @param {{ category?: string, query?: string }} [options]
 */
export function filterProjects(projects, { category = ALL, query = "" } = {}) {
  const needle = String(query ?? "").trim().toLowerCase();

  return projects.filter((project) => {
    if (category !== ALL && !project.categories?.includes(category)) {
      return false;
    }
    if (needle && !matchesQuery(project, needle)) {
      return false;
    }
    return true;
  });
}
