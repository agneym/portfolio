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
    <ul className="-mx-1 flex [scrollbar-width:none] gap-x-2 overflow-x-auto [mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent)] px-1 pt-1 pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
  );
}
