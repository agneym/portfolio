import { PostListItem } from "./PostListItem";

export function PostList() {
  return (
    <>
      <h1 className="text-2xl text-center">Latest Posts</h1>
      <div className="flex flex-col gap-y-12 mt-8">
        <PostListItem />
        <PostListItem />
        <PostListItem />
        <PostListItem />
      </div>
    </>
  );
}
