import { PostListItem } from "./PostListItem";
import { getAllPosts } from "./getAllPosts";

const posts = getAllPosts();

export function PostList() {
  console.log(posts[1].meta);
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
