import { getFormattedDate } from "./getFormattedDate";

export function BlogPostHeader({ frontmatter }) {
  return (
    <header className="max-w-4xl mx-auto not-prose pt-8 pb-16">
      <p className="text-slate-500 dark:text-slate-400 text-sm uppercase mx-2 font-semibold">
        Published on {getFormattedDate(frontmatter.date)}
      </p>
      <h1 className="not-prose text-8xl text-slate-800 dark:text-slate-100 font-extrabold [text-wrap:balance]">
        {frontmatter.title}
      </h1>
    </header>
  );
}
