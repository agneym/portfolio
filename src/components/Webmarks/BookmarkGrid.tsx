import { useState } from "react";
import clsx from "clsx";
import { BookmarkCard } from "./BookmarkCard";
import type { Bookmark } from "webmarks/api";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  activeTag: string;
  onTagClick: (tag: string) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
  isFetching: boolean;
}

export function BookmarkGrid({
  bookmarks,
  activeTag,
  onTagClick,
  onClearFilters,
  hasFilters,
  isFetching,
}: BookmarkGridProps) {
  // The staggered entrance is a page-load flourish: play it once for the first
  // set of cards, then keep later card swaps (filters, loading more) instant.
  // Remember the first non-empty batch; only that batch gets the animation.
  const [firstBatch, setFirstBatch] = useState<Bookmark[] | null>(
    bookmarks.length > 0 ? bookmarks : null,
  );
  if (firstBatch === null && bookmarks.length > 0) {
    setFirstBatch(bookmarks);
  }
  const animate =
    bookmarks.length > 0 && bookmarks === (firstBatch ?? bookmarks);

  if (bookmarks.length === 0) {
    return (
      <div className="bg-plate-deep animate-rise-in mt-8 rounded-[var(--radius-plate)] px-6 py-24 text-center shadow-[inset_0_3px_0_var(--color-skirt)] motion-reduce:animate-none">
        <p className="text-primary font-display text-xl font-semibold">
          {hasFilters ? "Nothing matches that" : "The shelf is empty"}
        </p>
        <p className="text-secondary mx-auto mt-3 max-w-sm text-base text-balance">
          {hasFilters
            ? "Try a different search term, or clear the filters to see every link."
            : "Public bookmarks appear here as soon as there is something to show."}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="keycap keycap-mod mt-6 px-4 py-2.5 text-sm font-bold"
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
        "mt-8 grid list-none grid-cols-1 items-start gap-x-5 gap-y-6 sm:grid-cols-2 xl:grid-cols-3",
        // Keep the previous results visible while a filter change loads.
        isFetching && "opacity-60 transition-opacity duration-200",
      )}
    >
      {bookmarks.map((bookmark, index) => (
        <li key={bookmark.id} className="flex">
          <BookmarkCard
            bookmark={bookmark}
            ordinal={index + 1}
            index={index}
            animate={animate}
            activeTag={activeTag}
            onTagClick={onTagClick}
          />
        </li>
      ))}
    </ul>
  );
}
