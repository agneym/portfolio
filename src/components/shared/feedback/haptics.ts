/**
 * Haptics for the Clack board: a tiny wrapper over navigator.vibrate.
 * Loaded lazily by `./index.ts`, only on touch devices that support it.
 * Phone motors need roughly 10ms of drive before a tap is felt, so the
 * shortest pulse here is 10ms.
 */
import type { FeedbackKind } from "./index";

const PATTERNS: Record<FeedbackKind, number | number[]> = {
  alpha: 12,
  mod: 10,
  space: 20,
  enter: 24,
  toggle: [12, 60, 12],
  wave: [12, 70, 12, 70, 12, 70, 30],
  "konami-on": [15, 50, 15, 50, 15, 50, 45],
  "konami-off": [30, 60, 12],
};

export function buzz(kind: FeedbackKind) {
  try {
    navigator.vibrate?.(PATTERNS[kind]);
  } catch {
    // Unsupported or blocked: haptics are optional.
  }
}
