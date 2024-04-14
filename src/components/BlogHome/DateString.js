"use client";

import { getFormattedDate } from "./getFormattedDate";

export function DateString({ children, className }) {
  return (
    <time dateTime={children} className={className} suppressHydrationWarning>
      <span>Updated on: </span>
      <span className="font-semibold">{getFormattedDate(children)}</span>
    </time>
  );
}
