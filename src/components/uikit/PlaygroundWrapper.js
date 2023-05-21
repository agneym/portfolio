"use client";

import Playground from "@agney/playground";
import { useTheme } from "next-themes";

export function PlaygroundWrapper(props) {
  const { theme } = useTheme();
  return (
    <div className="not-prose font-mono text-sm">
      <Playground {...props} mode={theme === "dark" ? "dark" : "light"} />
    </div>
  );
}
