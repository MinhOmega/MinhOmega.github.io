#!/usr/bin/env python3
"""
Compact blog generator. Import and call write_blog() to create MDX files.
Each blog gets: frontmatter, intro, 5-8 sections with code, conclusion.
Usage: import blog_generator; blog_generator.write_blog(title, slug, date, desc, tags, category, sections)
"""

import os
import random

DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "content", "blogs")

IMAGES = {
    "ai": ["1677442136019-21780ecad995","1620712943543-bcc4688e7485","1485827404703-89b55fcc595e","1555255707-c07966088b7b","1655720828018-edd7da08fc63","1593508512255-86ab42a8e620","1531746790095-e5cb119beeac"],
    "frontend": ["1516116216624-53e697fedbea","1507003211169-0a1dd7228f2d","1542831371-29b0f74f9713","1517180102446-f3ece451e9d8","1555066931-4365d14bab8c","1593720213428-28ef53f2ebf1"],
    "backend": ["1558494949-ef010cbdcc31","1526374965328-7f61d4dc18c5","1518770660439-4636190af475","1504639725590-34d0984388bd","1551288049-bebda4e38f71","1460925895917-afdab827c52f"],
    "devops": ["1667372393119-3d4c48d07fc9","1558494949-ef010cbdcc31","1605745341112-85968b19335b","1518770660439-4636190af475","1629654297299-c8506221ca97"],
    "database": ["1544256718-0b1aa4c2e686","1504639725590-34d0984388bd","1551288049-bebda4e38f71","1460925895917-afdab827c52f"],
    "security": ["1555949963-aa79dcee981c","1563013544-824ae1b704d3","1550751827-4bd374c3f58b","1563986768494-4dee2763ff3f"],
    "mobile": ["1512941937669-90a1b58e7e9c","1551650975-87deedd944c3","1526498460520-4c246339dccb"],
    "cloud": ["1451187580459-43490279c0fa","1504639725590-34d0984388bd","1558494949-ef010cbdcc31"],
    "career": ["1522202176988-66273c2fd55f","1516321318423-f06f85e504b3","1507679799987-c73779587ccf"],
    "testing": ["1576444356170-66073f8af90a","1504639725590-34d0984388bd","1555066931-4365d14bab8c"],
    "webapi": ["1558494949-ef010cbdcc31","1526374965328-7f61d4dc18c5","1518770660439-4636190af475"],
    "performance": ["1551288049-bebda4e38f71","1504639725590-34d0984388bd","1460925895917-afdab827c52f"],
    "emerging": ["1620712943543-bcc4688e7485","1677442136019-21780ecad995","1485827404703-89b55fcc595e"],
    "design": ["1558655146-9f40138edfeb","1541462608143-67571c6738dd","1561070791-2526d30994b5"],
    "data": ["1551288049-bebda4e38f71","1504639725590-34d0984388bd","1460925895917-afdab827c52f"],
    "blockchain": ["1621761191319-c6fb62004040","1639762681485-074b7f938ba0","1642104704074-907c0675cb24"],
}

def img(cat):
    ids = IMAGES.get(cat, IMAGES["ai"])
    return f"![{cat} illustration](https://images.unsplash.com/photo-{random.choice(ids)}?w=800&h=400&fit=crop)"

def write_blog(title, slug, date, description, tags, category, sections):
    """Write a complete MDX blog post.
    
    sections: list of (heading, body_paragraphs) tuples
    body_paragraphs: string with full paragraph content (will be placed under the heading)
    """
    os.makedirs(DIR, exist_ok=True)
    path = os.path.join(DIR, f"{slug}.mdx")
    if os.path.exists(path):
        return False
    
    tags_str = ", ".join(f'"{t}"' for t in tags)
    
    parts = [f"""---
title: "{title}"
date: "{date}"
description: "{description}"
tags: [{tags_str}]
published: true
author: "MinhVo"
---

## Introduction

{sections[0][1] if sections else "This article explores an important topic in modern software development."}
"""]
    
    for i, (heading, body) in enumerate(sections):
        img_insert = ""
        if i == 0 or (i > 0 and i % 3 == 0):
            img_insert = f"\n{img(category)}\n"
        parts.append(f"## {heading}\n{img_insert}\n{body}\n")
    
    parts.append("""## Conclusion

The topics covered in this article represent important developments in modern software engineering. By understanding these concepts deeply and applying them in your projects, you can build more robust, scalable, and maintainable systems. Continue exploring, experimenting, and building — the technology landscape rewards those who stay curious and keep learning.
""")
    
    content = "\n".join(parts)
    with open(path, "w") as f:
        f.write(content)
    return True

def slugify(title):
    s = title.lower().replace(":", "").replace(",", "").replace("'", "").replace("'", "")
    s = s.replace("(", "").replace(")", "").replace("/", "-").replace("  ", " ").replace(" ", "-")
    return s.replace("---", "-").replace("--", "-").strip("-")[:80]

if __name__ == "__main__":
    print(f"Blog generator loaded. Directory: {DIR}")
    print(f"Existing blogs: {len([f for f in os.listdir(DIR) if f.endswith('.mdx')])}")
