import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { displayDomain, type Bookmark } from "webmarks/api";

interface BookmarkCardProps {
  bookmark: Bookmark;
  /** 1-based position across the whole list, shown like a catalogue number. */
  ordinal: number;
  index: number;
  /** Play the staggered entrance — first paint of the grid only. */
  animate: boolean;
  activeTag: string;
  onTagClick: (tag: string) => void;
}

export function BookmarkCard({
  bookmark,
  ordinal,
  index,
  animate,
  activeTag,
  onTagClick,
}: BookmarkCardProps) {
  const domain = displayDomain(bookmark.url);
  const isPending = bookmark.fetchStatus === "pending";
  const title = bookmark.title?.trim() || domain;

  return (
    <article
      style={
        animate
          ? { animationDelay: `${Math.min(index, 11) * 35}ms` }
          : undefined
      }
      className={clsx(
        "group border-muted bg-surface hover:border-accent-muted hover:shadow-accent/5 relative flex flex-1 flex-col overflow-hidden rounded-xl border transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        animate && "animate-rise-in",
        "motion-reduce:animate-none",
      )}
    >
      {bookmark.image ? <Thumbnail src={bookmark.image} /> : null}

      <div className="flex flex-1 flex-col gap-y-3 p-5">
        <div className="flex items-center gap-x-2">
          <Favicon favicon={bookmark.favicon} domain={domain} />
          <span className="text-tertiary truncate font-mono text-[0.6875rem] tracking-wide uppercase">
            {domain}
          </span>
          {isPending ? (
            <span
              className="text-accent animate-pulse font-mono text-[0.625rem] tracking-wide uppercase"
              title="Still fetching metadata for this link"
            >
              fetching
            </span>
          ) : null}
          <span className="text-tertiary ml-auto shrink-0 font-mono text-[0.6875rem] tabular-nums">
            {String(ordinal).padStart(3, "0")}
          </span>
        </div>

        <h2 className="font-heading text-primary text-base leading-snug font-semibold text-pretty">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent focus-visible:ring-accent rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:outline-none"
          >
            {title}
            <ArrowUpRight
              aria-hidden="true"
              className="text-tertiary ml-1 inline h-3.5 w-3.5 align-baseline opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
            />
          </a>
        </h2>

        {bookmark.description ? (
          <p className="text-secondary line-clamp-3 text-sm text-pretty">
            {bookmark.description}
          </p>
        ) : null}

        {bookmark.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {bookmark.tags.map((tag) => {
              const active = tag.name === activeTag;

              return (
                <li key={tag.id} className="relative z-10">
                  <button
                    type="button"
                    onClick={() => onTagClick(tag.name)}
                    aria-pressed={active}
                    className={clsx(
                      "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors",
                      active
                        ? "border-accent bg-accent text-text-on-accent"
                        : "border-muted text-secondary hover:border-tertiary hover:text-primary",
                    )}
                  >
                    {tag.name}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function Thumbnail({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  return (
    <div className="border-muted bg-muted relative aspect-video overflow-hidden border-b">
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    </div>
  );
}

interface FaviconProps {
  favicon: string | null;
  domain: string;
}

function Favicon({ favicon, domain }: FaviconProps) {
  const [failed, setFailed] = useState(false);

  if (!favicon || failed) {
    return (
      <span
        aria-hidden="true"
        className="border-muted text-tertiary grid h-4 w-4 shrink-0 place-items-center rounded-sm border font-mono text-[9px] font-bold uppercase"
      >
        {domain.slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      src={favicon}
      alt=""
      width={16}
      height={16}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-4 w-4 shrink-0 rounded-sm"
    />
  );
}
