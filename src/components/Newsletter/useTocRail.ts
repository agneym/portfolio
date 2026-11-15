import { useLayoutEffect, useState, type RefObject } from "react";
import type { TocEntry } from "./tocTypes";

/** Rail x position for each depth, and the width the SVG needs. */
const X: Record<number, number> = { 2: 1, 3: 13 };
export const RAIL_WIDTH = 16;

interface Span {
  top: number;
  bottom: number;
}

export interface Rail {
  path: string;
  height: number;
  spans: Record<string, Span>;
}

/** Measures each row inside the list and builds one SVG path through them. */
export function useTocRail(
  listRef: RefObject<HTMLUListElement | null>,
  entries: readonly TocEntry[],
) {
  const [rail, setRail] = useState<Rail>();

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const spans: Record<string, Span> = {};
      let path = "";
      let prev: { x: number; bottom: number } | undefined;

      for (const entry of entries) {
        const row = list.querySelector<HTMLElement>(
          `[data-toc-row="${entry.id}"]`,
        );
        if (!row) continue;
        // Section headings are sticky, so measure their (static) parent <li>
        // for position; offsetTop is relative to the list, which is positioned.
        const top = (row.dataset.tocHead ? row.parentElement! : row).offsetTop;
        const bottom = top + row.offsetHeight;
        const x = X[entry.depth] ?? X[3]!;
        spans[entry.id] = { top, bottom };
        if (!prev) path = `M${x} ${top}`;
        else if (prev.x !== x)
          path += ` L${prev.x} ${prev.bottom} L${x} ${top}`;
        else path += ` L${x} ${top}`;
        path += ` L${x} ${bottom}`;
        prev = { x, bottom };
      }
      setRail({ path, height: list.scrollHeight, spans });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [listRef, entries]);

  return rail;
}
