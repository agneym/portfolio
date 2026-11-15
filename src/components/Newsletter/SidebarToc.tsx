import { useEffect, useRef } from "react";
import { TocLink } from "./TocLink";
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

  return (
    <nav
      aria-label="In this issue"
      className="not-prose hidden self-start xl:sticky xl:top-20 xl:col-start-3! xl:row-span-200 xl:row-start-2 xl:ml-10 xl:block xl:max-w-64"
    >
      <ul
        ref={listRef}
        className="relative flex max-h-[calc(100vh-7rem)] flex-col gap-y-3 overflow-y-auto border-l-2 border-current/10 pr-2 text-sm"
      >
        {groupEntries(entries).map((group, i) => (
          <li key={group.head?.id ?? i}>
            {group.head ? (
              <div className="bg-surface sticky top-0 z-10 py-1 pl-3">
                <TocLink entry={group.head} active={group.head.id === active} />
              </div>
            ) : null}
            <ul className="flex flex-col gap-y-1.5 pt-1">
              {group.items.map((entry) => (
                <li key={entry.id} className="relative pl-7">
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
