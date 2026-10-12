import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { displayDomain, type Bookmark } from "webmarks/api";

interface BookmarkCardProps {
  bookmark: Bookmark;
  index: number;
  /** Play the staggered entrance — first paint of the grid only. */
  animate: boolean;
  activeTag: string;
  onTagClick: (tag: string) => void;
}

export function BookmarkCard({
  bookmark,
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
        "group relative flex w-full flex-col gap-y-3 rounded-xl outline-offset-4 has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-[var(--color-accent)]",
        animate && "animate-rise-in",
        "motion-reduce:animate-none",
      )}
    >
      <Thumbnail
        src={bookmark.image}
        favicon={bookmark.favicon}
        domain={domain}
      />

      <div className="mt-1 flex items-center gap-x-2">
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
      </div>

      <h2 className="text-primary font-sans text-lg leading-snug font-bold text-pretty">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
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
          {bookmark.tags.map((tag) => (
            <li key={tag.id} className="relative z-10">
              <button
                type="button"
                onClick={() => onTagClick(tag.name)}
                aria-pressed={tag.name === activeTag}
                className="keycap keycap-plain px-2.5 pt-0.5 pb-1 text-xs font-bold whitespace-nowrap [--radius-key:0.45rem] [--travel:2px]"
              >
                {tag.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

interface ThumbnailProps {
  src: string | null;
  favicon: string | null;
  domain: string;
}

/**
 * Every card opens with a 16:9 block — the image, or a placeholder of the same
 * size when there is none or it fails — so cards in a row line up.
 */
function Thumbnail({ src, favicon, domain }: ThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className="bg-plate-deep relative grid aspect-video place-items-center overflow-hidden rounded-xl">
      {showImage ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          // A server-rendered image can fail before hydration attaches
          // onError; catch that case when the element mounts.
          ref={(img) => {
            if (img?.complete && img.naturalWidth === 0) {
              setFailed(true);
            }
          }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <Favicon favicon={favicon} domain={domain} size="lg" />
      )}
    </div>
  );
}

interface FaviconProps {
  favicon: string | null;
  domain: string;
  size?: "sm" | "lg";
}

function Favicon({ favicon, domain, size = "sm" }: FaviconProps) {
  const [failed, setFailed] = useState(false);
  const large = size === "lg";

  if (!favicon || failed) {
    return (
      <span
        aria-hidden="true"
        className={clsx(
          "text-secondary grid shrink-0 place-items-center font-mono font-bold uppercase",
          large
            ? "bg-key h-14 w-14 rounded-xl text-2xl"
            : "bg-plate-deep h-4 w-4 rounded-sm text-[9px]",
        )}
      >
        {domain.slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      src={favicon}
      alt=""
      width={large ? 40 : 16}
      height={large ? 40 : 16}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      ref={(img) => {
        if (img?.complete && img.naturalWidth === 0) {
          setFailed(true);
        }
      }}
      className={clsx(
        "shrink-0",
        large ? "h-10 w-10 rounded-lg" : "h-4 w-4 rounded-sm",
      )}
    />
  );
}
