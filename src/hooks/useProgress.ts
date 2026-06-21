import { useCallback, useSyncExternalStore } from "react";
import { useProgressStore } from "@/store/ProgressContext.tsx";
import type { ProgressState, ProgressStore } from "@/store/ProgressStore.ts";

/**
 * Base hook connecting the ProgressStore to React.
 *
 * `useSyncExternalStore` is React's bridge to a store that lives outside React.
 * It takes `subscribe` (how to learn the store changed) and `getSnapshot` (how
 * to read current state), and re-renders consumers whenever `update()` runs.
 * Every other progress hook builds on this one, so the subscription logic lives
 * in exactly one place.
 */
export function useProgress(): {
  state: ProgressState;
  update: ProgressStore["update"];
} {
  const store = useProgressStore();

  // Wrap the store methods so they keep their `this` and stay referentially
  // stable across renders (only changing if the store itself changes).
  const subscribe = useCallback(
    (onChange: () => void) => store.subscribe(onChange),
    [store],
  );
  const getSnapshot = useCallback(() => store.getState(), [store]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return { state, update: store.update };
}
