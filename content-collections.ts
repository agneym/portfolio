import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { type } from "arktype";

function createExcerpt(content: string) {
  return (
    content
      .replace(/^import\s.+$/gm, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/<[^>]+>/g, "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.replace(/^#+\s*/, "").trim())
      .find(Boolean) ?? ""
  );
}

const postSchema = type({
  title: "string",
  date: "string",
  "tags?": "string[]",
  "published?": "boolean | 'true' | 'false'",
  content: "string",
});

const posts = defineCollection({
  name: "posts",
  directory: "src/app/blog/posts",
  include: "*.mdx",
  schema: postSchema,
  transform: async (post, context) => {
    const mdx = await compileMDX(context, post, {
      cwd: process.cwd(),
    });

    return {
      title: post.title,
      date: post.date,
      tags: post.tags,
      published: post.published,
      content: post.content,
      _meta: post._meta,
      slug: post._meta.path,
      excerpt: createExcerpt(post.content),
      mdx,
    };
  },
});

export default defineConfig({
  content: [posts],
});
