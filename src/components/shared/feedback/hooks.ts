import { useSyncExternalStore } from "react";
import {
  hapticsEnabled,
  hapticsSupported,
  soundEnabled,
  subscribeFeedback,
} from "./index";

const never = () => false;
const noop = () => () => {};

/** Sound setting; `false` during SSR and hydration (sound is opt-in). */
export function useSoundEnabled() {
  return useSyncExternalStore(subscribeFeedback, soundEnabled, never);
}

export function useHapticsEnabled() {
  return useSyncExternalStore(subscribeFeedback, hapticsEnabled, never);
}

/** `false` on the server and on devices without the Vibration API. */
export function useHapticsSupported() {
  return useSyncExternalStore(noop, hapticsSupported, never);
}
