import { PostListItem } from "./PostListItem";
import { allPosts } from "content-collections";

export function PostList() {
  const posts = allPosts
    .filter((post) => post.published !== false && post.published !== "false")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
              meta={{ title: post.title, date: post.date }}
              slug={post.slug}
            />
          );
        })}
      </div>
    </>
  );
}
