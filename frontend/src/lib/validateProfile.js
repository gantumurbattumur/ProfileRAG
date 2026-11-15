// Pure validator for the portfolio content in src/data/profile.js.
// Returns an array of human-readable error strings; an empty array means valid.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const YEAR_RE = /^\d{4}$/
const PROJECT_LINK_TYPES = ['github', 'live']

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const isHttpsUrl = (value) => {
  if (typeof value !== 'string') return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function validateProfile(
  { projects, skills, experience, contact, resume },
  { publicFiles } = {},
) {
  const errors = []

  // projects
  if (!Array.isArray(projects)) {
    errors.push('projects must be an array')
  } else {
    const seenIds = new Set()
    projects.forEach((project, i) => {
      const title = project && typeof project.title === 'string' ? project.title : 'untitled'
      const where = `projects[${i}] (${title})`

      if (!project || typeof project !== 'object') {
        errors.push(`${where}: must be an object`)
        return
      }

      if (typeof project.id !== 'number' || !Number.isFinite(project.id)) {
        errors.push(`${where}: id must be a number`)
      } else if (seenIds.has(project.id)) {
        errors.push(`${where}: duplicate id ${project.id}`)
      } else {
        seenIds.add(project.id)
      }

      if (!isNonEmptyString(project.title)) {
        errors.push(`${where}: title must be a non-empty string`)
      }

      if (typeof project.year !== 'string' || !YEAR_RE.test(project.year)) {
        errors.push(`${where}: year must be a 4-digit string, got ${JSON.stringify(project.year)}`)
      }

      if (!Array.isArray(project.categories) || project.categories.length === 0) {
        errors.push(`${where}: categories must be a non-empty array`)
      }

      if (!Array.isArray(project.tech) && typeof project.tech !== 'string') {
        errors.push(`${where}: tech must be an array or a string`)
      }

      if (project.image !== undefined) {
        if (typeof project.image !== 'string' || !project.image.startsWith('/')) {
          errors.push(`${where}: image must start with "/"`)
        } else if (publicFiles && !publicFiles.has(project.image)) {
          errors.push(`${where}: image ${project.image} not found in public/`)
        }
      }

      if (project.links !== undefined) {
        if (!Array.isArray(project.links)) {
          errors.push(`${where}: links must be an array`)
        } else {
          project.links.forEach((link, j) => {
            if (!link || !isNonEmptyString(link.label)) {
              errors.push(`${where}: link ${j} label must be a non-empty string`)
            }
            if (typeof link?.url !== 'string' || !link.url.startsWith('https://')) {
              errors.push(`${where}: link ${j} url must start with https://`)
            }
            if (!PROJECT_LINK_TYPES.includes(link?.type)) {
              errors.push(
                `${where}: link ${j} type must be "github" or "live", got ${JSON.stringify(link?.type)}`,
              )
            }
          })
        }
      }
    })
  }

  // experience
  if (!Array.isArray(experience)) {
    errors.push('experience must be an array')
  } else {
    experience.forEach((job, i) => {
      const where = `experience[${i}] (${job?.title ?? 'untitled'})`
      if (!job || typeof job !== 'object') {
        errors.push(`${where}: must be an object`)
        return
      }
      if (job.id === undefined || job.id === null || job.id === '') {
        errors.push(`${where}: id is required`)
      }
      for (const field of ['title', 'company', 'period']) {
        if (!isNonEmptyString(job[field])) {
          errors.push(`${where}: ${field} must be a non-empty string`)
        }
      }
    })
  }

  // contact
  if (!contact || typeof contact !== 'object') {
    errors.push('contact must be an object')
  } else {
    if (typeof contact.email !== 'string' || !EMAIL_RE.test(contact.email)) {
      errors.push(`contact.email must be a valid email, got ${JSON.stringify(contact.email)}`)
    }
    if (contact.links !== undefined) {
      if (!Array.isArray(contact.links)) {
        errors.push('contact.links must be an array')
      } else {
        contact.links.forEach((link, i) => {
          const url = link?.url
          const ok =
            typeof url === 'string' && (url.startsWith('https://') || url.startsWith('mailto:'))
          if (!ok) {
            errors.push(
              `contact.links[${i}] (${link?.label ?? 'untitled'}) url must be https:// or mailto:`,
            )
          }
        })
      }
    }
  }

  // resume
  if (!resume || typeof resume !== 'object') {
    errors.push('resume must be an object')
  } else if (!isHttpsUrl(resume.url)) {
    errors.push(`resume.url must be an https URL, got ${JSON.stringify(resume.url)}`)
  }

  // skills
  if (!skills || typeof skills !== 'object' || Array.isArray(skills)) {
    errors.push('skills must be an object mapping category names to arrays')
  } else {
    for (const [category, entries] of Object.entries(skills)) {
      if (!Array.isArray(entries) || entries.length === 0) {
        errors.push(`skills["${category}"] must be a non-empty array`)
        continue
      }
      entries.forEach((entry, i) => {
        if (!isNonEmptyString(entry)) {
          errors.push(`skills["${category}"][${i}] must be a non-empty string`)
        }
      })
    }
  }

  return errors
}
