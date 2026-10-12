import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import type { TagWithCount } from "webmarks/api";

interface TagFilterRowProps {
  tags: TagWithCount[];
  activeTag: string;
  onSelect: (tag: string) => void;
}

/** Fade width on an edge that has more tags past it. */
const FADE = "3rem";

export function TagFilterRow({ tags, activeTag, onSelect }: TagFilterRowProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const update = () => {
      const max = list.scrollWidth - list.clientWidth;
      // 1px slack for fractional scroll positions.
      setCanScroll({
        left: list.scrollLeft > 1,
        right: list.scrollLeft < max - 1,
      });
    };

    update();
    list.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => {
      list.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [tags]);

  if (tags.length === 0) {
    return null;
  }

  const scrollBy = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    list.scrollBy({
      left: direction * list.clientWidth * 0.7,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const mask = `linear-gradient(to right, ${
    canScroll.left ? `transparent, black ${FADE}` : "black"
  }, ${canScroll.right ? `black calc(100% - ${FADE}), transparent` : "black"})`;

  return (
    <div className="relative min-w-0">
      <ul
        ref={listRef}
        aria-label="Filter by tag"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className="-mx-1 flex snap-x [scrollbar-width:none] gap-x-2 overflow-x-auto px-1 pt-1 pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {tags.map((tag) => {
          const active = tag.name === activeTag;

          return (
            <li key={tag.id} className="shrink-0 snap-start scroll-ml-1">
              <button
                type="button"
                // Clicking the active tag clears the filter.
                onClick={() => onSelect(active ? "" : tag.name)}
                aria-pressed={active}
                className="keycap keycap-plain keycap-light gap-x-1.5 px-3 pt-1 pb-1.5 text-sm font-bold whitespace-nowrap [--radius-key:0.5rem] [--travel:3px]"
              >
                {tag.name}
                <span className="font-mono text-[0.6875rem] tabular-nums opacity-75">
                  {tag.bookmarkCount}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <ScrollButton
        side="left"
        visible={canScroll.left}
        onClick={() => scrollBy(-1)}
      />
      <ScrollButton
        side="right"
        visible={canScroll.right}
        onClick={() => scrollBy(1)}
      />
    </div>
  );
}

interface ScrollButtonProps {
  side: "left" | "right";
  visible: boolean;
  onClick: () => void;
}

function ScrollButton({ side, visible, onClick }: ScrollButtonProps) {
  if (!visible) {
    return null;
  }

  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Scroll tags left" : "Scroll tags right"}
      className={clsx(
        "bg-key text-primary absolute top-[calc(50%-0.25rem)] z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full shadow-[inset_0_1px_0_var(--key-highlight),0_2px_0_var(--color-skirt),0_6px_12px_-6px_var(--key-cast)] transition-transform hover:scale-105 focus-visible:outline-3 focus-visible:outline-[var(--color-accent)] active:scale-95 motion-reduce:transition-none",
        side === "left" ? "left-0" : "right-0",
      )}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
