import { test } from "node:test";
import assert from "node:assert/strict";
import { filterProjects } from "./filterProjects.js";

const projects = [
  {
    id: 1,
    title: "Mongolian LLM Benchmark",
    type: "ML Research",
    categories: ["Research"],
    description: "Benchmark for evaluating language models.",
    tech: ["Python", "Hugging Face"],
  },
  {
    id: 2,
    title: "AI Book Assistant",
    type: "RAG System",
    categories: ["RAG & AI", "Full Stack"],
    description: "Chat with your books using retrieval.",
    tech: "FastAPI, FAISS, React",
  },
  {
    id: 3,
    title: "Dashboard",
    type: "Web App",
    categories: ["Full Stack"],
    description: "Internal monitoring tool.",
    tech: ["React", "PostgreSQL"],
  },
];

const ids = (list) => list.map((p) => p.id);

test("All with empty query returns everything", () => {
  assert.deepEqual(ids(filterProjects(projects)), [1, 2, 3]);
  assert.deepEqual(ids(filterProjects(projects, { category: "All", query: "" })), [1, 2, 3]);
});

test("category filter keeps projects whose categories include it", () => {
  assert.deepEqual(ids(filterProjects(projects, { category: "Full Stack" })), [2, 3]);
  assert.deepEqual(ids(filterProjects(projects, { category: "Research" })), [1]);
});

test("query matches title case-insensitively", () => {
  assert.deepEqual(ids(filterProjects(projects, { query: "  mongolian " })), [1]);
});

test("query matches description case-insensitively", () => {
  assert.deepEqual(ids(filterProjects(projects, { query: "RETRIEVAL" })), [2]);
});

test("query matches type case-insensitively", () => {
  assert.deepEqual(ids(filterProjects(projects, { query: "rag system" })), [2]);
});

test("query matches tech array case-insensitively", () => {
  assert.deepEqual(ids(filterProjects(projects, { query: "postgresql" })), [3]);
});

test("query matches tech given as a comma-separated string", () => {
  assert.deepEqual(ids(filterProjects(projects, { query: "faiss" })), [2]);
  assert.deepEqual(ids(filterProjects(projects, { query: "fastapi, faiss" })), []);
});

test("combined category and query must both match", () => {
  assert.deepEqual(ids(filterProjects(projects, { category: "Full Stack", query: "react" })), [2, 3]);
  assert.deepEqual(ids(filterProjects(projects, { category: "Research", query: "react" })), []);
  assert.deepEqual(ids(filterProjects(projects, { category: "Research", query: "benchmark" })), [1]);
});

test("no match returns an empty array", () => {
  assert.deepEqual(filterProjects(projects, { query: "zzz-no-such-thing" }), []);
});

test("does not mutate the input array or its objects", () => {
  const snapshot = structuredClone(projects);
  const result = filterProjects(projects, { category: "Full Stack", query: "react" });
  assert.notEqual(result, projects);
  assert.deepEqual(projects, snapshot);
});
