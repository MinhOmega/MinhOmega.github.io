#!/usr/bin/env node
/**
 * Batch Blog Rewrite Script
 * Generates agent prompts for rewriting blog posts in batches
 * Usage: node scripts/batch-rewrite.mjs <batch-size> <wave-number>
 */

import fs from 'fs';
import path from 'path';

const index = JSON.parse(fs.readFileSync('blog-index.json', 'utf-8'));

const args = process.argv.slice(2);
const BATCH_SIZE = parseInt(args.find(a => a.startsWith('--batch-size='))?.split('=')[1] || '10');
const START = parseInt(args.find(a => a.startsWith('--start='))?.split('=')[1] || '0');
const END = Math.min(START + BATCH_SIZE, index.length);

const batch = index.slice(START, END);

// Image collections by topic category
const imageCollections = {
  'React': ['https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop'],
  'JavaScript': ['https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop'],
  'TypeScript': ['https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'],
  'Next.js': ['https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'],
  'CSS': ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1523437113567-9c10c81b98e4?w=800&h=400&fit=crop'],
  'Node.js': ['https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'],
  'Database': ['https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'],
  'Docker': ['https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'],
  'Kubernetes': ['https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'],
  'AI': ['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop'],
  'Security': ['https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop'],
  'DevOps': ['https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'],
  'Testing': ['https://images.unsplash.com/photo-1576444356170-66073fbf8f01?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'],
  'Performance': ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'],
  'Mobile': ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop'],
  'Cloud': ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'],
  'GraphQL': ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop'],
  'API': ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop'],
  'Architecture': ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'],
  'Git': ['https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'],
  'default': ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop'],
};

function getImages(blog) {
  const imgs = [];
  for (const tag of blog.tags) {
    if (imageCollections[tag]) {
      imgs.push(...imageCollections[tag]);
    }
  }
  imgs.push(...imageCollections['default']);
  // Deduplicate
  return [...new Set(imgs)];
}

function generateBlogList() {
  return batch.map((blog, i) => {
    const imgs = getImages(blog);
    return `
### Blog ${i + 1}: ${blog.title}
- **File**: content/blogs/${blog.file}
- **Date**: ${blog.date}
- **Description**: ${blog.description}
- **Tags**: [${blog.tags.join(', ')}]
- **Images**: ${imgs.slice(0, 4).join(', ')}
`;
  }).join('\n');
}

const prompt = `You are a senior technical blog writer and software engineer. Write ${batch.length} detailed, comprehensive blog posts.

## PROJECT DIRECTORY
/home/minhvnq/Desktop/Web/MinhOmega.github.io

## BLOGS TO WRITE

${generateBlogList()}

## TEMPLATE FORMAT (MUST FOLLOW EXACTLY)

Each blog post MUST use this EXACT MDX format:

\`\`\`
---
title: "EXACT TITLE"
date: "EXACT DATE"
description: "EXACT DESCRIPTION"
tags: [EXACT TAGS]
published: true
author: "MinhVo"
---

## Introduction

[2-3 engaging paragraphs. Hook the reader. Explain why this topic matters in 2024/2025. Mention what they'll learn.]

![Hero image](IMAGE_URL_1)

## Understanding [Topic]: The Fundamentals

[Deep explanation of what this technology/concept is. Its history, evolution, and core purpose. 3-4 paragraphs.]

![Concept illustration](IMAGE_URL_2)

## Core Architecture and Design Patterns

[Technical deep dive into how it works internally. Architecture diagrams described in text. Key components explained. 4-5 paragraphs with sub-sections using ### headings.]

### Component 1: [Name]
[Explanation]

### Component 2: [Name]
[Explanation]

## Step-by-Step Implementation

[Detailed implementation guide with REAL, WORKING code examples. 5-6 paragraphs with multiple code blocks.]

\`\`\`typescript
// Installation and setup
\`\`\`

\`\`\`typescript
// Core implementation
\`\`\`

\`\`\`typescript
// Advanced usage
\`\`\`

![Implementation workflow](IMAGE_URL_3)

## Real-World Use Cases and Case Studies

[3-4 detailed real-world scenarios. Each with 1-2 paragraphs explaining the problem and how this technology solves it.]

### Use Case 1: [Scenario]
[Detailed explanation]

### Use Case 2: [Scenario]
[Detailed explanation]

### Use Case 3: [Scenario]
[Detailed explanation]

## Best Practices for Production

[6-8 best practices, each with a detailed explanation of WHY it matters and HOW to implement it.]

1. **[Practice Name]**: [2-3 sentence explanation with code if relevant]
2. **[Practice Name]**: [2-3 sentence explanation]

## Common Pitfalls and Solutions

[5-6 pitfalls with detailed explanations]

| Pitfall | Impact | Solution |
|---------|--------|----------|
| [Detailed pitfall 1] | [Impact description] | [Detailed solution] |
| [Detailed pitfall 2] | [Impact description] | [Detailed solution] |
| [Detailed pitfall 3] | [Impact description] | [Detailed solution] |

## Performance Optimization

[Specific techniques for optimizing this technology. Benchmarks, profiling tips, monitoring. 3-4 paragraphs with code examples.]

\`\`\`typescript
// Performance optimization code
\`\`\`

## Comparison with Alternatives

[Honest comparison with competing technologies. When to use each.]

| Feature | [Topic] | Alternative 1 | Alternative 2 |
|---------|---------|---------------|---------------|
| Performance | ... | ... | ... |
| Learning Curve | ... | ... | ... |
| Ecosystem | ... | ... | ... |

## Advanced Patterns and Techniques

[2-3 advanced patterns for experienced developers. 3-4 paragraphs with code.]

\`\`\`typescript
// Advanced pattern code
\`\`\`

## Testing Strategies

[How to test implementations of this technology. Unit tests, integration tests, E2E.]

\`\`\`typescript
// Test example
\`\`\`

## Future Outlook

[Where this technology is heading. Upcoming features, industry trends. 2-3 paragraphs.]

## Conclusion

[Comprehensive summary. Key takeaways as a numbered list. Next steps for the reader. Links to official docs and learning resources. 2-3 paragraphs.]
\`\`\`

## CRITICAL REQUIREMENTS

1. **WORD COUNT**: Each post MUST be 2000-2500 words of body text (not counting frontmatter or code blocks)
2. **IMAGES**: Each post MUST have at least 3 images using ![alt](url) syntax
3. **NO BOILERPLATE**: Every sentence must be specific to the topic. NO generic filler like "is a critical topic for modern software developers"
4. **REAL CODE**: Include practical, working TypeScript/JavaScript code examples (3-5 code blocks minimum)
5. **DEPTH**: Go deep into the topic. Explain internals, not just surface-level usage
6. **TABLES**: Include comparison tables and pitfall tables
7. **SECTIONS**: Follow the template structure with all sections filled in
8. **PRESERVE FRONTMATTER**: Keep EXACT title, date, description, tags, published, author from the metadata above
9. **WRITE FILES**: Use the write_file tool to write each blog post to its correct path

## INSTRUCTIONS

Write ALL ${batch.length} blog posts now. For each one:
1. Generate the complete detailed content following the template
2. Write it using write_file to content/blogs/[filename]
3. Move immediately to the next blog post

Do NOT ask questions. Write all ${batch.length} posts now.`;

console.log(prompt);
