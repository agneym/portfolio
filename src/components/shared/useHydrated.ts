import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during SSR and hydration, `true` once the component is running on
 * the client. Use it for markup that depends on client-only state (such as
 * the resolved theme) without calling setState inside an effect.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
