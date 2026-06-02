#!/usr/bin/env bun
/**
 * batch-rewrite-direct.mjs - Directly rewrite blog posts with comprehensive content
 * Usage: bun run scripts/batch-rewrite-direct.mjs [start] [count]
 * 
 * Reads remaining boilerplate blogs and rewrites them with detailed content.
 * Processes in batches for efficiency.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const BLOGS_DIR = "/home/minhvnq/Desktop/Web/MinhOmega.github.io/content/blogs";
const MIN_WORDS = 1500; // Threshold to identify boilerplate

const UNSPLASH = {
  database: ["photo-1544383835-bda2bc66a55d", "photo-1558494949-ef010cbdcc31", "photo-1551288049-bebda4e38f71"],
  performance: ["photo-1551288049-bebda4e38f71", "photo-1558494949-ef010cbdcc31", "photo-1461749280684-dccba630e2f6"],
  devops: ["photo-1667372393119-3d4c48d07fc9", "photo-1555066931-4365d14bab8c", "photo-1516116216624-53e697fedbea"],
  cloud: ["photo-1544197150-b99a580bb7a8", "photo-1558494949-ef010cbdcc31", "photo-1551288049-bebda4e38f71"],
  javascript: ["photo-1461749280684-dccba630e2f6", "photo-1555066931-4365d14bab8c", "photo-1516116216624-53e697fedbea"],
  security: ["photo-1555066931-4365d14bab8c", "photo-1558494949-ef010cbdcc31", "photo-1516116216624-53e697fedbea"],
  docker: ["photo-1605745341112-85968b19335b", "photo-1667372393119-3d4c48d07fc9", "photo-1558494949-ef010cbdcc31"],
  kubernetes: ["photo-1667372393119-3d4c48d07fc9", "photo-1555066931-4365d14bab8c", "photo-1544197150-b99a580bb7a8"],
  ai: ["photo-1677442136019-21780ecad995", "photo-1551288049-bebda4e38f71", "photo-1461749280684-dccba630e2f6"],
  frontend: ["photo-1461749280684-dccba630e2f6", "photo-1516116216624-53e697fedbea", "photo-1555066931-4365d14bab8c"],
  testing: ["photo-1555066931-4365d14bab8c", "photo-1551288049-bebda4e38f71", "photo-1558494949-ef010cbdcc31"],
  mobile: ["photo-1512941937669-90a1b58e7e9c", "photo-1461749280684-dccba630e2f6", "photo-1516116216624-53e697fedbea"],
  api: ["photo-1558494949-ef010cbdcc31", "photo-1551288049-bebda4e38f71", "photo-1461749280684-dccba630e2f6"],
  architecture: ["photo-1516116216624-53e697fedbea", "photo-1558494949-ef010cbdcc31", "photo-1555066931-4365d14bab8c"],
};

function getImages(tagsStr) {
  const t = tagsStr.toLowerCase();
  if (t.includes("database") || t.includes("sql") || t.includes("postgres") || t.includes("mongo") || t.includes("redis")) return UNSPLASH.database;
  if (t.includes("docker") || t.includes("container")) return UNSPLASH.docker;
  if (t.includes("kubernetes") || t.includes("k8s") || t.includes("helm")) return UNSPLASH.kubernetes;
  if (t.includes("ai") || t.includes("llm") || t.includes("machine learning")) return UNSPLASH.ai;
  if (t.includes("security") || t.includes("auth") || t.includes("oauth")) return UNSPLASH.security;
  if (t.includes("performance") || t.includes("optimization") || t.includes("caching")) return UNSPLASH.performance;
  if (t.includes("devops") || t.includes("ci/cd") || t.includes("pipeline") || t.includes("deploy")) return UNSPLASH.devops;
  if (t.includes("cloud") || t.includes("aws") || t.includes("gcp") || t.includes("azure")) return UNSPLASH.cloud;
  if (t.includes("react") || t.includes("vue") || t.includes("css") || t.includes("frontend") || t.includes("html")) return UNSPLASH.frontend;
  if (t.includes("mobile") || t.includes("react native") || t.includes("expo")) return UNSPLASH.mobile;
  if (t.includes("api") || t.includes("rest") || t.includes("graphql") || t.includes("grpc")) return UNSPLASH.api;
  if (t.includes("test") || t.includes("jest") || t.includes("playwright")) return UNSPLASH.testing;
  if (t.includes("architect") || t.includes("microservice") || t.includes("design")) return UNSPLASH.architecture;
  return UNSPLASH.javascript;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = match[1];
  const result = {};
  for (const line of fm.split("\n")) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) result[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  return result;
}

function wordCount(content) {
  return content.replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(w => w.length > 0).length;
}

// Get all boilerplate blogs
const allFiles = readdirSync(BLOGS_DIR).filter(f => f.endsWith(".mdx"));
const boilerplate = [];

for (const file of allFiles) {
  const content = readFileSync(join(BLOGS_DIR, file), "utf-8");
  const wc = wordCount(content);
  if (wc <= MIN_WORDS) {
    const fm = parseFrontmatter(content);
    boilerplate.push({ file, ...fm, wordCount: wc });
  }
}

console.log(`Found ${boilerplate.length} boilerplate blogs to rewrite`);

// Process a slice based on args
const start = parseInt(process.argv[2] ?? "0");
const count = parseInt(process.argv[3] ?? boilerplate.length.toString());
const batch = boilerplate.slice(start, start + count);

console.log(`Processing batch ${start} to ${start + batch.length}`);

for (const blog of batch) {
  const images = getImages(blog.tags || "");
  console.log(`\nQueued: ${blog.file} (${blog.title})`);
}

// Output the list for agent spawning
const output = batch.map(b => ({
  file: b.file,
  title: b.title,
  date: b.date,
  description: b.description,
  tags: b.tags,
  author: b.author || "MinhVo",
  images: getImages(b.tags || ""),
}));

writeFileSync("/tmp/batch-to-rewrite.json", JSON.stringify(output, null, 2));
console.log(`\nWrote ${output.length} blog metadata entries to /tmp/batch-to-rewrite.json`);
