import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SkipNavContent } from "components/uikit/SkipNav";
import { PostListItem } from "components/BlogHome/PostListItem";
import { allPosts } from "content-collections";

export const Route = createFileRoute("/blog/tag/$tag")({
  loader: ({ params }: { params: { tag: string } }) => {
    const tag = params.tag;
    const posts = allPosts
      .filter(
        (post) =>
          post.published !== false &&
          post.published !== "false" &&
          post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()),
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (posts.length === 0) throw notFound();

    return { tag, posts };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.tag
          ? `Posts tagged "${loaderData.tag}" | Agney`
          : "Blog",
      },
    ],
  }),
  component: TagPage,
});

function TagPage() {
  const { tag, posts } = Route.useLoaderData();

  return (
    <div className="min-h-full">
      <SkipNavContent />
      <div className="mx-auto max-w-4xl px-4 pt-14 pb-24 sm:px-8 sm:pt-20">
        <nav
          aria-label="Breadcrumb"
          className="text-secondary mb-4 flex items-center gap-x-2 text-base"
        >
          <Link
            to="/blog"
            className="text-primary decoration-mod font-bold underline decoration-2 underline-offset-4"
          >
            Blog
          </Link>
          <span aria-hidden>/</span>
          <span className="text-secondary-strong">{tag}</span>
        </nav>
        <h1 className="text-primary mb-10 text-[clamp(2rem,5vw,3.25rem)] leading-tight font-bold tracking-[-0.02em] text-balance">
          Posts tagged{" "}
          <span className="keycap keycap-mod px-3 pb-1 align-middle text-[0.75em] [--travel:4px]">
            {tag}
          </span>
        </h1>
        <div className="divide-muted flex flex-col divide-y">
          {posts.map((post) => (
            <PostListItem
              key={post.slug}
              meta={{
                title: post.title,
                date: post.date,
                ...(post.tags != null ? { tags: post.tags } : {}),
              }}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
