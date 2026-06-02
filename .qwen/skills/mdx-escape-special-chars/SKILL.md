---
name: mdx-escape-special-chars
description: Escape bare < and { characters in MDX files that cause JSX parsing errors in tables, headings, and prose
source: auto-skill
extracted_at: '2026-06-02T08:41:22.889Z'
---

# Escaping Special Characters in MDX

MDX compiles to JSX, so bare `<` and `{` characters in prose, tables, and headings are interpreted as JSX tags/expressions — causing build errors like:

```
Unexpected character `1` (U+0031) before name, expected a character that can start a name
Unexpected character `,` (U+002C) in name
Could not parse expression with acorn
```

## Common Patterns That Break

| Pattern | Example | Error |
|---------|---------|-------|
| Comparison + digit | `<2%`, `<1ms`, `<100ms` | `Unexpected character '2'` |
| Generic types | `Pick<T, K>`, `Effect<A, E, R>` | `Unexpected character ','` |
| Operators in tables | `<, >, BETWEEN` | `Unexpected character ','` |
| Curly braces | `{$cond: [if, then, else]}` | `Could not parse expression with acorn` |

## Fixes

### 1. Wrap in backticks (preferred for inline code references)

```
`<2%`          → renders as inline code
`Pick<T, K>`   → renders as inline code
`{$cond}`      → renders as inline code
```

### 2. Use HTML entity for prose text (when backticks look wrong)

```
&lt;2%         → renders as <2%
```

### 3. In headings

Always wrap generic types in backticks in headings:

```markdown
### `Partial<T>` — Making All Properties Optional
### `Pick<T, K>` — Selecting Specific Properties
```

Without backticks, MDX tries to parse `<T>` as an HTML tag and fails.

## Batch Fix Script

For fixing many files at once, use a Python script:

```python
import re, os, glob

BTICK = "`"

for fpath in glob.glob("content/blogs/*.mdx"):
    with open(fpath, "r") as f:
        content = f.read()
    
    original = content
    lines = content.split("\n")
    in_code = False
    fm_count = 0
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped == "---":
            fm_count += 1
            continue
        if stripped.startswith("```"):
            in_code = not in_code
            continue
        if in_code or fm_count < 2:
            continue
        
        # Protect existing backtick segments
        parts = re.split(r"(`[^`]+`)", line)
        fixed_parts = []
        for part in parts:
            if part.startswith("`"):
                fixed_parts.append(part)
                continue
            # Fix bare <digit patterns
            part = re.sub(r"<(\d+)", r"`<\1`", part)
            # Fix bare { followed by $ in non-code context
            part = re.sub(r"\{(\$\w+[^}]*\})", r"`{\1`", part)
            fixed_parts.append(part)
        lines[i] = "".join(fixed_parts)
    
    result = "\n".join(lines)
    if result != original:
        with open(fpath, "w") as f:
            f.write(result)
        print(f"Fixed: {os.path.basename(fpath)}")
```

**Important**: The regex for generic types (`Word<T, U>`) is tricky — it can split inside the word if not careful. For headings, fix manually with `edit` tool to ensure correct backtick placement.

## Prevention

When writing MDX content, always:
- Wrap comparison operators in backticks: `` `<5ms` `` not `<5ms`
- Wrap generic types in backticks: `` `Pick<T, K>` `` not `Pick<T, K>`
- Wrap curly-brace expressions in backticks: `` `{$cond}` `` not `{$cond}`
- In markdown tables, backtick-wrap anything with `<`, `>`, or `{`

## Verification

After fixing, run `yarn build` and check that velite reports 0 errors:
```
[VELITE] issues:
✖ 0 errors
```
