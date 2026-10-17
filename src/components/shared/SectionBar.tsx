import type { ReactNode } from "react";

interface SectionBarProps {
  /** Omit when the controls speak for themselves. */
  heading?: ReactNode;
  /** Small live-updating note beside the heading, e.g. a filter result count. */
  status?: ReactNode;
  /** Controls, right-aligned on desktop and below the heading on mobile. */
  children?: ReactNode;
}

/** Sticky bar that titles the list below it and holds its controls. */
export function SectionBar({ heading, status, children }: SectionBarProps) {
  return (
    <div className="bg-surface sticky top-16 z-20 -mx-4 flex min-h-16 flex-col gap-x-6 gap-y-2 px-4 pt-3 pb-2 backdrop-blur-md backdrop-saturate-150 sm:-mx-8 sm:px-8 md:flex-row md:items-center">
      {/* Collapse to screen-reader-only when empty so the controls start at the
          edge, while keeping the same live region mounted. */}
      <div
        className={
          heading || status
            ? "flex shrink-0 flex-wrap items-baseline gap-x-4"
            : "sr-only"
        }
      >
        {heading ? (
          <h2 className="text-secondary-strong text-2xl font-semibold">
            {heading}
          </h2>
        ) : null}
        <p aria-live="polite" className="text-secondary text-sm">
          {status}
        </p>
      </div>
      {children ? (
        <div className="flex min-w-0 flex-1 items-center gap-x-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}
