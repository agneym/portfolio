import { useEffect, useRef, useState } from "react";

interface TocEntry {
  depth: number;
  title: string;
  id: string;
}

/** Distance from the viewport top at which a heading counts as "current". */
const ACTIVE_OFFSET = 120;

/** Gap kept between the viewport top (under the site header) and the heading. */
const SCROLL_OFFSET = 104;

function getScroller(el: HTMLElement) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (
      /(auto|scroll)/.test(overflowY) &&
      node.scrollHeight > node.clientHeight
    )
      return node;
  }
  return document.scrollingElement as HTMLElement;
}

let cancelScroll: (() => void) | undefined;

/** Eased scroll; duration grows with distance. Cancelled by user input. */
function scrollToHeading(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  cancelScroll?.();

  const scroller = getScroller(target);
  const from = scroller.scrollTop;
  const to = Math.max(
    0,
    from +
      target.getBoundingClientRect().top -
      (scroller === document.scrollingElement
        ? 0
        : scroller.getBoundingClientRect().top) -
      SCROLL_OFFSET,
  );
  history.replaceState(null, "", `#${id}`);

  const distance = to - from;
  if (
    Math.abs(distance) < 2 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    scroller.scrollTop = to;
    return;
  }

  const duration = Math.min(1100, Math.max(450, Math.abs(distance) * 0.35));
  const start = performance.now();
  let frame = 0;
  const stop = () => {
    cancelAnimationFrame(frame);
    scroller.removeEventListener("wheel", stop);
    scroller.removeEventListener("touchstart", stop);
    scroller.removeEventListener("keydown", stop);
    cancelScroll = undefined;
  };
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
    scroller.scrollTop = from + distance * eased;
    if (t < 1) frame = requestAnimationFrame(step);
    else stop();
  };
  scroller.addEventListener("wheel", stop, { passive: true });
  scroller.addEventListener("touchstart", stop, { passive: true });
  scroller.addEventListener("keydown", stop);
  cancelScroll = stop;
  frame = requestAnimationFrame(step);
}

function useActiveHeading(ids: readonly string[]) {
  const [active, setActive] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) current = id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    // The page scrolls inside a layout wrapper, not the window. Scroll events
    // don't bubble, so listen in the capture phase to catch any scroller.
    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}

function TocLink({ entry, active }: { entry: TocEntry; active: boolean }) {
  // The sidebar lives inside `.prose-ui`, whose `a:hover` adds a lemon
  // background and underline, so the inline style resets those. The active row
  // gets an accent tint and a bar on the rail (inside the list's clip area).
  // Font weight stays constant so items don't reflow.
  return (
    <a
      href={`#${entry.id}`}
      onClick={(event) => {
        event.preventDefault();
        scrollToHeading(entry.id);
      }}
      aria-current={active ? "location" : undefined}
      style={{
        textDecoration: "none",
        backgroundColor: active
          ? "color-mix(in oklab, var(--color-accent) 16%, transparent)"
          : "transparent",
      }}
      className={`-ml-2 block rounded-md py-0.5 pl-2 transition-colors before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:rounded-full ${
        active
          ? "text-primary before:bg-[var(--color-accent)]"
          : "text-secondary hover:text-primary"
      }`}
    >
      {entry.title}
    </a>
  );
}

export function IssueToc({ toc }: { toc: readonly TocEntry[] }) {
  const entries = toc.filter((entry) => entry.depth <= 3);
  const ids = entries.map((entry) => entry.id);
  const active = useActiveHeading(ids);
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the active item visible inside the scrollable sidebar, clear of
  // the pinned section heading.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !link) return;
    const PINNED = 40;
    const offset =
      link.getBoundingClientRect().top - list.getBoundingClientRect().top;
    if (offset < PINNED || offset + link.offsetHeight > list.clientHeight) {
      list.scrollBy({
        top: offset - list.clientHeight / 3,
        behavior: "smooth",
      });
    }
  }, [active]);

  // Group each ## heading with the entries under it.
  const groups: { head?: TocEntry; items: TocEntry[] }[] = [];
  for (const entry of entries) {
    if (entry.depth === 2) groups.push({ head: entry, items: [] });
    else if (groups.length === 0) groups.push({ items: [entry] });
    else groups[groups.length - 1]!.items.push(entry);
  }

  if (entries.length < 3) return null;

  return (
    <>
      {/* Small screens: collapsible list above the article. */}
      <nav aria-label="In this issue" className="not-prose mb-10 xl:hidden">
        <details>
          <summary className="text-secondary cursor-pointer text-sm font-bold">
            In this issue
          </summary>
          <ul className="mt-3 flex flex-col gap-y-1.5 text-base">
            {entries.map((entry) => (
              <li key={entry.id} className={entry.depth === 3 ? "pl-4" : ""}>
                <TocLink entry={entry} active={false} />
              </li>
            ))}
          </ul>
        </details>
      </nav>

      {/* Wide screens: sticky sidebar to the right of the content. */}
      <nav
        aria-label="In this issue"
        className="not-prose hidden self-start xl:sticky xl:top-20 xl:col-start-3! xl:row-span-200 xl:row-start-2 xl:ml-10 xl:block xl:max-w-64"
      >
        <ul
          ref={listRef}
          className="relative flex max-h-[calc(100vh-7rem)] flex-col gap-y-3 overflow-y-auto border-l-2 border-current/10 pr-2 text-sm"
        >
          {groups.map((group, i) => (
            <li key={group.head?.id ?? i}>
              {group.head ? (
                <div className="bg-surface sticky top-0 z-10 py-1 pl-3">
                  <TocLink
                    entry={group.head}
                    active={group.head.id === active}
                  />
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
    </>
  );
}
