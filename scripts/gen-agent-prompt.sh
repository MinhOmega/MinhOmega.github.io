#!/bin/bash
# Generate agent prompt for a batch of blogs
# Usage: ./scripts/gen-agent-prompt.sh <start> <end>
# Output: prompt text to stdout

START=${1:-1}
END=${2:-10}
BLOGS_DIR="/home/minhvnq/Desktop/Web/MinhOmega.github.io/content/blogs"

cat << 'HEADER'
You are a blog rewrite agent. Your task is to rewrite blog posts to be 2000-2500+ words with detailed, researched content and 3 Unsplash images injected directly.

For each blog post below, you MUST:
1. Read the existing file first using read_file
2. Preserve the EXACT frontmatter (title, date, description, tags, published, author) from the original
3. Write a comprehensive, detailed article (2000-2500+ words) covering the topic thoroughly
4. Include 3 Unsplash images using this format: ![Alt text](https://images.unsplash.com/photo-XXXXX?w=800&h=400&fit=crop)
5. Include real code examples, comparison tables, best practices, and practical implementation details
6. Use these sections: Introduction, Core Concepts, Architecture/Design Patterns, Step-by-Step Implementation, Real-World Use Cases, Best Practices (6-8), Common Pitfalls table, Performance Optimization, Comparison table, Advanced Patterns, Testing Strategies, Future Outlook, Conclusion

Topic-specific Unsplash images:
- Database: https://images.unsplash.com/photo-1544383835-bda2bc66a55d
- Performance: https://images.unsplash.com/photo-1551288049-bebda4e38f71
- DevOps/CI/CD: https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9
- Cloud/Infrastructure: https://images.unsplash.com/photo-1544197150-b99a580bb7a8
- Debugging/Tools: https://images.unsplash.com/photo-1558494949-ef010cbdcc31
- JavaScript/Code: https://images.unsplash.com/photo-1461749280684-dccba630e2f6
- Security: https://images.unsplash.com/photo-1555066931-4365d14bab8c
- Architecture: https://images.unsplash.com/photo-1516116216624-53e697fedbea
- AI/ML: https://images.unsplash.com/photo-1677442136019-21780ecad995
- Mobile: https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c
- Kubernetes: https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9
- Docker: https://images.unsplash.com/photo-1605745341112-85968b19335b
- API: https://images.unsplash.com/photo-1558494949-ef010cbdcc31
- Frontend/CSS: https://images.unsplash.com/photo-1461749280684-dccba630e2f6
- Testing: https://images.unsplash.com/photo-1555066931-4365d14bab8c

Write each file using write_file. Do NOT skip any file. Process ALL files in order.

HEADER

echo ""
echo "PROJECT DIRECTORY: /home/minhvnq/Desktop/Web/MinhOmega.github.io"
echo "BLOGS DIRECTORY: $BLOGS_DIR"
echo ""
echo "FILES TO REWRITE:"
echo "=================="

sed -n "${START},${END}p" /tmp/remaining-blogs.txt | while IFS='|' read -r file title date tags; do
  echo ""
  echo "FILE: $file"
  echo "TITLE: $title"
  echo "DATE: $date"
  echo "TAGS: $tags"
  echo "---"
done
