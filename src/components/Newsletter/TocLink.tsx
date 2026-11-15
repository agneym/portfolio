import { scrollToHeading } from "./scrollToHeading";
import type { TocEntry } from "./tocTypes";

export function TocLink({
  entry,
  active,
}: {
  entry: TocEntry;
  active: boolean;
}) {
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
