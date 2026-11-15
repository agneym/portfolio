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
  // background and underline, so the inline style resets those. The moving
  // highlight is the rail in SidebarToc; here only the text colour changes
  // (font weight stays constant so items don't reflow).
  return (
    <a
      href={`#${entry.id}`}
      onClick={(event) => {
        event.preventDefault();
        scrollToHeading(entry.id);
      }}
      aria-current={active ? "location" : undefined}
      style={{ textDecoration: "none", backgroundColor: "transparent" }}
      className={`block py-0.5 transition-colors duration-300 ${
        active ? "text-primary" : "text-secondary hover:text-primary"
      }`}
    >
      {entry.title}
    </a>
  );
}
