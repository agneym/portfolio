import rehypePrism from "@mapbox/rehype-prism";
import { BlogPost, BlogPostHeader } from "components/BlogHome";
import { bundleMDX } from "mdx-bundler";
import path from "node:path";
import remarkGfm from "remark-gfm";

export default async function BlogPostPage({ params: { slug } }) {
  const result = await bundleMDX({
    file: path.join(
      process.cwd(),
      `src/content/${decodeURIComponent(slug)}.mdx`
    ),
    mdxOptions(options) {
      return {
        ...options,
        remarkPlugins: [...(options.remarkPlugins ?? []), remarkGfm],
        rehypePlugins: [...(options.rehypePlugins ?? []), rehypePrism],
      };
    },
    grayMatterOptions: (options) => {
      options.excerpt = true;

      return options;
    },
  });
  const { code, frontmatter } = result;

  return (
    <article className="mx-auto prose lg:prose-xl dark:prose-invert">
      <BlogPostHeader frontmatter={frontmatter} />
      <BlogPost code={code} />
    </article>
  );
}
