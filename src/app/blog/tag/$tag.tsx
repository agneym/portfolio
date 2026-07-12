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
      <main className="mx-auto max-w-4xl px-8 py-24">
        <div className="text-secondary-muted mb-2 flex items-center gap-x-2 text-sm">
          <Link to="/blog" className="hover:text-secondary-strong">
            Blog
          </Link>
          <span>/</span>
          <span className="text-secondary-strong">{tag}</span>
        </div>
        <h1 className="text-secondary-strong mb-8 text-2xl font-semibold text-balance">
          Posts tagged <span className="text-primary">"{tag}"</span>
        </h1>
        <div className="flex flex-col gap-y-12">
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
      </main>
    </div>
  );
}
