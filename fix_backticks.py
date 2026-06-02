#!/usr/bin/env python3
"""Fix unclosed backtick patterns from previous fix script."""
import re
import os
import glob

blog_dir = "content/blogs"
files = glob.glob(os.path.join(blog_dir, "*.mdx"))
BTICK = "`"

fixes = 0
for fpath in files:
    with open(fpath, "r") as f:
        content = f.read()

    original = content

    # Fix unclosed backtick: ` <digit... not followed by backtick
    # e.g., `<5ms (none) -> `<5ms` (none)
    # e.g., `<1ms to each -> `<1ms` to each
    # e.g., `<2% degradation -> `<2%` degradation
    # e.g., `<10ms) -> `<10ms`)
    pattern = re.compile(r"`<(\d+\w*%?)(?!`)")
    content = pattern.sub(r"`<\1`", content)

    # Also fix: `<5ms` where backtick is already there (no double-close)
    # The above regex already handles this with the negative lookahead

    if content != original:
        with open(fpath, "w") as f:
            f.write(content)
        changes = sum(
            1
            for a, b in zip(original.split("\n"), content.split("\n"))
            if a != b
        )
        print(f"{os.path.basename(fpath)}: {changes} lines fixed")
        fixes += changes

print(f"\nTotal: {fixes} lines fixed")
