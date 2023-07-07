import rehypePrism from "@mapbox/rehype-prism";
import { BlogPost, BlogPostHeader } from "components/BlogHome";
import { getPostFrontmatter } from "components/BlogHome/getPostFrontmatter";
import { bundleMDX } from "mdx-bundler";
import path from "node:path";
import remarkGfm from "remark-gfm";
import remarkMdxImages from "remark-mdx-images";

export async function generateMetadata({ params: { slug } }) {
  const grayMatter = await getPostFrontmatter(slug);
  return {
    title: `${grayMatter.title} | Blog | Agney`,
    tags: grayMatter.tags,
  };
}

export default async function BlogPostPage({ params: { slug } }) {
  const result = await bundleMDX({
    file: path.join(
      process.cwd(),
      `src/content/${decodeURIComponent(slug)}.mdx`
    ),
    cwd: path.join(process.cwd(), "src/content"),
    mdxOptions(options) {
      return {
        ...options,
        remarkPlugins: [
          ...(options.remarkPlugins ?? []),
          remarkGfm,
          remarkMdxImages,
        ],
        rehypePlugins: [...(options.rehypePlugins ?? []), rehypePrism],
      };
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        ".png": "dataurl",
        ".jpg": "dataurl",
        ".gif": "dataurl",
        ".svg": "dataurl",
      };

      return options;
    },
  });
  const { code, frontmatter } = result;

  return (
    <article className="mx-auto prose lg:prose-xl dark:prose-invert px-6 max-w-[min(65ch,100%)]">
      <BlogPostHeader frontmatter={frontmatter} />
      <BlogPost code={code} />
    </article>
  );
}
