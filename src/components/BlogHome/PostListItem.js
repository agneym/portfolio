import { DateString } from "./DateString";
import Link from "next/link";

export function PostListItem({ meta, slug }) {
  return (
    <Link
      href={{
        pathname: `/blog/${slug}`,
        query: { title: meta.title },
      }}
    >
      <article className="flex flex-col gap-y-4 py-2">
        <header className="flex flex-col gap-y-1">
          <h3 className="text-xl text-balance">{meta.title}</h3>
          <DateString className="text-xs text-gray-500 dark:text-gray-400">
            {meta.date}
          </DateString>
        </header>
      </article>
    </Link>
  );
}
