import { TocLink } from "./TocLink";
import type { TocEntry } from "./tocTypes";

/** Small screens: collapsible list above the article. */
export function MobileToc({ entries }: { entries: readonly TocEntry[] }) {
  return (
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
  );
}
