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
    <header className="not-prose mx-auto flex w-full flex-col gap-y-8 pt-10 pb-6 sm:pt-16">
      <div className="flex flex-col gap-y-5">
        {frontmatter.date && (
          <DateString className="text-secondary tabular text-base">
            {frontmatter.date}
          </DateString>
        )}
        <h1 className="not-prose text-primary text-[clamp(2.125rem,5.5vw,3.75rem)] leading-[1.08] font-bold tracking-[-0.025em] text-balance">
          {frontmatter.title}
        </h1>
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {frontmatter.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
      {frontmatter.seriesPosts && frontmatter.seriesPosts.length > 0 && (
        <details className="group bg-key rounded-2xl px-5 py-4 shadow-[inset_0_1px_0_var(--key-highlight),0_4px_0_var(--color-skirt)]">
          <summary className="text-primary flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
            Other posts in the series
            <ChevronDown
              aria-hidden
              size={20}
              className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-open:rotate-180"
            />
          </summary>
          <ul className="border-muted mt-4 flex flex-col gap-y-1 border-t pt-3">
            {frontmatter.seriesPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group/series text-secondary-strong hover:text-primary flex items-baseline justify-between gap-4 rounded-lg py-1.5"
                >
                  <span className="text-balance">
                    <span className="marker">{post.title}</span>
                  </span>
                  <DateString className="text-secondary-muted tabular shrink-0 text-sm">
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
            className="max-h-[400px] w-full rounded-[var(--radius-plate)] object-cover shadow-[0_6px_0_var(--color-skirt),0_20px_32px_-16px_var(--key-cast)]"
          />
          {frontmatter.coverImageAttribution && (
            <figcaption className="text-secondary mt-3 text-center text-sm">
              {frontmatter.coverImageAttribution}
            </figcaption>
          )}
        </figure>
      )}
    </header>
  );
}
