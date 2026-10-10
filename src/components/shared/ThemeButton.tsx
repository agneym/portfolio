import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useHydrated } from "./useHydrated";

export const ThemeButton = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHydrated();
  const reduceMotion = useReducedMotion();

  const isLightTheme = resolvedTheme !== "dark";
  const Icon = isLightTheme ? Moon : Sun;
  const label = isLightTheme ? "Dark Mode" : "Light Mode";

  return (
    <button
      type="button"
      className="keycap keycap-mod size-10 overflow-hidden [--travel:3px]"
      onClick={() => setTheme(isLightTheme ? "dark" : "light")}
      aria-label={mounted ? label : "Toggle theme"}
      title={mounted ? `${label} (t)` : undefined}
      aria-keyshortcuts="t"
      suppressHydrationWarning
    >
      {mounted ? (
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={resolvedTheme}
            initial={reduceMotion ? false : { y: 18, rotate: -40, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { y: -18, rotate: 40, opacity: 0 }
            }
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="inline-flex"
          >
            <Icon aria-hidden className="size-5" />
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="size-5" />
      )}
    </button>
  );
};
