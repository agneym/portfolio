import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TagWithCount } from "webmarks/api";

interface TagFilterRowProps {
  tags: TagWithCount[];
  activeTag: string;
  onSelect: (tag: string) => void;
}

const arrowClass =
  "keycap keycap-plain keycap-light h-8 w-8 shrink-0 [--radius-key:0.5rem] [--travel:3px]";

export function TagFilterRow({ tags, activeTag, onSelect }: TagFilterRowProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const update = () => {
      setCanScrollLeft(list.scrollLeft > 1);
      setCanScrollRight(
        list.scrollLeft + list.clientWidth < list.scrollWidth - 1,
      );
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
    return <div className="min-w-0 flex-1" />;
  }

  const scrollByPage = (direction: -1 | 1) => {
    const list = listRef.current;
    list?.scrollBy({
      left: direction * list.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex min-w-0 flex-1 items-center gap-x-2">
      {canScrollLeft || canScrollRight ? (
        <button
          type="button"
          aria-label="Scroll tags left"
          disabled={!canScrollLeft}
          onClick={() => scrollByPage(-1)}
          className={arrowClass}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
      <ul
        ref={listRef}
        className="flex min-w-0 [scrollbar-width:none] gap-x-2 overflow-x-auto px-1 pt-1 pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {tags.map((tag) => {
          const active = tag.name === activeTag;

          return (
            <li key={tag.id}>
              <button
                type="button"
                // Clicking the active tag clears the filter.
                onClick={() => onSelect(active ? "" : tag.name)}
                aria-pressed={active}
                className="keycap keycap-plain keycap-light shrink-0 gap-x-1.5 px-3 pt-1 pb-1.5 text-sm font-bold whitespace-nowrap [--radius-key:0.5rem] [--travel:3px]"
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
      {canScrollLeft || canScrollRight ? (
        <button
          type="button"
          aria-label="Scroll tags right"
          disabled={!canScrollRight}
          onClick={() => scrollByPage(1)}
          className={arrowClass}
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
