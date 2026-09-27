import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "components/HomePage";
import { SkipNavContent } from "components/uikit/SkipNav";
import {
  BookmarkGrid,
  Pagination,
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
  totalPages,
  type ListParams,
  type WebmarksSearch,
} from "webmarks/api";

/**
 * Keep only params that differ from the defaults. TanStack Start rebuilds the
 * URL from this on the server and redirects when the two disagree, and a clean
 * `/webmarks` beats `/webmarks?q=&tag=&sort=newest&page=1`.
 */
const parseSearch = (search: Record<string, unknown>): WebmarksSearch =>
  toSearchParams(normalizeListParams(search));

export const Route = createFileRoute("/webmarks/")({
  validateSearch: parseSearch,
  loaderDeps: ({ search }) => normalizeListParams(search),
  loader: async ({ context, deps }) => {
    const list = await context.queryClient.ensureQueryData(
      bookmarksQuery(deps),
    );
    await context.queryClient.ensureQueryData(tagsQuery());

    // A stale page number in a shared link should not dead-end on an empty list.
    const pages = totalPages(list.total);
    if (deps.page > pages) {
      throw redirect({
        to: "/webmarks",
        search: toSearchParams({ ...deps, page: pages }),
        replace: true,
      });
    }
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
  const { data: list, isFetching } = useQuery(bookmarksQuery(params));
  const { data: tagData } = useQuery(tagsQuery());

  const tags = tagData?.tags ?? [];
  const bookmarks = list?.bookmarks ?? [];
  const total = list?.total ?? 0;
  const offset = list?.offset ?? 0;
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
        <header className="pt-12 pb-8 sm:pt-20">
          <h1 className="font-heading text-primary text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Webmarks
          </h1>
          <p
            aria-live="polite"
            className="text-tertiary mt-6 font-mono text-[0.6875rem] tracking-widest uppercase"
          >
            {total} {total === 1 ? "link" : "links"}
            {tags.length > 0 ? ` · ${tags.length} tags` : ""}
            {hasFilters ? " · filtered" : ""}
          </p>
        </header>

        {total === 0 && !hasFilters ? null : (
          <section
            aria-label="Filters"
            className="border-muted bg-surface/90 sticky top-12 z-20 -mx-4 flex flex-col gap-y-4 border-y px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <SearchField
                value={params.q}
                onChange={(q) => setParams({ q, page: 1 })}
              />
              <SortSelect
                value={params.sort}
                onChange={(sort) => setParams({ sort, page: 1 })}
              />
              {hasFilters ? (
                <button
                  type="button"
                  onClick={() => setParams({ q: "", tag: "", page: 1 })}
                  className="text-tertiary hover:text-primary focus-visible:ring-accent rounded text-xs underline decoration-dotted underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  Reset
                </button>
              ) : null}
            </div>
            <TagFilterRow
              tags={tags}
              activeTag={params.tag}
              onSelect={(tag) => setParams({ tag, page: 1 })}
            />
          </section>
        )}

        <BookmarkGrid
          bookmarks={bookmarks}
          offset={offset}
          activeTag={params.tag}
          onTagClick={(tag) => setParams({ tag, page: 1 })}
          onClearFilters={() => setParams({ q: "", tag: "", page: 1 })}
          hasFilters={hasFilters}
          isFetching={isFetching}
        />

        <Pagination params={params} total={total} />
      </div>
      <div className="pb-16">
        <Footer />
      </div>
    </>
  );
}
