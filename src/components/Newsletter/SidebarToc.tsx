import { useEffect, useRef } from "react";
import { TocGroup } from "./TocGroup";
import { TocRail } from "./TocRail";
import { useTocRail } from "./useTocRail";
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

  return (
    <nav
      aria-label="In this issue"
      className="not-prose hidden self-start xl:sticky xl:top-20 xl:col-start-3! xl:row-span-200 xl:row-start-2 xl:ml-10 xl:block xl:max-w-64"
    >
      <ul
        ref={listRef}
        className="relative flex max-h-[calc(100vh-7rem)] flex-col gap-y-3 overflow-y-auto pr-2 text-sm"
      >
        {rail ? <TocRail rail={rail} active={active} /> : null}
        {groupEntries(entries).map((group, i) => (
          <TocGroup
            key={group.head?.id ?? i}
            head={group.head}
            items={group.items}
            active={active}
          />
        ))}
      </ul>
    </nav>
  );
}
