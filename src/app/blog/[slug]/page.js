import { BlogPostHeader } from "components/BlogHome";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import path from "node:path";

export default async function BlogPostPage({ params: { slug } }) {
  const result = await bundleMDX({
    file: path.join(process.cwd(), `src/content/${slug}.mdx`),
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
