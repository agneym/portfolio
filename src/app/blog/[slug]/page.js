import rehypePrism from "@mapbox/rehype-prism";
import { BlogPostHeader } from "components/BlogHome";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import path from "node:path";
import remarkGfm from "remark-gfm";

export default async function BlogPostPage({ params: { slug } }) {
  const result = await bundleMDX({
    file: path.join(process.cwd(), `src/content/${slug}.mdx`),
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
  const BlogPostCode = getMDXComponent(code);

  return (
    <article className="mx-auto prose lg:prose-xl dark:prose-invert">
      <BlogPostHeader frontmatter={frontmatter} />
      <BlogPostCode />
    </article>
  );
}
