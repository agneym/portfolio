import type { ReactNode } from "react";
import { SubscribeNewsletter } from "./SubscribeNewsletter";

interface BlogArticleContainerProps {
  children: ReactNode;
}

export function BlogArticleContainer({ children }: BlogArticleContainerProps) {
  return (
    <div className="my-4 grid w-full grid-cols-[minmax(1.5rem,1fr)_minmax(0,65ch)_minmax(1.5rem,1fr)] gap-y-16 lg:mt-16 lg:mb-32">
      <article className="prose-ui col-span-full grid max-w-none grid-cols-[minmax(1.5rem,1fr)_minmax(0,65ch)_minmax(1.5rem,1fr)] [&>*]:col-start-2 [&>*]:min-w-0 [&>.article-full-bleed]:col-span-full [&>.article-full-bleed]:w-full [&>.article-full-bleed]:px-4 md:[&>.article-full-bleed]:px-12 lg:[&>.article-full-bleed]:px-16">
        {children}
      </article>
      <hr className="col-start-2 border-gray-200 dark:border-gray-600/10" />
      <div className="col-start-2">
        <SubscribeNewsletter />
      </div>
    </div>
  );
}
