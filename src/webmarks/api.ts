import { createServerFn } from "@tanstack/react-start";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

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

export interface BookmarkList {
  bookmarks: Bookmark[];
  total: number;
  limit: number;
  offset: number;
}

export interface TagWithCount {
  id: string;
  name: string;
  bookmarkCount: number;
}

/** Page state, also the input shape of the list server function. */
export interface ListParams {
  q: string;
  tag: string;
  sort: SortOrder;
  page: number;
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
  page?: number;
}

export const DEFAULT_LIST_PARAMS: ListParams = {
  q: "",
  tag: "",
  sort: "newest",
  page: 1,
};

/** Upper bound on the page number, so offsets stay sane. */
const MAX_PAGE = 500;

/** Coerce anything (URL search or a server function input) into valid params. */
export function normalizeListParams(input: unknown): ListParams {
  const raw =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};
  const page = Number(raw.page);

  return {
    q: typeof raw.q === "string" ? raw.q.slice(0, 128) : "",
    tag: typeof raw.tag === "string" ? raw.tag.slice(0, 64) : "",
    sort: SORT_ORDERS.includes(raw.sort as SortOrder)
      ? (raw.sort as SortOrder)
      : "newest",
    page: Number.isFinite(page)
      ? Math.min(Math.max(Math.trunc(page), 1), MAX_PAGE)
      : 1,
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
  if (params.page !== DEFAULT_LIST_PARAMS.page) {
    search.page = params.page;
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
  .validator(normalizeListParams)
  .handler(async ({ data }): Promise<BookmarkList> => {
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String((data.page - 1) * PAGE_SIZE),
      sort: data.sort,
    });
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

export const bookmarksQuery = (params: ListParams) =>
  queryOptions({
    queryKey: ["webmarks", "bookmarks", params] as const,
    queryFn: () => listBookmarks({ data: params }),
    placeholderData: keepPreviousData,
  });

export const tagsQuery = () =>
  queryOptions({
    queryKey: ["webmarks", "tags"] as const,
    queryFn: () => listTags(),
  });

export const totalPages = (total: number) =>
  Math.max(1, Math.ceil(total / PAGE_SIZE));

/** Hostname without the `www.` prefix, for display. */
export const displayDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
