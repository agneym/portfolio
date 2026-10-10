import { createServerFn } from "@tanstack/react-start";
import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
} from "@tanstack/react-query";

export const PAGE_SIZE = 24;

export const SORT_ORDERS = [
  "newest",
  "oldest",
  "title",
  "title_desc",
  "updated",
] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

export const SORT_LABELS: Record<SortOrder, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  title: "Title A–Z",
  title_desc: "Title Z–A",
  updated: "Recently updated",
};

export type FetchStatus = "pending" | "success" | "failed";

export interface Bookmark {
  id: string;
  url: string;
  userId: string;
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
  fetchStatus: FetchStatus | null;
  visibility: "public" | "private";
  tags: { id: string; name: string }[];
}

/** One page of the cursor-paginated `GET /api/bookmarks` response. */
export interface BookmarkList {
  bookmarks: Bookmark[];
  /** Every bookmark matching the filters, not just this page. */
  total: number;
  limit: number;
  /** Pass back as `cursor` for the next page; null on the last page. */
  nextCursor: string | null;
  hasMore: boolean;
}

export interface TagWithCount {
  id: string;
  name: string;
  bookmarkCount: number;
}

/** Filter state shared by the URL and the list query key. */
export interface ListParams {
  q: string;
  tag: string;
  sort: SortOrder;
}

/** Input of the list server function: the filters plus the page cursor. */
export interface ListPageParams extends ListParams {
  cursor: string | null;
}

/**
 * The route's search params. Only values that differ from the defaults are
 * ever present — TanStack Start rebuilds the URL from `validateSearch` on the
 * server and redirects when the two disagree, so materialising defaults here
 * would send every bare `/webmarks` request through a 307.
 */
export interface WebmarksSearch {
  q?: string;
  tag?: string;
  sort?: SortOrder;
}

export const DEFAULT_LIST_PARAMS: ListParams = {
  q: "",
  tag: "",
  sort: "newest",
};

/** Matches the backend's own cap; anything longer is not a cursor it issued. */
const MAX_CURSOR_LENGTH = 1024;

/** Coerce anything (URL search or a server function input) into valid params. */
export function normalizeListParams(input: unknown): ListParams {
  const raw =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  return {
    q: typeof raw.q === "string" ? raw.q.slice(0, 128) : "",
    tag: typeof raw.tag === "string" ? raw.tag.slice(0, 64) : "",
    sort: SORT_ORDERS.includes(raw.sort as SortOrder)
      ? (raw.sort as SortOrder)
      : "newest",
  };
}

/** Coerce a server function input into filters plus an optional cursor. */
function normalizeListPageParams(input: unknown): ListPageParams {
  const cursor =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>).cursor
      : undefined;

  return {
    ...normalizeListParams(input),
    cursor:
      typeof cursor === "string" &&
      cursor.length > 0 &&
      cursor.length <= MAX_CURSOR_LENGTH
        ? cursor
        : null,
  };
}

/** The inverse: drop every value that matches a default, for a clean URL. */
export function toSearchParams(params: ListParams): WebmarksSearch {
  const search: WebmarksSearch = {};

  if (params.q) {
    search.q = params.q;
  }
  if (params.tag) {
    search.tag = params.tag;
  }
  if (params.sort !== DEFAULT_LIST_PARAMS.sort) {
    search.sort = params.sort;
  }

  return search;
}

/**
 * Backend origin. The browser never talks to this directly — every request
 * goes through the server functions below, so the API's CORS allowlist
 * (a single `WEB_APP_URL` origin) never comes into play.
 */
const DEFAULT_API_ORIGIN = "https://backend.quickread.workers.dev";

/** Server-only; called from server function handlers. */
async function request<T>(path: string, params?: URLSearchParams): Promise<T> {
  const origin = process.env.WEBMARKS_API_ORIGIN?.trim() || DEFAULT_API_ORIGIN;
  const url = new URL(path, origin);
  if (params) {
    url.search = params.toString();
  }

  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Webmarks API ${response.status} for ${url.pathname}`);
  }

  return (await response.json()) as T;
}

/**
 * Server functions are public endpoints, so their input is coerced by the same
 * normaliser the route uses rather than trusted from the caller.
 */
export const listBookmarks = createServerFn({ method: "GET" })
  .validator(normalizeListPageParams)
  .handler(async ({ data }): Promise<BookmarkList> => {
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      sort: data.sort,
    });
    // A cursor is bound to the sort it was issued under; the query key below
    // includes the sort, so a cursor only ever travels with its own sort.
    if (data.cursor) {
      params.set("cursor", data.cursor);
    }
    if (data.q) {
      params.set("q", data.q);
    }
    if (data.tag) {
      params.set("tag", data.tag);
    }

    return request<BookmarkList>("/api/bookmarks", params);
  });

export const listTags = createServerFn({ method: "GET" }).handler(
  (): Promise<{ tags: TagWithCount[] }> =>
    request<{ tags: TagWithCount[] }>("/api/tags"),
);

/**
 * Cursor-paginated list. The filters are the key, so changing any of them
 * starts a fresh list from the first page; each further page is fetched with
 * the previous page's `nextCursor`.
 */
export const bookmarksQuery = (params: ListParams) =>
  infiniteQueryOptions({
    queryKey: ["webmarks", "bookmarks", params] as const,
    queryFn: ({ pageParam }) =>
      listBookmarks({ data: { ...params, cursor: pageParam } }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.nextCursor ? lastPage.nextCursor : undefined,
    placeholderData: keepPreviousData,
  });

export const tagsQuery = () =>
  queryOptions({
    queryKey: ["webmarks", "tags"] as const,
    queryFn: () => listTags(),
  });

/** Hostname without the `www.` prefix, for display. */
export const displayDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
