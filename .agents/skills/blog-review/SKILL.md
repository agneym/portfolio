---
name: blog-review
description: Review a technical blog post for grammar, storytelling, and technical accuracy. Use when asked to review, edit, or improve blog posts in src/app/blog/posts/.
---

# Blog Review

Review a blog post using three review phases: grammar editing, storytelling review, and technical accuracy check.

## Usage

When the user provides a blog post slug (e.g., `/skill:blog-review my-post`), locate and review the file at `src/app/blog/posts/<slug>.mdx`.

## Review Process

Read the file first, then systematically apply each review phase below. For each phase, provide feedback and make inline edits where appropriate (grammar phase only). After all three phases are complete, summarize the changes and suggestions.

---

## Phase 1: Grammar & Legibility Editing

Act as a grammar and readability editor. Your task:

1. Fix all grammatical errors
2. Correct spelling mistakes
3. Improve sentence structure for better legibility
4. Rewrite unclear sentences to make them more readable
5. Maintain the author's voice and technical accuracy

When editing:

- **Make inline edits directly** to the content using the `edit` tool
- Keep technical terminology intact
- Preserve code examples and formatting
- Make the content flow better while keeping the original meaning
- Be concise and avoid over-editing

Focus on clarity and readability. Don't change the technical content unless there's an obvious error.

---

## Phase 2: Storytelling Review

Act as a storytelling and narrative editor. Review the blog post from a storytelling perspective and provide constructive suggestions on:

1. **Narrative flow** - Does the post have a clear beginning, middle, and end?
2. **Engagement** - Is it engaging and interesting to read?
3. **Structure** - Are ideas presented in a logical order?
4. **Hook** - Does the opening grab the reader's attention?
5. **Conclusion** - Does the ending provide a satisfying takeaway?
6. **Voice** - Is the tone consistent and appropriate for the topic?

Provide specific suggestions:

- Point out sections that are confusing or hard to follow
- Suggest better ways to introduce or transition between ideas
- Recommend where to add examples or clarify concepts
- Highlight parts that are too long or too short
- Suggest ways to make the content more engaging

**Do NOT make any edits in this phase.** Only provide analysis and suggestions for improvement. The author will decide what to apply.

---

## Phase 3: Technical Accuracy Review

Act as a technical reviewer specializing in JavaScript and web development. Review the blog post for:

1. **Technical accuracy** - Verify the technical concepts are correct and up-to-date
2. **Code syntax** - Check all code snippets for syntax errors
3. **Code correctness** - Ensure code examples actually work as described
4. **Best practices** - Check if the code follows modern JavaScript/web development best practices
5. **Version accuracy** - Verify that API references and syntax are correct for the versions mentioned
6. **Potential bugs** - Identify any bugs or edge cases that might cause issues

When reviewing:

- Be specific about any errors or issues found
- Suggest corrections for code snippets
- Recommend better alternatives if applicable
- Verify that explanations match how the code actually works
- Check for security issues or bad practices

**Do NOT make any edits.** Provide a detailed review with specific findings and recommendations.

---

## After All Phases

Summarize the changes made (Phase 1) and the suggestions provided (Phases 2 & 3). Help the author understand the most important changes to make.
