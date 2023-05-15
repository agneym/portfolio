import { PostListItem } from "./PostListItem";
import { getAllPosts } from "./getAllPosts";

export function PostList() {
  const posts = getAllPosts();

  return (
    <>
      <h1 className="text-2xl text-center font-semibold dark:text-gray-300 text-gray-700">
        Latest Posts
      </h1>
      <div className="flex flex-col gap-y-12 mt-8">
        {posts.map((post) => {
          return (
            <PostListItem key={post.link} meta={post.meta} slug={post.link} />
          );
        })}
      </div>
    </>
  );
}
