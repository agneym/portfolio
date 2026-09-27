import clsx from "clsx";
import { BookmarkCard } from "./BookmarkCard";
import type { Bookmark } from "webmarks/api";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  /** Offset of the first card, so catalogue numbers stay continuous. */
  offset: number;
  activeTag: string;
  onTagClick: (tag: string) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
  isFetching: boolean;
}

export function BookmarkGrid({
  bookmarks,
  offset,
  activeTag,
  onTagClick,
  onClearFilters,
  hasFilters,
  isFetching,
}: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="border-muted animate-rise-in mt-8 rounded-xl border border-dashed px-6 py-24 text-center motion-reduce:animate-none">
        <p className="font-heading text-primary text-lg font-semibold">
          {hasFilters ? "Nothing matches that" : "The shelf is empty"}
        </p>
        <p className="text-secondary mx-auto mt-2 max-w-sm text-sm text-balance">
          {hasFilters
            ? "Try a different search term, or clear the filters to see every link."
            : "Public bookmarks appear here as soon as there is something to show."}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="border-muted text-secondary hover:border-tertiary hover:text-primary focus-visible:ring-accent mt-6 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <ul
      className={clsx(
        // items-start: cards keep their natural height instead of stretching to
        // the tallest card in the row and leaving a hole above their tags.
        "mt-8 grid list-none grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3",
        // Keep the previous page visible while the next one loads.
        isFetching && "opacity-60 transition-opacity duration-200",
      )}
    >
      {bookmarks.map((bookmark, index) => (
        <li key={bookmark.id} className="flex">
          <BookmarkCard
            bookmark={bookmark}
            ordinal={offset + index + 1}
            index={index}
            activeTag={activeTag}
            onTagClick={onTagClick}
          />
        </li>
      ))}
    </ul>
  );
}
