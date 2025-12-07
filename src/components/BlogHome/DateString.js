"use client";

import { getFormattedDate } from "./getFormattedDate";

export function DateString({ children, className }) {
  return (
    <time dateTime={children} className={className} suppressHydrationWarning>
      <span className="font-semibold">{getFormattedDate(children)}</span>
    </time>
  );
}
