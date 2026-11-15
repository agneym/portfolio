import { useEffect, useId, useRef } from "react";
import { TocLink } from "./TocLink";
import { RAIL_WIDTH, useTocRail } from "./useTocRail";
import type { TocEntry } from "./tocTypes";

/** Height of the pinned section heading the active item must stay clear of. */
const PINNED = 40;

/** Groups each ## heading with the entries under it. */
function groupEntries(entries: readonly TocEntry[]) {
  const groups: { head?: TocEntry; items: TocEntry[] }[] = [];
  for (const entry of entries) {
    if (entry.depth === 2) groups.push({ head: entry, items: [] });
    else if (groups.length === 0) groups.push({ items: [entry] });
    else groups[groups.length - 1]!.items.push(entry);
  }
  return groups;
}

/** Keeps the active item visible inside the scrollable sidebar. */
function useKeepActiveVisible(active: string | undefined) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !link) return;
    const offset =
      link.getBoundingClientRect().top - list.getBoundingClientRect().top;
    if (offset < PINNED || offset + link.offsetHeight > list.clientHeight) {
      list.scrollBy({
        top: offset - list.clientHeight / 3,
        behavior: "smooth",
      });
    }
  }, [active]);

  return listRef;
}

/** Wide screens: sticky sidebar to the right of the content. */
export function SidebarToc({
  entries,
  active,
}: {
  entries: readonly TocEntry[];
  active: string | undefined;
}) {
  const listRef = useKeepActiveVisible(active);
  const rail = useTocRail(listRef, entries);
  const span = active ? rail?.spans[active] : undefined;
  const clipId = `toc-clip-${useId().replace(/:/g, "")}`;

  return (
    <nav
      aria-label="In this issue"
      className="not-prose hidden self-start xl:sticky xl:top-20 xl:col-start-3! xl:row-span-200 xl:row-start-2 xl:ml-10 xl:block xl:max-w-64"
    >
      <ul
        ref={listRef}
        className="relative flex max-h-[calc(100vh-7rem)] flex-col gap-y-3 overflow-y-auto pr-2 text-sm"
      >
        {rail ? (
          <svg
            aria-hidden
            width={RAIL_WIDTH}
            height={rail.height}
            className="pointer-events-none absolute top-0 left-0 z-20"
          >
            <defs>
              <clipPath id={clipId}>
                {/* A unit-height rect, moved and stretched over the active row. */}
                <rect
                  x={0}
                  y={0}
                  width={RAIL_WIDTH}
                  height={1}
                  className="transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    transform: span
                      ? `translateY(${span.top}px) scaleY(${span.bottom - span.top})`
                      : "scaleY(0)",
                  }}
                />
              </clipPath>
            </defs>
            <path
              d={rail.path}
              fill="none"
              strokeWidth={2}
              strokeLinejoin="round"
              className="stroke-current/10"
            />
            {/* The accent copy of the rail only shows through the sliding clip. */}
            <path
              d={rail.path}
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="var(--color-accent)"
              clipPath={`url(#${clipId})`}
            />
          </svg>
        ) : null}
        {groupEntries(entries).map((group, i) => (
          <li key={group.head?.id ?? i}>
            {group.head ? (
              <div
                data-toc-row={group.head.id}
                data-toc-head
                className="bg-surface sticky top-0 z-10 py-1 pl-3"
              >
                <TocLink entry={group.head} active={group.head.id === active} />
              </div>
            ) : null}
            <ul className="flex flex-col gap-y-1.5 pt-1">
              {group.items.map((entry) => (
                <li key={entry.id} data-toc-row={entry.id} className="pl-7">
                  <TocLink entry={entry} active={entry.id === active} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
