import { SubscribeNewsletter } from "./SubscribeNewsletter";

export function BlogArticleContainer({ children }) {
  return (
    <div className="flex flex-col gap-y-16 my-32 mx-auto max-w-3xl">
      <article className="mx-auto prose lg:prose-xl dark:prose-invert px-6 max-w-[min(65ch,100%)]">
        {children}
      </article>
      <hr className="border-gray-200 dark:border-gray-600/10" />
      <SubscribeNewsletter />
    </div>
  );
}
