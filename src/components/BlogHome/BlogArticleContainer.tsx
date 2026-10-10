import type { ReactNode } from "react";
import { SubscribeNewsletter } from "./SubscribeNewsletter";

interface BlogArticleContainerProps {
  children: ReactNode;
}

export function BlogArticleContainer({ children }: BlogArticleContainerProps) {
  return (
    <div className="my-4 grid w-full grid-cols-[minmax(1rem,1fr)_minmax(0,68ch)_minmax(1rem,1fr)] gap-y-20 lg:mt-8 lg:mb-32">
      <article className="prose-ui col-span-full grid max-w-none grid-cols-[minmax(1rem,1fr)_minmax(0,68ch)_minmax(1rem,1fr)] [&>*]:col-start-2 [&>*]:min-w-0 [&>.article-full-bleed]:col-span-full [&>.article-full-bleed]:w-full [&>.article-full-bleed]:px-4 md:[&>.article-full-bleed]:px-12 lg:[&>.article-full-bleed]:px-16">
        {children}
      </article>
      <div className="col-start-2">
        <SubscribeNewsletter />
      </div>
    </div>
  );
}
