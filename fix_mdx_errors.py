#!/usr/bin/env python3
"""Fix MDX parsing errors caused by bare < and { characters."""
import re
import os

BLOG_DIR = "content/blogs"

# Files with errors and their patterns
ERROR_FILES = [
    "ai-embeddings-understanding-vector-representations.mdx",
    "api-rate-limiting-algorithms-and-implementation.mdx",
    "aws-lambda-best-practices-performance-and-cost.mdx",
    "cloudflare-workers-edge-computing-at-scale.mdx",
    "cloudflare-workers-edge-computing-for-the-web.mdx",
    "database-indexing-strategies-b-tree-hash-and-gin.mdx",
    "database-sharding-scaling-horizontally.mdx",
    "deno-deploy-serverless-at-the-edge.mdx",
    "docker-security-best-practices.mdx",
    "edge-ai-running-machine-learning-in-the-browser.mdx",
    "edge-computing-architecture-and-frameworks.mdx",
    "edge-computing-the-next-evolution-of-cloud.mdx",
    "edge-first-architecture-building-for-global-scale.mdx",
    "edge-middleware-patterns-auth-rate-limiting-and-geo.mdx",
    "edge-runtime-vs-node-js-runtime-when-to-use-which.mdx",
    "introduction-to-effect-ts-functional-typescript.mdx",
    "javascript-memory-management-and-leak-detection.mdx",
    "mongodb-aggregation-pipeline-advanced-queries.mdx",
    "next-js-turbopack-vs-vite-build-tool-comparison.mdx",
    "python-type-hints-and-static-analysis-with-mypy.mdx",
    "react-native-fabric-the-new-rendering-system.mdx",
    "typescript-utility-types-partial-pick-omit-and-more.mdx",
    "vercel-edge-functions-serverless-at-the-edge.mdx",
    "websockets-vs-server-sent-events-vs-long-polling.mdx",
]


def fix_line(line, in_code_block):
    """Fix problematic patterns in a single line."""
    if in_code_block:
        return line

    # Pattern 1: Bare <digit in prose (like <2%, <1ms, <100ms, <5s)
    # Don't touch things already in backticks
    # Match < followed by digit(s) that are NOT inside backticks
    # We need to be careful not to break HTML tags or JSX

    # First, let's identify segments that are inside backticks to protect them
    parts = re.split(r'(`[^`]+`)', line)
    result = []
    for i, part in enumerate(parts):
        if part.startswith('`') and part.endswith('`'):
            result.append(part)
            continue

        # Pattern: bare < followed by digit(s) in prose → wrap in backticks
        # e.g., "<2%" → "`<2%`", "<1ms" → "`<1ms`"
        part = re.sub(r'<(\d+)', r'`<\1', part)

        # Pattern: bare < followed by letter and comma (generic types in prose)
        # e.g., "Effect<A, E, R>" → "`Effect<A, E, R>`"
        # But only if not already in backticks and not an HTML tag
        # Look for word<Letter, patterns
        part = re.sub(r'(\w)<([A-Z][a-z]*),\s*', r'`\1<\2, `', part)

        # Pattern: standalone comparison operators in table cells
        # e.g., "| <, >, BETWEEN)" → "| `<`, `>`, BETWEEN)"
        part = re.sub(r'<,\s*>', r'`<`, `>`', part)

        # Pattern: bare {$something} in non-code context (like table cells)
        # e.g., "{$cond: [if, then, else]}" → "`{$cond: [if, then, else]}`"
        part = re.sub(r'\{(\$\w+)', r'`{\1', part)
        # Close the backtick before } if we opened one
        # This is tricky - let's handle the specific case
        if '`{`' not in part and '`{$' in part:
            part = re.sub(r'(\`\{[^}]*\})', r'\1`', part)

        result.append(part)

    return ''.join(result)


def fix_file(filepath):
    """Fix MDX errors in a single file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    fixed_lines = []
    in_code_block = False
    in_frontmatter = False
    fm_count = 0
    changes = 0

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Track frontmatter
        if stripped == '---':
            fm_count += 1
            if fm_count <= 2:
                in_frontmatter = fm_count == 1
                fixed_lines.append(line)
                continue

        # Track code blocks
        if stripped.startswith('```'):
            in_code_block = not in_code_block
            fixed_lines.append(line)
            continue

        if in_frontmatter or in_code_block:
            fixed_lines.append(line)
            continue

        original = line
        fixed = fix_line(line, in_code_block)
        if fixed != original:
            changes += 1
            print(f"  L{i+1}: {original.strip()[:80]}")
            print(f"  -> : {fixed.strip()[:80]}")
        fixed_lines.append(fixed)

    if changes > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(fixed_lines))
        print(f"  [{changes} fixes applied]")
    else:
        print(f"  [no changes]")


def main():
    fixed_count = 0
    for fname in ERROR_FILES:
        filepath = os.path.join(BLOG_DIR, fname)
        if not os.path.exists(filepath):
            print(f"SKIP: {fname} (not found)")
            continue
        print(f"\n{fname}:")
        fix_file(filepath)
        fixed_count += 1

    print(f"\nProcessed {fixed_count} files")


if __name__ == "__main__":
    main()
