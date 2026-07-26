import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { DateString } from "./DateString";
import { TagBadge } from "./TagBadge";

interface SeriesPost {
  slug: string;
  title: string;
  date: string;
}

interface BlogPostHeaderProps {
  frontmatter: {
    title: string;
    date: string;
    coverImage?: string;
    coverImageAttribution?: string;
    tags?: string[];
    series?: string;
    seriesPosts?: SeriesPost[];
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
      {frontmatter.seriesPosts && frontmatter.seriesPosts.length > 0 && (
        <details className="border-muted rounded-lg border px-4 py-3">
          <summary className="text-secondary flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            Other posts in the series
            <ChevronDown aria-hidden size={18} />
          </summary>
          <ul className="border-muted mt-3 flex flex-col gap-y-2 border-t pt-3">
            {frontmatter.seriesPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="hover:text-primary flex items-baseline justify-between gap-4 text-sm transition-colors"
                >
                  <span className="text-balance">{post.title}</span>
                  <DateString className="text-secondary-muted shrink-0 text-xs">
                    {post.date}
                  </DateString>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
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
