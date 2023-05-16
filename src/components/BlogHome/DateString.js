"use client";

import { getFormattedDate } from "./getFormattedDate";

export function DateString({ children, className }) {
  return (
    <time dateTime={children} className={className} suppressHydrationWarning>
      Updated on: {getFormattedDate(children)}
    </time>
  );
}
