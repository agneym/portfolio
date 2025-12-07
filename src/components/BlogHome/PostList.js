import { PostListItem } from "./PostListItem";
import { getBlogPosts } from "app/blog/utils";

export function PostList() {
  const posts = getBlogPosts().sort((a, b) => {
    const dateA = new Date(a.metadata.date || a.metadata.publishedAt);
    const dateB = new Date(b.metadata.date || b.metadata.publishedAt);
    return dateB - dateA;
  });

  return (
    <>
      <h1 className="text-2xl font-semibold text-balance text-gray-700 dark:text-gray-300">
        Latest Posts
      </h1>
      <div className="mt-8 flex flex-col gap-y-12">
        {posts.map((post) => {
          return (
            <PostListItem
              key={post.slug}
              meta={{ ...post.metadata, date: post.metadata.date }}
              slug={post.slug}
            />
          );
        })}
      </div>
    </>
  );
}
