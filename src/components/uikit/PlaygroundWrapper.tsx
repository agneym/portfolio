"use client";

import Playground from "@agney/playground";
import { useTheme } from "next-themes";
import type { ComponentProps } from "react";

export function PlaygroundWrapper(props: ComponentProps<typeof Playground>) {
  const { theme } = useTheme();
  return (
    <div className="not-prose font-mono text-sm">
      <Playground {...props} mode={theme === "dark" ? "dark" : "light"} />
    </div>
  );
}
