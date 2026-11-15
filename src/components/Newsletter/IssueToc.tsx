import { useMemo } from "react";
import { MobileToc } from "./MobileToc";
import { SidebarToc } from "./SidebarToc";
import type { TocEntry } from "./tocTypes";
import { useActiveHeading } from "./useActiveHeading";

export function IssueToc({ toc }: { toc: readonly TocEntry[] }) {
  const entries = useMemo(() => toc.filter((entry) => entry.depth <= 3), [toc]);
  const ids = useMemo(() => entries.map((entry) => entry.id), [entries]);
  const active = useActiveHeading(ids);

  if (entries.length < 3) return null;

  return (
    <>
      <MobileToc entries={entries} />
      <SidebarToc entries={entries} active={active} />
    </>
  );
}
