---
description: Review a blog post using the blog assistant
agent: blog-assistant
---

Review the blog post at src/app/blog/posts/$1.mdx

Please read the post and provide a comprehensive review using the available subagents:

1. Use @grammar-editor to fix any grammar, spelling, and legibility issues inline
2. Use @story-editor to review the storytelling aspect and provide suggestions
3. Use @tech-reviewer to check technical accuracy and code correctness

Start by reading the file, then systematically apply each subagent's review process. For each subagent, provide their feedback and make inline edits where appropriate (grammar-editor only).
