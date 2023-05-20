import { DateString } from "./DateString";
import Link from "next/link";

export function PostListItem({ meta, slug }) {
  return (
    <Link href={`/blog/${slug}`}>
      <article className="flex flex-col gap-y-3">
        <header className="flex flex-col gap-y-0.5">
          <h3 className="text-xl [text-wrap:balance]">{meta.title}</h3>
          <DateString className="text-sm text-gray-500 dark:text-gray-400">
            {meta.date}
          </DateString>
        </header>
        <p className="text-gray-600 dark:text-gray-300">
          {meta.excerpt || meta.description}
        </p>
      </article>
    </Link>
  );
}
