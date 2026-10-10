import { OPEN_SHEET_EVENT } from "./shortcuts";

/** The "?" key in the header: opens the keyboard shortcut sheet. */
export function ShortcutKey() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_SHEET_EVENT))}
      className="keycap keycap-plain hidden size-10 font-mono text-base font-bold [--travel:3px] pointer-fine:inline-flex"
      aria-label="Keyboard shortcuts"
      aria-keyshortcuts="?"
      title="Keyboard shortcuts (?)"
    >
      ?
    </button>
  );
}
