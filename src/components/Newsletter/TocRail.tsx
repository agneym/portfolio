import { useId } from "react";
import { RAIL_WIDTH, type Rail } from "./useTocRail";

/**
 * SVG rail down the left of the sidebar. The accent copy of the path is only
 * visible through a clip rect that slides to the active row.
 */
export function TocRail({
  rail,
  active,
}: {
  rail: Rail;
  active: string | undefined;
}) {
  const clipId = `toc-clip-${useId().replace(/:/g, "")}`;
  const span = active ? rail.spans[active] : undefined;

  return (
    <svg
      aria-hidden
      width={RAIL_WIDTH}
      height={rail.height}
      className="pointer-events-none absolute top-0 left-0 z-20"
    >
      <defs>
        <clipPath id={clipId}>
          {/* A unit-height rect, moved and stretched over the active row. */}
          <rect
            x={0}
            y={0}
            width={RAIL_WIDTH}
            height={1}
            className="transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{
              transform: span
                ? `translateY(${span.top}px) scaleY(${span.bottom - span.top})`
                : "scaleY(0)",
            }}
          />
        </clipPath>
      </defs>
      <path
        d={rail.path}
        fill="none"
        strokeWidth={2}
        strokeLinejoin="round"
        className="stroke-current/10"
      />
      <path
        d={rail.path}
        fill="none"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="var(--color-accent)"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}
