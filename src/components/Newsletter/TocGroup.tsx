import { TocLink } from "./TocLink";
import type { TocEntry } from "./tocTypes";

/** One ## section: a pinned heading followed by the entries beneath it. */
export function TocGroup({
  head,
  items,
  active,
}: {
  head: TocEntry | undefined;
  items: readonly TocEntry[];
  active: string | undefined;
}) {
  return (
    <li>
      {head ? (
        <div
          data-toc-row={head.id}
          data-toc-head
          className="bg-surface sticky top-0 z-10 py-1 pl-3"
        >
          <TocLink entry={head} active={head.id === active} />
        </div>
      ) : null}
      <ul className="flex flex-col gap-y-1.5 pt-1">
        {items.map((entry) => (
          <li key={entry.id} data-toc-row={entry.id} className="pl-7">
            <TocLink entry={entry} active={entry.id === active} />
          </li>
        ))}
      </ul>
    </li>
  );
}
