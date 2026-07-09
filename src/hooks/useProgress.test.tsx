import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { useProgress } from "@/hooks/useProgress.ts";
import { ProgressProvider } from "@/store/ProgressContext.tsx";
import { LocalStorageStore } from "@/store/LocalStorageStore.ts";

/**
 * Regression test for the unbound-method bug: `useProgress` must return an
 * `update` that still works after destructuring (i.e. it must not lose `this`).
 */
describe("useProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function wrapperWith(store: LocalStorageStore) {
    return function Wrapper({ children }: { children: ReactNode }) {
      return <ProgressProvider store={store}>{children}</ProgressProvider>;
    };
  }

  it("update works when destructured (regression: unbound `this`)", () => {
    const store = new LocalStorageStore();
    const { result } = renderHook(() => useProgress(), {
      wrapper: wrapperWith(store),
    });

    const { update } = result.current; // destructure — the exact bug shape
    act(() => {
      update((s) => ({
        ...s,
        streak: { ...s.streak, current: 1, longest: 1 },
      }));
    });

    expect(result.current.state.streak.current).toBe(1);
  });

  it("re-renders consumers when the store changes", () => {
    const store = new LocalStorageStore();
    const { result } = renderHook(() => useProgress(), {
      wrapper: wrapperWith(store),
    });

    act(() => {
      store.update((s) => ({
        ...s,
        streak: { ...s.streak, current: 9, longest: 9 },
      }));
    });

    expect(result.current.state.streak.current).toBe(9);
  });
});
