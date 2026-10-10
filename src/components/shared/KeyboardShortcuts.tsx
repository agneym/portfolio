import { useNavigate } from "@tanstack/react-router";
import { Keyboard, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  KONAMI,
  NAV_SHORTCUTS,
  OPEN_SHEET_EVENT,
  isExternal,
  RGB_EVENT,
  isTypingTarget,
  setShortcutsEnabled,
  shortcutsEnabled,
} from "./shortcuts";

const subscribe = (callback: () => void) => {
  window.addEventListener("clack:shortcuts-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("clack:shortcuts-change", callback);
    window.removeEventListener("storage", callback);
  };
};

function useShortcutsEnabled() {
  return useSyncExternalStore(subscribe, shortcutsEnabled, () => true);
}

/**
 * Global single-key shortcuts plus the shortcut sheet. Single-character
 * shortcuts can be switched off from the sheet (WCAG 2.1.4).
 */
export function KeyboardShortcuts() {
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const enabled = useShortcutsEnabled();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const konamiIndex = useRef(0);
  const [rgb, setRgb] = useState(false);

  // Keep the latest theme in a ref so the listener never re-binds.
  const themeRef = useRef({ resolvedTheme, setTheme });
  useEffect(() => {
    themeRef.current = { resolvedTheme, setTheme };
  });

  useEffect(() => {
    const openSheet = () => dialogRef.current?.showModal();
    window.addEventListener(OPEN_SHEET_EVENT, openSheet);
    return () => window.removeEventListener(OPEN_SHEET_EVENT, openSheet);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return;
      const key = event.key.toLowerCase();

      // Konami code works even with shortcuts off: arrows and b/a only.
      if (!isTypingTarget(event)) {
        if (key === KONAMI[konamiIndex.current]) {
          konamiIndex.current += 1;
          if (konamiIndex.current === KONAMI.length) {
            konamiIndex.current = 0;
            const next = document.documentElement.dataset.rgb !== "on";
            document.documentElement.dataset.rgb = next ? "on" : "off";
            setRgb(next);
            window.dispatchEvent(
              new CustomEvent(RGB_EVENT, { detail: { on: next } }),
            );
            event.preventDefault();
            return;
          }
          // Mid-sequence b belongs to the code, not to navigation.
          if (konamiIndex.current > 8) return;
        } else {
          konamiIndex.current = key === KONAMI[0] ? 1 : 0;
        }
      }

      if (isTypingTarget(event)) return;

      if (event.key === "?") {
        event.preventDefault();
        dialogRef.current?.showModal();
        return;
      }

      if (!shortcutsEnabled()) return;

      const nav = NAV_SHORTCUTS.find((item) => item.key === key);
      if (nav) {
        event.preventDefault();
        if (isExternal(nav)) {
          window.open(nav.href, "_blank", "noopener");
        } else {
          void navigate({ to: nav.href });
        }
        return;
      }

      if (key === "t") {
        event.preventDefault();
        const { resolvedTheme: current, setTheme: set } = themeRef.current;
        set(current === "dark" ? "light" : "dark");
        return;
      }

      if (key === "/") {
        const search = document.querySelector<HTMLInputElement>(
          "[data-shortcut-search]",
        );
        if (search) {
          event.preventDefault();
          search.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="shortcut-sheet-title"
      className="bg-key text-primary backdrop:bg-primary/40 m-auto w-[min(32rem,calc(100vw-2rem))] rounded-[var(--radius-plate)] p-0 shadow-[0_6px_0_var(--color-skirt),0_24px_48px_-12px_var(--key-cast)] backdrop:backdrop-blur-[2px] open:animate-[sheet-in_220ms_var(--ease-out-expo)] motion-reduce:open:animate-none"
    >
      <div className="flex flex-col gap-y-6 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="shortcut-sheet-title"
            className="flex items-center gap-x-3 text-xl font-semibold"
          >
            <Keyboard aria-hidden className="text-mod size-6" />
            Keyboard shortcuts
          </h2>
          <form method="dialog">
            <button
              type="submit"
              className="keycap keycap-plain size-9"
              aria-label="Close shortcuts"
            >
              <X aria-hidden className="size-4" />
            </button>
          </form>
        </div>

        <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 text-base">
          {NAV_SHORTCUTS.map((item) => (
            <ShortcutRow key={item.key} keys={[item.key]}>
              {item.href.startsWith("http")
                ? `Open ${item.label}`
                : `Go to ${item.label}`}
            </ShortcutRow>
          ))}
          <ShortcutRow keys={["t"]}>Switch light and dark</ShortcutRow>
          <ShortcutRow keys={["/"]}>Search webmarks</ShortcutRow>
          <ShortcutRow keys={["?"]}>Show this sheet</ShortcutRow>
        </dl>

        <div className="bg-surface flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm">
          <label htmlFor="shortcut-toggle" className="cursor-pointer">
            <span className="text-primary block font-bold">
              Single-key shortcuts
            </span>
            <span className="text-secondary">
              Turn off if they get in the way of your screen reader or
              extensions.
            </span>
          </label>
          <input
            id="shortcut-toggle"
            type="checkbox"
            role="switch"
            aria-checked={enabled}
            checked={enabled}
            onChange={(event) => setShortcutsEnabled(event.target.checked)}
            className="text-mod focus-visible:ring-accent size-5 shrink-0 cursor-pointer rounded border-[var(--color-skirt)] focus:ring-0 focus-visible:ring-2"
          />
        </div>

        <p className="text-secondary text-sm text-pretty">
          {rgb
            ? "RGB underglow is on. Enter the code again to turn it off."
            : "This keyboard hides a couple of secrets. One is spelled out on the home page; the other is older than most of the web."}
        </p>
      </div>
    </dialog>
  );
}

function ShortcutRow({
  keys,
  children,
}: {
  keys: string[];
  children: React.ReactNode;
}) {
  return (
    <>
      <dt className="flex gap-1">
        {keys.map((key) => (
          <kbd
            key={key}
            className="keycap keycap-plain min-w-9 px-2 py-1 font-mono text-sm uppercase [--travel:3px]"
          >
            {key}
          </kbd>
        ))}
      </dt>
      <dd className="text-secondary-strong">{children}</dd>
    </>
  );
}
