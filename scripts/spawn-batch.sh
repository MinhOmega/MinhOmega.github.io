#!/bin/bash
# Usage: ./scripts/spawn-batch.sh <start_line> <count>
# Reads /tmp/remaining-blogs.txt and outputs blog metadata for a batch

START=${1:-1}
COUNT=${2:-10}
BLOGS_DIR="/home/minhvnq/Desktop/Web/MinhOmega.github.io/content/blogs"

sed -n "${START},$((START + COUNT - 1))p" /tmp/remaining-blogs.txt | while IFS='|' read -r file title date tags; do
  echo "=== FILE: $file ==="
  echo "Title: $title"
  echo "Date: $date"
  echo "Tags: $tags"
  echo ""
done
