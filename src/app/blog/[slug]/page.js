import rehypePrism from "@mapbox/rehype-prism";
import { BlogPost, BlogPostHeader } from "components/BlogHome";
import { BlogArticleContainer } from "components/BlogHome/BlogArticleContainer";
import { getPostFrontmatter } from "components/BlogHome/getPostFrontmatter";
import { bundleMDX } from "mdx-bundler";
import path from "node:path";
import remarkGfm from "remark-gfm";
import remarkMdxImages from "remark-mdx-images";

export async function generateMetadata(props) {
  const params = await props.params;

  const { slug } = params;

  const grayMatter = await getPostFrontmatter(slug);
  return {
    title: `${grayMatter.title} | Blog | Agney`,
    tags: grayMatter.tags,
  };
}

export default async function BlogPostPage(props) {
  const params = await props.params;

  const { slug } = params;

  const result = await bundleMDX({
    file: path.join(
      process.cwd(),
      `src/content/${decodeURIComponent(slug)}.mdx`,
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

      // Mark npm packages as external so they're resolved at runtime
      options.external = [
        ...(options.external ?? []),
        // These packages for BubblingVisualizer
        "lucide-react",
        "next-themes",
      ];

      return options;
    },
  });
  const { code, frontmatter } = result;

  return (
    <BlogArticleContainer>
      <BlogPostHeader frontmatter={frontmatter} />
      <BlogPost code={code} />
    </BlogArticleContainer>
  );
}
