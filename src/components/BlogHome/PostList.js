import { PostListItem } from "./PostListItem";
import { getSortedPostsData } from "./getAllPosts";

const posts = getSortedPostsData();

export function PostList() {
  return (
    <>
      <h1 className="text-2xl text-center font-semibold dark:text-gray-300 text-gray-700">
        Latest Posts
      </h1>
      <div className="flex flex-col gap-y-12 mt-8">
        {posts.map((post) => {
          return <PostListItem key={post.slug} meta={post} slug={post.slug} />;
        })}
      </div>
    </>
  );
}
