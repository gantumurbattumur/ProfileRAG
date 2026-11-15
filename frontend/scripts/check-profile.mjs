// Validates src/data/profile.js against the rules in src/lib/validateProfile.js.
// Usage: npm run check:profile

import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { projects, skills, experience, contact, resume } from '../src/data/profile.js'
import { validateProfile } from '../src/lib/validateProfile.js'

const publicDir = fileURLToPath(new URL('../public/', import.meta.url))
const publicFiles = new Set(
  readdirSync(publicDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `/${entry.name}`),
)

const errors = validateProfile({ projects, skills, experience, contact, resume }, { publicFiles })

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  console.error(`\nProfile data has ${errors.length} error(s).`)
  process.exit(1)
}

console.log('Profile data OK')
process.exit(0)
