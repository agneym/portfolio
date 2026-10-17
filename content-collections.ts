import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { remarkPlugins } from "@prose-ui/core";
import { type } from "arktype";

function getParagraphs(content: string) {
  return content
    .replace(/^import\s.+$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/^#+\s*/, "").trim())
    .filter(Boolean);
}

function createExcerpt(content: string) {
  return getParagraphs(content)[0] ?? "";
}

/** Issues open with a greeting ("Hello October!"), so skip short paragraphs. */
function createIssueExcerpt(content: string) {
  const paragraphs = getParagraphs(content)
    .filter((paragraph) => !/^(!\[|[-*>] )/.test(paragraph))
    .map((paragraph) =>
      paragraph
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/(\*\*|__|[*_`])(.+?)\1/g, "$2"),
    )
    .filter((paragraph) => !/^https?:\/\/\S+$/.test(paragraph));
  return (
    paragraphs.find((paragraph) => paragraph.length >= 60) ??
    paragraphs[0] ??
    ""
  );
}

/** "web-in-april-2026" becomes "Web in April 2026"; other slugs keep the title. */
function createShortTitle(slug: string, title: string) {
  const match = /^web-in-([a-z]+)-(\d{4})$/.exec(slug);
  if (!match) return title;
  const [, month = "", year = ""] = match;
  return `Web in ${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`;
}

const postSchema = type({
  title: "string",
  date: "string",
  "tags?": "string[]",
  "published?": "boolean | 'true' | 'false'",
  "coverImage?": "string",
  "coverImageAttribution?": "string",
  "series?": "string",
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
      remarkPlugins: remarkPlugins({
        math: { singleDollarTextMath: false },
      }),
    });

    return {
      title: post.title,
      date: post.date,
      tags: post.tags?.map((t) => t.toLowerCase()),
      published: post.published,
      coverImage: post.coverImage,
      coverImageAttribution: post.coverImageAttribution,
      series: post.series,
      content: post.content,
      _meta: post._meta,
      slug: post._meta.path,
      excerpt: createExcerpt(post.content),
      mdx,
    };
  },
});

const newsletterSchema = type({
  title: "string",
  date: "string",
  "description?": "string",
  "image?": "string",
  buttondownUrl: "string",
  content: "string",
});

const newsletters = defineCollection({
  name: "newsletters",
  directory: "src/app/newsletter/issues",
  include: "*.mdx",
  schema: newsletterSchema,
  transform: async (issue, context) => {
    const mdx = await compileMDX(context, issue, {
      cwd: process.cwd(),
      remarkPlugins: remarkPlugins({
        math: { singleDollarTextMath: false },
      }),
    });

    const slug = issue._meta.path;

    return {
      ...issue,
      slug,
      shortTitle: createShortTitle(slug, issue.title),
      excerpt: createIssueExcerpt(issue.content),
      mdx,
    };
  },
});

export default defineConfig({
  content: [posts, newsletters],
});
