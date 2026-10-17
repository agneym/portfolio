import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Lemon } from "components/shared/Lemon";
import { PageHero } from "components/shared/PageHero";
import { PageShell } from "components/shared/PageShell";
import { SectionBar } from "components/shared/SectionBar";
import {
  BookmarkGrid,
  LoadMore,
  SearchField,
  TagFilterRow,
} from "components/Webmarks";
import {
  DEFAULT_LIST_PARAMS,
  bookmarksQuery,
  normalizeListParams,
  tagsQuery,
  toSearchParams,
  totalQuery,
  type ListParams,
  type WebmarksSearch,
} from "webmarks/api";

/**
 * Keep only params that differ from the defaults. TanStack Start rebuilds the
 * URL from this on the server and redirects when the two disagree, and a clean
 * `/webmarks` beats `/webmarks?q=&tag=`. Unknown keys never reach
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
      context.queryClient.ensureQueryData(totalQuery()),
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
  const { data: overall } = useQuery(totalQuery());

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
    <PageShell>
      <PageHero
        title="Webmarks"
        tagline={
          <>
            Bookmarks I keep <Lemon>coming back to</Lemon>
          </>
        }
        meta={`${overall?.total ?? 0} links`}
        subscribeTag="webmarks"
      />

      <SectionBar
        heading="All links"
        status={
          hasFilters ? (
            <>
              Showing{" "}
              <span className="text-primary tabular font-bold">{total}</span>{" "}
              that match
            </>
          ) : null
        }
      >
        {total === 0 && !hasFilters ? null : (
          <>
            <TagFilterRow
              tags={tags}
              activeTag={params.tag}
              onSelect={(tag) => setParams({ tag })}
            />
            {hasFilters ? (
              <button
                type="button"
                onClick={() => setParams({ q: "", tag: "" })}
                className="text-primary decoration-mod shrink-0 rounded text-sm font-bold underline decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)]"
              >
                Reset
              </button>
            ) : null}
            <SearchField value={params.q} onChange={(q) => setParams({ q })} />
          </>
        )}
      </SectionBar>

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
    </PageShell>
  );
}
