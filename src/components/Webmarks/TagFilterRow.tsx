import clsx from "clsx";
import type { TagWithCount } from "webmarks/api";

interface TagFilterRowProps {
  tags: TagWithCount[];
  activeTag: string;
  onSelect: (tag: string) => void;
}

export function TagFilterRow({ tags, activeTag, onSelect }: TagFilterRowProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className="flex [scrollbar-width:none] gap-x-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {tags.map((tag) => {
        const active = tag.name === activeTag;

        return (
          <li key={tag.id}>
            <button
              type="button"
              // Clicking the active tag clears the filter.
              onClick={() => onSelect(active ? "" : tag.name)}
              aria-pressed={active}
              className={clsx(
                "inline-flex shrink-0 items-center gap-x-1.5 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                active
                  ? "border-accent bg-accent text-text-on-accent"
                  : "border-muted text-secondary hover:border-tertiary hover:text-primary",
              )}
            >
              {tag.name}
              <span
                className={clsx(
                  "font-mono text-[0.625rem] tabular-nums",
                  active ? "text-text-on-accent/75" : "text-tertiary",
                )}
              >
                {tag.bookmarkCount}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
