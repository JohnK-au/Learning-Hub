import { useCallback, useSyncExternalStore } from "react";
import { useProgressStore } from "@/store/ProgressContext.tsx";
import type { ProgressState, ProgressStore } from "@/store/ProgressStore.ts";

/**
 * THE BASE HOOK. Connects the ProgressStore to React.
 *
 * `useSyncExternalStore` is React's official bridge to a store that lives
 * outside React (ours does — it's a plain class). We give it two things:
 *   - subscribe:   how to be told when the store changes (re-render on notify)
 *   - getSnapshot: how to read the current state
 * React then re-renders any component using this hook whenever `update()` runs.
 *
 * Every other progress hook is built on top of this one, so the subscription
 * logic lives in exactly one place (DRY).
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
