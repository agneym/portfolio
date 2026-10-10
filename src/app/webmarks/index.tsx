import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Footer } from "components/HomePage";
import { SkipNavContent } from "components/uikit/SkipNav";
import {
  BookmarkGrid,
  LoadMore,
  SearchField,
  SortSelect,
  TagFilterRow,
} from "components/Webmarks";
import {
  DEFAULT_LIST_PARAMS,
  bookmarksQuery,
  normalizeListParams,
  tagsQuery,
  toSearchParams,
  type ListParams,
  type WebmarksSearch,
} from "webmarks/api";

/**
 * Keep only params that differ from the defaults. TanStack Start rebuilds the
 * URL from this on the server and redirects when the two disagree, and a clean
 * `/webmarks` beats `/webmarks?q=&tag=&sort=newest`. Unknown keys never reach
 * the loader, so an old page-number link (`?page=2`) just shows the first page.
 */
const parseSearch = (search: Record<string, unknown>): WebmarksSearch =>
  toSearchParams(normalizeListParams(search));

export const Route = createFileRoute("/webmarks/")({
  validateSearch: parseSearch,
  loaderDeps: ({ search }) => normalizeListParams(search),
  // Only the first page is loaded here (and rendered on the server); the rest
  // are fetched on demand with the cursor from the page before.
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureInfiniteQueryData(bookmarksQuery(deps)),
      context.queryClient.ensureQueryData(tagsQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Webmarks | Agney" },
      {
        name: "description",
        content: "Bookmarks kept by Agney Menon.",
      },
      { property: "og:title", content: "Webmarks | Agney" },
      {
        property: "og:description",
        content: "Bookmarks kept by Agney Menon.",
      },
    ],
  }),
  component: WebmarksPage,
});

function WebmarksPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const params = normalizeListParams(search);
  const {
    data: list,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(bookmarksQuery(params));
  const { data: tagData } = useQuery(tagsQuery());

  const tags = tagData?.tags ?? [];
  // Memoised so the grid sees the same array until a page actually arrives;
  // its entrance animation is keyed on that identity.
  const bookmarks = useMemo(
    () => list?.pages.flatMap((page) => page.bookmarks) ?? [],
    [list],
  );
  const total = list?.pages[0]?.total ?? 0;
  const hasFilters =
    params.q !== DEFAULT_LIST_PARAMS.q ||
    params.tag !== DEFAULT_LIST_PARAMS.tag;

  const setParams = (patch: Partial<ListParams>) => {
    void navigate({ search: toSearchParams({ ...params, ...patch }) });
  };

  return (
    <>
      <SkipNavContent />
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <header className="pt-14 pb-10 sm:pt-20">
          <h1 className="text-primary text-[clamp(3.25rem,9vw,6rem)] leading-[0.95] font-bold tracking-[-0.03em]">
            Webmarks
          </h1>
          <p
            aria-live="polite"
            className="text-secondary-strong mt-5 text-xl text-pretty"
          >
            {hasFilters ? "Showing " : "Bookmarks I keep coming back to: "}
            <span className="text-primary tabular font-bold">{total}</span>{" "}
            {total === 1 ? "link" : "links"}
            {tags.length > 0 && !hasFilters
              ? `, filed under ${tags.length} tags.`
              : hasFilters
                ? " that match."
                : "."}
          </p>
        </header>

        {total === 0 && !hasFilters ? null : (
          <section
            aria-label="Filters"
            className="bg-surface/90 sticky top-16 z-20 -mx-4 flex flex-col gap-y-3 px-4 pt-3 pb-2 backdrop-blur-md backdrop-saturate-150 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <SearchField
                value={params.q}
                onChange={(q) => setParams({ q })}
              />
              <SortSelect
                value={params.sort}
                onChange={(sort) => setParams({ sort })}
              />
              {hasFilters ? (
                <button
                  type="button"
                  onClick={() => setParams({ q: "", tag: "" })}
                  className="text-primary decoration-mod rounded text-sm font-bold underline decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)]"
                >
                  Reset
                </button>
              ) : null}
            </div>
            <TagFilterRow
              tags={tags}
              activeTag={params.tag}
              onSelect={(tag) => setParams({ tag })}
            />
          </section>
        )}

        <BookmarkGrid
          bookmarks={bookmarks}
          activeTag={params.tag}
          onTagClick={(tag) => setParams({ tag })}
          onClearFilters={() => setParams({ q: "", tag: "" })}
          hasFilters={hasFilters}
          // Dim only for a filter change; appending a page leaves the
          // existing cards alone.
          isFetching={isFetching && !isFetchingNextPage}
        />

        <LoadMore
          shown={bookmarks.length}
          total={total}
          hasMore={hasNextPage}
          isLoading={isFetchingNextPage}
          isError={isFetchNextPageError}
          onLoadMore={() => void fetchNextPage()}
        />
      </div>
      <div className="pb-16">
        <Footer />
      </div>
    </>
  );
}
