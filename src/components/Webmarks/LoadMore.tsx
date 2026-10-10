import { ChevronDown, LoaderCircle } from "lucide-react";

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
      className="border-muted mt-10 flex items-center justify-between border-t pt-6"
    >
      <p
        aria-live="polite"
        className="text-tertiary font-mono text-[0.6875rem] tracking-widest uppercase"
      >
        {isError ? "Couldn't load more · " : ""}
        Showing {pad(shown)} / {pad(total)}
      </p>
      {hasMore ? (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoading}
          aria-busy={isLoading}
          className="border-muted text-secondary hover:border-tertiary hover:text-primary focus-visible:ring-accent inline-flex items-center gap-x-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
        >
          {isLoading ? (
            <LoaderCircle
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none"
            />
          ) : (
            <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {isLoading ? "Loading" : isError ? "Try again" : "Load more"}
        </button>
      ) : null}
    </nav>
  );
}
