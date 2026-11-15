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

export type TocEntry = {
  depth: number;
  title: string;
  id: string;
};

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Reads ## to #### headings straight from the source (code fences skipped). */
function createToc(content: string) {
  const used = new Map<string, number>();
  const entries: (TocEntry & { line: number })[] = [];
  let fence: string | undefined;

  content.split("\n").forEach((raw, index) => {
    const marker = /^\s*(```+|~~~+)/.exec(raw)?.[1];
    if (marker) {
      if (!fence) fence = marker[0];
      else if (marker[0] === fence) fence = undefined;
      return;
    }
    if (fence) return;

    const match = /^(#{2,4})\s+(.+?)\s*#*\s*$/.exec(raw);
    if (!match) return;

    const title = (match[2] ?? "")
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/(\*\*|__|[*_`])(.+?)\1/g, "$2")
      .trim();
    const base = slugifyHeading(title) || "section";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    entries.push({
      depth: match[1]!.length,
      title,
      id: count ? `${base}-${count}` : base,
      line: index + 1,
    });
  });

  return entries;
}

interface MdastNode {
  type: string;
  children?: MdastNode[];
  position?: { start: { line: number } };
  data?: { hProperties?: Record<string, unknown> };
}

/**
 * The prose-ui heading only adds an id when its children are a plain string,
 * so headings wrapping links would get none. Attach the TOC ids by line.
 */
function remarkHeadingIds(idByLine: Map<number, string>) {
  return () => (tree: MdastNode) => {
    const visit = (node: MdastNode) => {
      const id =
        node.type === "heading" && node.position
          ? idByLine.get(node.position.start.line)
          : undefined;
      if (id) node.data = { ...node.data, hProperties: { id } };
      node.children?.forEach(visit);
    };
    visit(tree);
  };
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
    const headings = createToc(issue.content);
    const idByLine = new Map(headings.map((h) => [h.line, h.id]));
    const toc: TocEntry[] = headings.map(({ depth, title, id }) => ({
      depth,
      title,
      id,
    }));
    const mdx = await compileMDX(context, issue, {
      cwd: process.cwd(),
      remarkPlugins: [
        ...remarkPlugins({
          math: { singleDollarTextMath: false },
        }),
        remarkHeadingIds(idByLine),
      ],
    });

    const slug = issue._meta.path;

    return {
      ...issue,
      slug,
      shortTitle: createShortTitle(slug, issue.title),
      excerpt: createIssueExcerpt(issue.content),
      toc,
      mdx,
    };
  },
});

export default defineConfig({
  content: [posts, newsletters],
});
