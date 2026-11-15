import { MobileToc } from "./MobileToc";
import { SidebarToc } from "./SidebarToc";
import type { TocEntry } from "./tocTypes";
import { useActiveHeading } from "./useActiveHeading";

export function IssueToc({ toc }: { toc: readonly TocEntry[] }) {
  const entries = toc.filter((entry) => entry.depth <= 3);
  const active = useActiveHeading(entries.map((entry) => entry.id));

  if (entries.length < 3) return null;

  return (
    <>
      <MobileToc entries={entries} />
      <SidebarToc entries={entries} active={active} />
    </>
  );
}
