import Playground from "@agney/playground";
import { useEffect, useState, type ComponentProps } from "react";

export default function PlaygroundWrapper(
  props: ComponentProps<typeof Playground>,
) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Listen for theme changes via class mutations
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="not-prose font-mono text-sm">
      <Playground {...props} mode={theme} />
    </div>
  );
}
