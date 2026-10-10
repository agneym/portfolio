import { CornerDownLeft, LoaderCircle } from "lucide-react";

interface LoadMoreProps {
  /** Cards on screen so far. */
  shown: number;
  /** Every bookmark matching the current filters. */
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  isError: boolean;
  onLoadMore: () => void;
}

export function LoadMore({
  shown,
  total,
  hasMore,
  isLoading,
  isError,
  onLoadMore,
}: LoadMoreProps) {
  if (shown === 0 || (!hasMore && shown >= total)) {
    return null;
  }

  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <nav
      aria-label="More bookmarks"
      className="mt-12 flex flex-wrap items-center justify-between gap-4"
    >
      <p aria-live="polite" className="text-secondary tabular text-base">
        {isError ? "Couldn't load more. " : ""}
        Showing <span className="text-primary font-bold">
          {pad(shown)}
        </span> of{" "}
        {pad(total)}
      </p>
      {hasMore ? (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoading}
          aria-busy={isLoading}
          className="keycap keycap-mod h-14 min-w-44 justify-between gap-x-6 px-5 text-base font-bold"
        >
          {isLoading ? (
            <LoaderCircle
              aria-hidden="true"
              className="h-5 w-5 animate-spin motion-reduce:animate-none"
            />
          ) : (
            <CornerDownLeft aria-hidden="true" className="h-5 w-5" />
          )}
          {isLoading ? "Loading" : isError ? "Try again" : "Load more"}
        </button>
      ) : null}
    </nav>
  );
}
