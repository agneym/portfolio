import { PostRenderer } from "components/BlogPost";

export const BlogPostPage = () => {
  return (
    <article className="mx-auto prose lg:prose-xl dark:prose-invert">
      <PostRenderer>{children}</PostRenderer>
    </article>
  );
};
