#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const BLOGS_DIR = join(import.meta.dirname, '..', 'content', 'blogs');
const API_URL = 'https://token.plan.sgp.xiaomimimo.com/v1/chat/completions';
const API_KEY = process.env.QWEN_CUSTOM_API_KEY_OPENAI_HTTPS_TOKEN_PLAN_SGP_XIAOMIMIMO_COM_V1_30536EFF2F09;

async function rewriteBlog(filename) {
  const filePath = join(BLOGS_DIR, filename);
  const content = readFileSync(filePath, 'utf8');
  
  // Split frontmatter and body
  const parts = content.split('---', 2);
  const frontmatter = parts[0] + '---' + parts[1] + '---';
  const body = parts[2] || '';
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  
  if (wordCount >= 2500) {
    console.log(`SKIP ${filename} (${wordCount} words - already >= 2500)`);
    return { status: 'skip', file: filename, words: wordCount };
  }

  // Extract title from frontmatter
  const titleMatch = parts[1].match(/title:\s*"?(.+?)"?\s*$/m);
  const title = titleMatch ? titleMatch[1] : filename.replace('.mdx', '');
  
  console.log(`REWRITING ${filename} (${wordCount} words -> target 2800+)...`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a senior technical writer specializing in web development, DevOps, and software engineering. You write comprehensive, detailed blog posts that are at least 2500-3000 words. Your writing is authoritative, includes code examples, real-world use cases, best practices, and common pitfalls. You use markdown formatting with proper headers (##, ###), code blocks, bullet points, and tables.`
          },
          {
            role: 'user',
            content: `Rewrite and significantly expand this blog post about "${title}" to be at least 2800 words (content only, not counting frontmatter). 

Current content:
${body}

Requirements:
1. Keep the same topic and general structure but ADD much more depth
2. Add detailed code examples with explanations
3. Add real-world use cases and scenarios
4. Add best practices and common pitfalls sections
5. Add performance considerations where relevant
6. Use proper markdown: ## for main sections, ### for subsections, code blocks with language tags
7. Keep any existing Unsplash image URLs (lines starting with ![) exactly as they are
8. Do NOT include frontmatter (---) - only the body content
9. Do NOT add a title at the top (it's in the frontmatter)
10. The content should be comprehensive, authoritative, and technically deep
11. Aim for 2800-3200 words to ensure we hit the 2500 minimum
12. Include practical code examples in JavaScript/TypeScript, Python, or relevant language
13. Add comparison tables where appropriate
14. Discuss trade-offs and alternatives

Output ONLY the rewritten blog body content (no frontmatter, no title).`
          }
        ],
        max_tokens: 8000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API ${response.status}: ${errText.substring(0, 200)}`);
    }

    const data = await response.json();
    const newBody = data.choices?.[0]?.message?.content;
    
    if (!newBody) throw new Error('No content in response');

    const newWordCount = newBody.split(/\s+/).filter(Boolean).length;
    
    // Write the updated file
    const newContent = frontmatter + '\n' + newBody;
    writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`DONE ${filename}: ${wordCount} -> ${newWordCount} words`);
    return { status: 'success', file: filename, oldWords: wordCount, newWords: newWordCount };
  } catch (err) {
    console.error(`FAILED ${filename}: ${err.message}`);
    return { status: 'failed', file: filename, error: err.message };
  }
}

// Get all blogs below 2500 words
function getBlogsBelow2500() {
  const files = readdirSync(BLOGS_DIR).filter(f => f.endsWith('.mdx'));
  const below = [];
  for (const f of files) {
    const content = readFileSync(join(BLOGS_DIR, f), 'utf8');
    const parts = content.split('---', 2);
    const body = parts[2] || '';
    const words = body.split(/\s+/).filter(Boolean).length;
    if (words < 2500) {
      below.push({ file: f, words });
    }
  }
  below.sort((a, b) => a.words - b.words);
  return below;
}

// Process blogs in batches of 5 (API rate limit)
async function main() {
  const blogs = getBlogsBelow2500();
  console.log(`Found ${blogs.length} blogs below 2500 words`);
  
  // Process from command line args or all
  const startIndex = parseInt(process.argv[2]) || 0;
  const count = parseInt(process.argv[3]) || 10;
  const batch = blogs.slice(startIndex, startIndex + count);
  
  console.log(`Processing batch: ${startIndex} to ${startIndex + count} (${batch.length} blogs)`);
  
  const results = [];
  for (const blog of batch) {
    const result = await rewriteBlog(blog.file);
    results.push(result);
    // Small delay between API calls
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n--- RESULTS ---');
  const success = results.filter(r => r.status === 'success');
  const skipped = results.filter(r => r.status === 'skip');
  const failed = results.filter(r => r.status === 'failed');
  console.log(`Success: ${success.length}, Skipped: ${skipped.length}, Failed: ${failed.length}`);
  
  for (const r of results) {
    if (r.status === 'success') console.log(`  ✅ ${r.file}: ${r.oldWords} -> ${r.newWords}`);
    if (r.status === 'failed') console.log(`  ❌ ${r.file}: ${r.error}`);
  }
}

main().catch(console.error);
