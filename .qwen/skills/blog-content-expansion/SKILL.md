---
name: blog-content-expansion
description: Expand existing blog posts to target word counts using parallel agents, correct word counting for MDX, and Unsplash image injection
source: auto-skill
extracted_at: '2026-06-02T07:43:00.450Z'
---

# Blog Content Expansion

When expanding hundreds of blog posts to meet minimum word count targets (e.g., 2500+ words), use parallel background agents and correct word counting to efficiently process all files.

## Correct Word Counting for MDX

**Critical**: The common `sed` approach for counting words after frontmatter is broken when `---` appears inside code blocks (e.g., YAML examples, horizontal rules in markdown). It will match code block delimiters as frontmatter boundaries, producing incorrect counts.

```bash
# BROKEN — matches --- inside code blocks
sed -n '/^---$/,/^---$/d; p' file.mdx | wc -w

# CORRECT — counts --- delimiters, stops after the second one
awk 'BEGIN{c=0} /^---$/{c++; next} c>=2' file.mdx | wc -w
```

Always use the `awk` approach for MDX files. Use it to audit all files:

```bash
cd content/blogs && ls *.mdx | while read f; do
  words=$(awk 'BEGIN{c=0} /^---$/{c++; next} c>=2' "$f" | wc -w)
  if [ "$words" -lt 2500 ]; then echo "$words $f"; fi
done | sort -n
```

## Parallel Agent Strategy

Background agents can expand multiple blogs simultaneously. Key constraints:

- **Max 10 concurrent agents** — additional launches will fail. Wait for slots to free.
- **Each agent handles one file** — assign a single blog file per agent for clean ownership.
- **Agents read then write** — the agent must `read_file` the blog first, then `write_file` the expanded version.
- **Don't duplicate work** — track which files are assigned to running agents. Don't launch a second agent for the same file.

### Agent Prompt Template

```
Rewrite <path> to 3000+ words. Read it first. Keep frontmatter exactly.
Add 5+ Unsplash images. Cover: [topic-specific subtopics list].
Write file when done.
```

The prompt should specify:
1. The exact file path
2. Target word count (aim 10-20% above minimum to account for counting variance)
3. Instruction to preserve frontmatter exactly
4. Number of Unsplash images to include
5. Specific subtopics to cover (gives the agent direction for depth)

## Unsplash Image Format

Inject images directly into MDX content using this format:

```markdown
![Description](https://images.unsplash.com/photo-XXXXXXXXX?w=800&h=400&fit=crop)
```

- Place one hero image after the introduction
- Distribute remaining images between major sections
- Use real Unsplash photo IDs (the `photo-XXXXXXXXX` part)
- Standard dimensions: `w=800&h=400&fit=crop`

## Frontmatter Preservation

When rewriting blog posts, the frontmatter must be preserved exactly. This includes:
- title, date, description, tags, published, author
- Any other fields in the original

Read the file first to capture frontmatter, then write the new content with identical frontmatter.

## Expanding Content Effectively

To hit word count targets, add **prose sections** not just code blocks. Code blocks contribute fewer words than expected because `wc -w` counts tokens differently.

Effective expansion techniques:
- **Add case studies** — real-world examples with specific companies, numbers, outcomes
- **Add comparison sections** — tables and prose comparing tools/approaches
- **Add practical guides** — step-by-step instructions with context
- **Add future outlook** — trends, predictions, emerging technologies
- **Add troubleshooting** — common mistakes, pitfalls, solutions
- **Add regional/global perspectives** — how different regions approach the topic

Each new section should be 200-400 words of prose. Adding 3-5 sections typically adds 600-2000 words.

## Batch Workflow

1. **Audit**: Run word count check across all files
2. **Sort by deficit**: Process shortest files first (biggest gap to fill)
3. **Launch agents**: Start up to 10 agents for the shortest files
4. **Direct rewrite**: While agents run, directly rewrite files that didn't get agent slots
5. **Verify**: After agents complete, re-run word count audit
6. **Fix stragglers**: Directly expand any files still under target
7. **Commit**: Stage and commit all changes

## Commit Message Format

```
feat(blog): expand N blog posts to M+ words

- List of key expansions
- Note any new content added
```
