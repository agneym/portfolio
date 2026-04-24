import { createFileRoute, notFound } from "@tanstack/react-router";
import { MDXContent } from "@content-collections/mdx/react";
import { BlogArticleContainer } from "components/BlogHome/BlogArticleContainer";
import { BlogPostHeader } from "components/BlogHome/BlogPostHeader";
import { CustomMDXComponents } from "components/mdx";
import { allPosts } from "content-collections";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }: { params: { slug: string } }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    if (post.published === false || post.published === "false")
      throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    return {
      meta: [
        { title: post?.title ? `${post.title} | Agney` : "Blog" },
        { name: "description", content: post?.title ?? "" },
        { name: "keywords", content: post?.tags?.join(", ") ?? "" },
        { property: "og:title", content: post?.title ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:publishedTime", content: post?.date ?? "" },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  return (
    <BlogArticleContainer>
      <BlogPostHeader
        frontmatter={{
          title: post.title,
          date: post.date,
        }}
      />
      <MDXContent code={post.mdx} components={CustomMDXComponents} />
    </BlogArticleContainer>
  );
}
