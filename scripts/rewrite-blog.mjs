#!/usr/bin/env bun
/**
 * rewrite-blog.mjs - Rewrite a single blog post with detailed content and images
 * Usage: bun run scripts/rewrite-blog.mjs <filename>
 * 
 * This script reads a blog file, extracts its metadata, and outputs a comprehensive
 * rewrite prompt that can be used with any LLM API to generate the content.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const BLOGS_DIR = "/home/minhvnq/Desktop/Web/MinhOmega.github.io/content/blogs";

const UNSPLASH_IMAGES = {
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

function getImagesForTags(tags) {
  const tagStr = tags.toLowerCase();
  if (tagStr.includes("database") || tagStr.includes("sql") || tagStr.includes("postgres") || tagStr.includes("mongo")) return UNSPLASH_IMAGES.database;
  if (tagStr.includes("docker") || tagStr.includes("container")) return UNSPLASH_IMAGES.docker;
  if (tagStr.includes("kubernetes") || tagStr.includes("k8s") || tagStr.includes("helm")) return UNSPLASH_IMAGES.kubernetes;
  if (tagStr.includes("ai") || tagStr.includes("llm") || tagStr.includes("machine learning") || tagStr.includes("ml")) return UNSPLASH_IMAGES.ai;
  if (tagStr.includes("security") || tagStr.includes("auth")) return UNSPLASH_IMAGES.security;
  if (tagStr.includes("performance") || tagStr.includes("optimization") || tagStr.includes("caching")) return UNSPLASH_IMAGES.performance;
  if (tagStr.includes("devops") || tagStr.includes("ci/cd") || tagStr.includes("pipeline") || tagStr.includes("deploy")) return UNSPLASH_IMAGES.devops;
  if (tagStr.includes("cloud") || tagStr.includes("aws") || tagStr.includes("gcp") || tagStr.includes("azure")) return UNSPLASH_IMAGES.cloud;
  if (tagStr.includes("react") || tagStr.includes("vue") || tagStr.includes("css") || tagStr.includes("frontend") || tagStr.includes("html")) return UNSPLASH_IMAGES.frontend;
  if (tagStr.includes("mobile") || tagStr.includes("react native") || tagStr.includes("expo")) return UNSPLASH_IMAGES.mobile;
  if (tagStr.includes("api") || tagStr.includes("rest") || tagStr.includes("graphql") || tagStr.includes("grpc")) return UNSPLASH_IMAGES.api;
  if (tagStr.includes("test") || tagStr.includes("jest") || tagStr.includes("playwright")) return UNSPLASH_IMAGES.testing;
  if (tagStr.includes("architect") || tagStr.includes("microservice") || tagStr.includes("design pattern")) return UNSPLASH_IMAGES.architecture;
  return UNSPLASH_IMAGES.javascript; // default
}

function getImagesForSections(tags) {
  const imgs = getImagesForTags(tags);
  return [
    `![${tags.split(",")[0].replace(/[\[\]"]/g, "").trim()} Overview](https://images.unsplash.com/${imgs[0]}?w=800&h=400&fit=crop)`,
    `![${tags.split(",")[0].replace(/[\[\]"]/g, "").trim()} Architecture](https://images.unsplash.com/${imgs[1]}?w=800&h=400&fit=crop)`,
    `![${tags.split(",")[0].replace(/[\[\]"]/g, "").trim()} Implementation](https://images.unsplash.com/${imgs[2]}?w=800&h=400&fit=crop)`,
  ];
}

// Get filename from args
const filename = process.argv[2];
if (!filename) {
  console.error("Usage: bun run scripts/rewrite-blog.mjs <filename>");
  process.exit(1);
}

const filepath = join(BLOGS_DIR, filename);
if (!existsSync(filepath)) {
  console.error(`File not found: ${filepath}`);
  process.exit(1);
}

// Read and parse the file
const content = readFileSync(filepath, "utf-8");
const titleMatch = content.match(/^title:\s*"(.+)"$/m);
const dateMatch = content.match(/^date:\s*"(.+)"$/m);
const descMatch = content.match(/^description:\s*"(.+)"$/m);
const tagsMatch = content.match(/^tags:\s*(.+)$/m);
const authorMatch = content.match(/^author:\s*"(.+)"$/m);

const title = titleMatch?.[1] ?? filename.replace(/\.mdx$/, "").replace(/-/g, " ");
const date = dateMatch?.[1] ?? "2024-01-01";
const description = descMatch?.[1] ?? "";
const tags = tagsMatch?.[1] ?? '["Technology"]';
const author = authorMatch?.[1] ?? "MinhVo";

const images = getImagesForSections(tags);

console.log(JSON.stringify({
  filename,
  title,
  date,
  description,
  tags,
  author,
  images,
}));
