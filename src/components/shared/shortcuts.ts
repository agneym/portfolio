/**
 * Clack keyboard shortcuts: one registry shared by the global listener,
 * the shortcut sheet, and the keycap legends.
 */

export const NAV_SHORTCUTS = [
  { key: "h", label: "Home", href: "/" },
  { key: "b", label: "Blog", href: "/blog" },
  { key: "w", label: "Webmarks", href: "/webmarks" },
  {
    key: "p",
    label: "Projects",
    href: "https://github.com/agneym?tab=repositories",
  },
  { key: "j", label: "Newsletter", href: "https://buttondown.email/agney" },
] as const;

export type NavShortcut = (typeof NAV_SHORTCUTS)[number];
export type ExternalShortcut = Extract<
  NavShortcut,
  { href: `https://${string}` }
>;
export type InternalShortcut = Exclude<NavShortcut, ExternalShortcut>;

export const isExternal = (item: NavShortcut): item is ExternalShortcut =>
  item.href.startsWith("https://");

export const shortcutFor = (href: string) =>
  NAV_SHORTCUTS.find((item) => item.href === href)?.key;

const STORAGE_KEY = "clack:shortcuts";

export function shortcutsEnabled() {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setShortcutsEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Private mode: the toggle still works for this page view.
  }
  window.dispatchEvent(new CustomEvent("clack:shortcuts-change"));
}

/** Keys typed into fields, or chorded with a modifier, are never shortcuts. */
export function isTypingTarget(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey) return true;
  const target = event.target as HTMLElement | null;
  if (!target) return false;
  return (
    target.isContentEditable ||
    target.closest("input, textarea, select, [contenteditable]") !== null
  );
}

export const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

/** Fired on window when RGB underglow is toggled (Konami code). */
export const RGB_EVENT = "clack:rgb";
/** Fired on window to open the shortcut sheet. */
export const OPEN_SHEET_EVENT = "clack:open-sheet";
