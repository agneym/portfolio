import type { Frontmatter } from "app/blog/utils";
import { DateString } from "./DateString";

interface BlogPostHeaderProps {
  frontmatter: Frontmatter;
}

export function BlogPostHeader({ frontmatter }: BlogPostHeaderProps) {
  return (
    <header className="not-prose mx-auto max-w-4xl pt-8 pb-10">
      <h1 className="not-prose text-6xl font-extrabold text-balance text-slate-800 dark:text-slate-100">
        {frontmatter.title}
      </h1>
      {frontmatter.date && (
        <DateString className="mx-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          {frontmatter.date}
        </DateString>
      )}
    </header>
  );
}
