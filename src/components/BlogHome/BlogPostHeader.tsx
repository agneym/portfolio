import { DateString } from "./DateString";

interface BlogPostHeaderProps {
  frontmatter: {
    title: string;
    date: string;
    coverImage?: string;
    coverImageAttribution?: string;
  };
}

export function BlogPostHeader({ frontmatter }: BlogPostHeaderProps) {
  return (
    <header className="not-prose mx-auto max-w-4xl pt-8 pb-10">
      {frontmatter.coverImage && (
        <figure className="mb-8">
          <img
            src={frontmatter.coverImage}
            alt={`Cover for ${frontmatter.title}`}
            className="w-full rounded-lg object-cover shadow-lg"
            style={{ maxHeight: "400px" }}
          />
          {frontmatter.coverImageAttribution && (
            <figcaption className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
              {frontmatter.coverImageAttribution}
            </figcaption>
          )}
        </figure>
      )}
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
