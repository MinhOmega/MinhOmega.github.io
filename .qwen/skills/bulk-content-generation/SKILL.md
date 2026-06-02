---
name: bulk-content-generation
description: Generate large numbers of content files (MDX, markdown, etc.) programmatically using a Node.js generator script with compact metadata arrays and content templates
source: auto-skill
extracted_at: '2026-06-02T02:09:00.000Z'
---

# Bulk Content Generation via Node.js Script

When you need to create hundreds of content files (blog posts, docs, pages), writing each file individually is impractical. Instead, create a **Node.js generator script** that defines content metadata compactly and uses templates to produce full files.

## Approach

1. **Define metadata as a compact array** — each entry is a tuple like `[year, month, day, "title", "description", ["tag1", "tag2"]]`. This keeps the data dense and scannable.

2. **Use a content template function** — a function that takes `(title, tags)` and returns the full markdown/MDX body with sections, code blocks, etc. This separates structure from data.

3. **Generate frontmatter + content** — combine the metadata into YAML frontmatter and append the templated body.

4. **Write files with slugs** — use a `slugify(title)` function to generate filenames.

## Key Pitfalls to Avoid

- **Watch for syntax errors in dense arrays** — when writing many entries inline, it's easy to miss wrapping tags in `[]` brackets. A common pattern: `[year,month,day,"title","desc","Tag1","Tag2"]]` is missing `[]` around tags — should be `[year,month,day,"title","desc",["Tag1","Tag2"]]`. Validate syntax with `node -c script.mjs` before running.
- **Fix bracket issues systematically** — don't fix one at a time with `edit`. Write a small fix script or use regex replacement. Look for the pattern: after the description string (ends with `."`), the next token should be `[` for the tags array. If it's `"`, tags are unwrapped.
- **Deduplicate by title** — when adding entries in multiple passes, duplicates creep in. Write a dedup script that parses entries, deduplicates by title, sorts by date, and rewrites the array. Check with: `titles.filter((t,i) => titles.indexOf(t) !== i)` to find dupes.
- **Sort by date** — ensure entries are sorted chronologically so the listing page renders correctly.
- **Avoid writing huge files via `write_file`** — if the file exceeds the token limit, the write will be truncated silently. Use a generator script instead.
- **Use `generateStaticParams`** — for Next.js App Router, export this function from `page.tsx` to pre-render all slugs at build time.
- **Make images optional in Velite schema** — when generating hundreds of content files, you can't have real images for all. Use `s.image().optional()` in the schema.

## Template Structure (MDX blog example)

```javascript
const BLOGS = [
  [2024,1,5,"Title Here","Description here.",["Tag1","Tag2"]],
  // ... hundreds more
];

function generateContent(title, tags) {
  const tag = tags[0] || "Technology";
  return [
    `## Introduction\n\n${title} is a critical topic...`,
    `## Key Concepts\n\nUnderstanding the fundamentals...`,
    `## Implementation\n\n\`\`\`typescript\n// example\n\`\`\``,
    `## Best Practices\n\n1. Start simple\n2. Test thoroughly`,
  ].join("\n\n");
}
```

## Verification

- Run `node -c script.mjs` to check syntax
- Count entries with a grep/regex to ensure target count: `match[1].match(/^\[20\d{2},/gm).length`
- Run the script and verify file count: `ls content/blogs/*.mdx | wc -l`
- Build the project locally to confirm all pages generate: `yarn build`
- Check `generateStaticParams` count matches in build output: `[+495 more paths]`

## CI/Deployment Notes

- **Yarn 3 + Corepack**: if `package.json` has `"packageManager": "yarn@3.5.0"`, GitHub Actions will fail unless Corepack is enabled. Add `corepack enable` **before** `setup-node` (not after), because `setup-node` with `cache: 'yarn'` runs yarn commands during its own setup phase.
- **Workflow order**: `checkout` → `corepack enable` → `setup-node` → `yarn install` → `build`
- **Monitor with `gh`**: use `gh run list`, `gh run view <ID>`, and `gh run view <ID> --log-failed` to diagnose CI failures.
