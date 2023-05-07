import { SubscribeNewsletter } from "components/BlogHome";

export default function BlogPost({ children }) {
  return (
    <main className="pt-12 flex flex-col gap-y-12">
      <article className="mx-auto prose lg:prose-xl dark:prose-invert">
        {children}
      </article>
      <footer className="max-w-4xl px-6 pt-12 pb-20 mx-auto border-t border-gray-200 dark:border-gray-700">
        <SubscribeNewsletter />
      </footer>
    </main>
  );
}
