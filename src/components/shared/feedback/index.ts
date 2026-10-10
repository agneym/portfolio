/**
 * Key feedback for the Clack board: synthesized sound and haptics.
 *
 * This file stays in the main bundle and is deliberately tiny. It owns the
 * settings (localStorage) and loads the real work, `./audio` and `./haptics`,
 * as separate chunks with dynamic import() on idle or first interaction.
 * Nothing here touches `window` at module top level, so it is SSR safe.
 */

export type FeedbackKind =
  | "alpha"
  | "space"
  | "enter"
  | "mod"
  | "toggle"
  | "wave"
  | "konami-on"
  | "konami-off";

type AudioModule = typeof import("./audio");
type HapticsModule = typeof import("./haptics");

const SOUND_KEY = "clack:sound";
const HAPTICS_KEY = "clack:haptics";
/** Fired on window whenever a feedback setting changes. */
export const FEEDBACK_CHANGE_EVENT = "clack:feedback-change";

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, on: boolean) {
  try {
    window.localStorage.setItem(key, on ? "on" : "off");
  } catch {
    // Private mode: the setting still holds for this page view.
  }
  window.dispatchEvent(new CustomEvent(FEEDBACK_CHANGE_EVENT));
}

/** Sound is opt-in: off until the visitor turns it on. */
export function soundEnabled() {
  if (typeof window === "undefined") return false;
  return read(SOUND_KEY) === "on";
}

/** Only phones and tablets that implement the Vibration API (Android). */
export function hapticsSupported() {
  if (typeof window === "undefined") return false;
  return (
    typeof navigator.vibrate === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

/** On where supported, unless the visitor asked for reduced motion. */
export function hapticsEnabled() {
  if (!hapticsSupported()) return false;
  const stored = read(HAPTICS_KEY);
  if (stored) return stored === "on";
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function subscribeFeedback(callback: () => void) {
  window.addEventListener(FEEDBACK_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(FEEDBACK_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

let audio: AudioModule | undefined;
let audioLoad: Promise<AudioModule | undefined> | undefined;
let haptics: HapticsModule | undefined;
let hapticsLoad: Promise<HapticsModule | undefined> | undefined;

function loadAudio() {
  audioLoad ??= import("./audio").then(
    (module) => (audio = module),
    () => {
      audioLoad = undefined; // Offline or a stale deploy: try again later.
      return undefined;
    },
  );
  return audioLoad;
}

function loadHaptics() {
  hapticsLoad ??= import("./haptics").then(
    (module) => (haptics = module),
    () => {
      hapticsLoad = undefined;
      return undefined;
    },
  );
  return hapticsLoad;
}

/**
 * Fetch the chunks that are likely to be needed. With `intent` (the
 * visitor is reaching for the board) the audio chunk loads even while
 * muted, so the sound switch can answer inside the same gesture.
 */
export function warmFeedback({ intent = false } = {}) {
  if (intent || soundEnabled()) void loadAudio();
  if (hapticsEnabled()) void loadHaptics();
}

/**
 * Inside a user gesture: lets Safari and Chrome start the AudioContext.
 * Cheap to call on every gesture; does nothing while muted.
 */
export function unlockFeedback() {
  if (soundEnabled()) audio?.unlock();
}

/**
 * Play a key. `touch` marks a finger press, the only time haptics fire.
 * Plays synchronously when the chunk is ready (so it stays inside the
 * gesture); otherwise it loads the chunk and plays a moment late.
 */
export function feedback(kind: FeedbackKind, { touch = false } = {}) {
  if (typeof window === "undefined") return;
  if (soundEnabled()) {
    if (audio) audio.play(kind);
    else void loadAudio().then((module) => module?.play(kind));
  }
  if (touch && hapticsEnabled()) {
    if (haptics) haptics.buzz(kind);
    else void loadHaptics().then((module) => module?.buzz(kind));
  }
}

export function setSoundEnabled(on: boolean) {
  write(SOUND_KEY, on);
  if (on) feedback("toggle");
}

export function setHapticsEnabled(on: boolean) {
  write(HAPTICS_KEY, on);
  if (on) feedback("toggle", { touch: true });
}

/**
 * Wire feedback up for a board: load the chunks on idle (if a setting needs
 * them) or as soon as the visitor reaches for the board, and unlock audio on
 * every gesture. Returns a cleanup function.
 */
export function startFeedback(board: HTMLElement) {
  const onIntent = () => warmFeedback({ intent: true });
  let cancelIdle: () => void;
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(() => warmFeedback(), {
      timeout: 4000,
    });
    cancelIdle = () => window.cancelIdleCallback(id);
  } else {
    // Safari before 18.2 has no requestIdleCallback.
    const id = window.setTimeout(() => warmFeedback(), 2000);
    cancelIdle = () => window.clearTimeout(id);
  }
  const once = { once: true, passive: true } as const;
  board.addEventListener("pointerover", onIntent, once);
  board.addEventListener("pointerdown", onIntent, once);
  board.addEventListener("focusin", onIntent, once);
  window.addEventListener("keydown", onIntent, once);
  // pointerup and keydown are activation-triggering events in every
  // engine, so resuming the AudioContext there is always allowed.
  const gestures = ["pointerup", "keydown", "touchend"] as const;
  for (const type of gestures) {
    window.addEventListener(type, unlockFeedback, { passive: true });
  }
  return () => {
    cancelIdle();
    board.removeEventListener("pointerover", onIntent);
    board.removeEventListener("pointerdown", onIntent);
    board.removeEventListener("focusin", onIntent);
    window.removeEventListener("keydown", onIntent);
    for (const type of gestures) {
      window.removeEventListener(type, unlockFeedback);
    }
  };
}
