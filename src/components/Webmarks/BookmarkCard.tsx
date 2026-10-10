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
        "group bg-key relative flex flex-1 flex-col overflow-hidden rounded-2xl shadow-[inset_0_1px_0_var(--key-highlight),0_5px_0_var(--color-skirt),0_14px_24px_-14px_var(--key-cast)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-clack)] focus-within:ring-3 focus-within:ring-[var(--color-accent)] hover:-translate-y-0.5 has-[a:active]:translate-y-1 has-[a:active]:shadow-[inset_0_1px_0_var(--key-highlight),0_1px_0_var(--color-skirt),0_4px_8px_-4px_var(--key-cast)]",
        animate && "animate-rise-in",
        "motion-reduce:animate-none",
      )}
    >
      {bookmark.image ? <Thumbnail src={bookmark.image} /> : null}

      <div className="flex flex-1 flex-col gap-y-3 p-5">
        <div className="flex items-center gap-x-2">
          <Favicon favicon={bookmark.favicon} domain={domain} />
          <span className="text-secondary truncate text-sm">{domain}</span>
          {isPending ? (
            <span
              className="text-mod text-xs font-bold"
              title="Still fetching metadata for this link"
            >
              fetching
            </span>
          ) : null}
          <span className="text-secondary-muted ml-auto shrink-0 font-mono text-[0.6875rem] tabular-nums">
            {String(ordinal).padStart(3, "0")}
          </span>
        </div>

        <h2 className="text-primary font-sans text-lg leading-snug font-bold text-pretty">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            <span className="marker">{title}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="text-mod ml-1 inline h-4 w-4 align-baseline opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
            />
          </a>
        </h2>

        {bookmark.description ? (
          <p className="text-secondary line-clamp-3 text-base text-pretty">
            {bookmark.description}
          </p>
        ) : null}

        {bookmark.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2 pt-1 pb-0.5">
            {bookmark.tags.map((tag) => {
              const active = tag.name === activeTag;

              return (
                <li key={tag.id} className="relative z-10">
                  <button
                    type="button"
                    onClick={() => onTagClick(tag.name)}
                    aria-pressed={active}
                    className={clsx(
                      "keycap keycap-plain px-2.5 pt-0.5 pb-1 text-xs font-bold whitespace-nowrap [--radius-key:0.45rem] [--travel:2px]",
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
    <div className="bg-plate-deep relative m-2 mb-0 aspect-video overflow-hidden rounded-xl">
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
        className="bg-plate-deep text-secondary grid h-4 w-4 shrink-0 place-items-center rounded-sm font-mono text-[9px] font-bold uppercase"
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
