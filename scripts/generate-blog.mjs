#!/usr/bin/env node
/**
 * Blog Post Generator Script
 * Generates detailed, SEO-optimized blog posts with images
 * Usage: node scripts/generate-blog.mjs <start-index> <end-index>
 */

import fs from 'fs';
import path from 'path';

const BLOGS_DIR = 'content/blogs';
const index = JSON.parse(fs.readFileSync('blog-index.json', 'utf-8'));

// Topic-specific image collections from Unsplash (free, no API key needed)
const topicImages = {
  'React': [
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
  ],
  'JavaScript': [
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop',
  ],
  'TypeScript': [
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
  ],
  'Next.js': [
    'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
  ],
  'CSS': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523437113567-9c10c81b98e4?w=800&h=400&fit=crop',
  ],
  'Node.js': [
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  ],
  'Database': [
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  ],
  'Docker': [
    'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  ],
  'Kubernetes': [
    'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  ],
  'AI': [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
  ],
  'Security': [
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
  ],
  'DevOps': [
    'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  ],
  'Testing': [
    'https://images.unsplash.com/photo-1576444356170-66073fbf8f01?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
  ],
  'Performance': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  ],
  'Mobile': [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
  ],
  'Cloud': [
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  ],
  'GraphQL': [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
  ],
  'API': [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
  ],
  'Architecture': [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  ],
  'default': [
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
  ],
};

function getImageForBlog(blog) {
  const tags = blog.tags || [];
  for (const tag of tags) {
    if (topicImages[tag]) {
      const imgs = topicImages[tag];
      return imgs[Math.floor(Math.random() * imgs.length)];
    }
  }
  const defaults = topicImages['default'];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function getImageForSection(blog, sectionIndex) {
  const tags = blog.tags || [];
  const allImages = [];
  for (const tag of tags) {
    if (topicImages[tag]) {
      allImages.push(...topicImages[tag]);
    }
  }
  allImages.push(...topicImages['default']);
  // Use section index to pick different images for different sections
  return allImages[sectionIndex % allImages.length];
}

// Export for use by agents
export { getImageForBlog, getImageForSection, topicImages, BLOGS_DIR };

// CLI mode: list blogs to process
const args = process.argv.slice(2);
if (args.length >= 2) {
  const start = parseInt(args[0]);
  const end = parseInt(args[1]);
  const batch = index.slice(start, end);
  console.log(JSON.stringify(batch, null, 2));
} else if (args[0] === '--count') {
  console.log(index.length);
} else if (args[0] === '--list-tags') {
  const tagCounts = {};
  index.forEach(b => b.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  console.log(JSON.stringify(tagCounts, null, 2));
}
