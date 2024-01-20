import { DateString } from "./DateString";

export function BlogPostHeader({ frontmatter }) {
  return (
    <header className="max-w-4xl mx-auto not-prose pt-8 pb-10">
      <h1 className="not-prose text-7xl text-slate-800 dark:text-slate-100 font-extrabold text-balance">
        {frontmatter.title}
      </h1>
      {frontmatter.date && (
        <DateString className="text-slate-500 dark:text-slate-400 text-sm mx-2 font-semibold">
          {frontmatter.date}
        </DateString>
      )}
    </header>
  );
}
