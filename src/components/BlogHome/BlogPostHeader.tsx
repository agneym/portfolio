import { DateString } from "./DateString";
import { TagBadge } from "./TagBadge";

interface BlogPostHeaderProps {
  frontmatter: {
    title: string;
    date: string;
    coverImage?: string;
    coverImageAttribution?: string;
    tags?: string[];
  };
}

export function BlogPostHeader({ frontmatter }: BlogPostHeaderProps) {
  return (
    <header className="not-prose mx-auto flex max-w-4xl flex-col gap-y-8 pt-8">
      <div className="flex flex-col gap-y-2">
        <h1 className="not-prose text-primary text-4xl font-extrabold text-balance md:text-6xl">
          {frontmatter.title}
        </h1>
        {frontmatter.date && (
          <DateString className="text-secondary-muted mx-2 text-sm font-semibold">
            {frontmatter.date}
          </DateString>
        )}
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="mx-2 mt-3 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
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
            <figcaption className="text-tertiary mt-2 text-center text-xs">
              {frontmatter.coverImageAttribution}
            </figcaption>
          )}
        </figure>
      )}
    </header>
  );
}
