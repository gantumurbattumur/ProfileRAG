import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { projects, skills, experience, contact, resume } from '../data/profile.js'
import { validateProfile } from './validateProfile.js'

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url))
const publicFiles = new Set(
  readdirSync(publicDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `/${entry.name}`),
)

const validData = () =>
  structuredClone({ projects, skills, experience, contact, resume })

const run = (data, opts) => validateProfile(data, opts)

test('real profile data validates against public/ files', () => {
  assert.deepEqual(run({ projects, skills, experience, contact, resume }, { publicFiles }), [])
})

test('real profile data validates without publicFiles', () => {
  assert.deepEqual(run({ projects, skills, experience, contact, resume }), [])
})

test('duplicate project id is reported', () => {
  const data = validData()
  data.projects[1].id = data.projects[0].id
  const errors = run(data)
  assert.deepEqual(errors, [
    `projects[1] (${data.projects[1].title}): duplicate id ${data.projects[0].id}`,
  ])
})

test('non-numeric project id is reported', () => {
  const data = validData()
  data.projects[0].id = '1'
  assert.equal(run(data).length, 1)
  assert.match(run(data)[0], /id must be a number/)
})

test('bad year is reported', () => {
  const data = validData()
  data.projects[0].year = '25'
  assert.match(run(data)[0], /year must be a 4-digit string/)
})

test('numeric year is reported', () => {
  const data = validData()
  data.projects[0].year = 2025
  assert.match(run(data)[0], /year must be a 4-digit string/)
})

test('empty title and empty categories are reported', () => {
  const data = validData()
  data.projects[0].title = '  '
  data.projects[0].categories = []
  const errors = run(data)
  assert.equal(errors.length, 2)
  assert.match(errors[0], /title must be a non-empty string/)
  assert.match(errors[1], /categories must be a non-empty array/)
})

test('tech must be an array or a string', () => {
  const data = validData()
  data.projects[0].tech = 42
  assert.match(run(data)[0], /tech must be an array or a string/)
})

test('image not starting with "/" is reported', () => {
  const data = validData()
  data.projects[2].image = 'mini-recon-ai.png'
  assert.match(run(data)[0], /image must start with "\/"/)
})

test('missing image file is reported when publicFiles is provided', () => {
  const data = validData()
  data.projects[2].image = '/does-not-exist.png'
  const errors = run(data, { publicFiles })
  assert.deepEqual(errors, [
    `projects[2] (${data.projects[2].title}): image /does-not-exist.png not found in public/`,
  ])
})

test('missing image file is not checked without publicFiles', () => {
  const data = validData()
  data.projects[2].image = '/does-not-exist.png'
  assert.deepEqual(run(data), [])
})

test('non-https project link is reported with specific message', () => {
  const data = validData()
  data.projects[2].links[0].url = 'http://github.com/gantumurbattumur/mini-recon-ai'
  assert.deepEqual(run(data), [
    `projects[2] (${data.projects[2].title}): link 0 url must start with https://`,
  ])
})

test('project link with bad type or missing label is reported', () => {
  const data = validData()
  data.projects[0].links[0].type = 'website'
  data.projects[0].links[0].label = ''
  const errors = run(data)
  assert.equal(errors.length, 2)
  assert.match(errors[0], /link 0 label must be a non-empty string/)
  assert.match(errors[1], /link 0 type must be "github" or "live"/)
})

test('experience entry missing fields is reported', () => {
  const data = validData()
  delete data.experience[1].company
  data.experience[0].period = ''
  const errors = run(data)
  assert.equal(errors.length, 2)
  assert.match(errors[0], /experience\[0\].*period must be a non-empty string/)
  assert.match(errors[1], /experience\[1\].*company must be a non-empty string/)
})

test('experience entry without id is reported', () => {
  const data = validData()
  delete data.experience[0].id
  assert.match(run(data)[0], /id is required/)
})

test('bad email is reported', () => {
  const data = validData()
  data.contact.email = 'not-an-email'
  assert.match(run(data)[0], /contact\.email must be a valid email/)
})

test('contact link with non-https, non-mailto url is reported', () => {
  const data = validData()
  data.contact.links[0].url = 'http://linkedin.com/in/someone'
  assert.match(run(data)[0], /contact\.links\[0\].*must be https:\/\/ or mailto:/)
})

test('mailto contact link is accepted', () => {
  const data = validData()
  data.contact.links[2].url = 'mailto:someone@example.com'
  assert.deepEqual(run(data), [])
})

test('non-https resume url is reported', () => {
  const data = validData()
  data.resume.url = 'ftp://example.com/resume.pdf'
  assert.match(run(data)[0], /resume\.url must be an https URL/)
})

test('unparseable resume url is reported', () => {
  const data = validData()
  data.resume.url = 'not a url'
  assert.match(run(data)[0], /resume\.url must be an https URL/)
})

test('skill category that is not an array is reported', () => {
  const data = validData()
  data.skills['Frontend'] = 'React, CSS'
  assert.deepEqual(run(data), ['skills["Frontend"] must be a non-empty array'])
})

test('empty skill category is reported', () => {
  const data = validData()
  data.skills['Frontend'] = []
  assert.deepEqual(run(data), ['skills["Frontend"] must be a non-empty array'])
})

test('skill entry that is empty or not a string is reported', () => {
  const data = validData()
  data.skills['Frontend'] = ['React', '']
  data.skills['Backend & APIs'] = ['FastAPI', 7]
  const errors = run(data)
  assert.deepEqual(errors, [
    'skills["Backend & APIs"][1] must be a non-empty string',
    'skills["Frontend"][1] must be a non-empty string',
  ])
})

test('non-array top-level sections are reported', () => {
  const errors = run({ projects: null, skills: [], experience: {}, contact: null, resume: null })
  assert.deepEqual(errors, [
    'projects must be an array',
    'experience must be an array',
    'contact must be an object',
    'resume must be an object',
    'skills must be an object mapping category names to arrays',
  ])
})
