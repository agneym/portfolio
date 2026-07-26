import { Suspense } from "react";
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
    const ogImageUrl = post?.title
      ? `https://agney.dev/og?title=${encodeURIComponent(post.title)}`
      : undefined;

    return {
      meta: [
        { title: post?.title ? `${post.title} | Agney` : "Blog" },
        { name: "description", content: post?.title ?? "" },
        { property: "og:title", content: post?.title ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:publishedTime", content: post?.date ?? "" },
        ...(ogImageUrl
          ? [
              { property: "og:image", content: ogImageUrl },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
            ]
          : []),
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const seriesPosts = post.series
    ? allPosts
        .filter(
          (candidate) =>
            candidate.slug !== post.slug &&
            candidate.series === post.series &&
            candidate.published !== false &&
            candidate.published !== "false",
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(({ slug, title, date }) => ({ slug, title, date }))
    : [];

  return (
    <BlogArticleContainer>
      <BlogPostHeader
        frontmatter={{
          title: post.title,
          date: post.date,
          ...(post.tags != null ? { tags: post.tags } : {}),
          ...(post.series != null ? { series: post.series } : {}),
          ...(seriesPosts.length > 0 ? { seriesPosts } : {}),
          ...(post.coverImage != null ? { coverImage: post.coverImage } : {}),
          ...(post.coverImageAttribution != null
            ? { coverImageAttribution: post.coverImageAttribution }
            : {}),
        }}
      />
      <Suspense fallback={null}>
        <MDXContent code={post.mdx} components={CustomMDXComponents} />
      </Suspense>
    </BlogArticleContainer>
  );
}
