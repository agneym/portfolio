import { SubscribeNewsletter } from "./SubscribeNewsletter";

export function BlogArticleContainer({ children }) {
  return (
    <div className="mx-auto my-32 flex max-w-3xl flex-col gap-y-16">
      <article className="prose lg:prose-xl dark:prose-invert mx-auto max-w-[min(65ch,100%)] px-6">
        {children}
      </article>
      <hr className="border-gray-200 dark:border-gray-600/10" />
      <SubscribeNewsletter />
    </div>
  );
}
