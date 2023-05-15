import { PostRenderer } from "components/BlogPost";
import { bundleMDX } from "mdx-bundler";
import path from "node:path";

export default async function BlogPostPage({ params: { slug } }) {
  const result = await bundleMDX({
    file: path.join(process.cwd(), `src/content/${slug}.mdx`),
  });
  const { code, frontmatter } = result;

  return (
    <article className="mx-auto prose lg:prose-xl dark:prose-invert">
      <PostRenderer code={code} />
    </article>
  );
}
