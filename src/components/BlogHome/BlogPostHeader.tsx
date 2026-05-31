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
    <header className="not-prose mx-auto flex max-w-4xl flex-col gap-y-8 pt-8">
      <div className="flex flex-col gap-y-2">
        <h1 className="not-prose text-4xl font-extrabold text-balance text-slate-800 md:text-6xl dark:text-slate-100">
          {frontmatter.title}
        </h1>
        {frontmatter.date && (
          <DateString className="mx-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {frontmatter.date}
          </DateString>
        )}
      </div>
      {frontmatter.coverImage && (
        <figure>
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
    </header>
  );
}
