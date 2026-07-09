import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageStore } from "@/store/LocalStorageStore.ts";

/**
 * Behavioral tests for the store — the permanent version of the throwaway
 * script that caught the `this.notify` lesson: a green typecheck says the
 * types line up; only tests prove the logic.
 */
describe("LocalStorageStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("applies update(), persists, and notifies subscribers", () => {
    const store = new LocalStorageStore();
    let notified = 0;
    store.subscribe(() => notified++);

    store.update((s) => ({
      ...s,
      streak: { ...s.streak, current: 5, longest: 5 },
    }));

    expect(store.getState().streak.current).toBe(5);
    expect(notified).toBe(1);

    // A brand-new instance reads what the first one persisted.
    const reopened = new LocalStorageStore();
    expect(reopened.getState().streak.current).toBe(5);
  });

  it("round-trips state through exportJSON/importJSON", () => {
    const store = new LocalStorageStore();
    store.update((s) => ({ ...s, streak: { ...s.streak, current: 3 } }));
    const backup = store.exportJSON();

    store.update((s) => ({ ...s, streak: { ...s.streak, current: 0 } }));
    expect(store.getState().streak.current).toBe(0);

    store.importJSON(backup);
    expect(store.getState().streak.current).toBe(3);
  });

  it("rejects an invalid backup and leaves state untouched", () => {
    const store = new LocalStorageStore();
    store.update((s) => ({ ...s, streak: { ...s.streak, current: 7 } }));

    expect(() => store.importJSON('{"not":"valid"}')).toThrow();
    expect(store.getState().streak.current).toBe(7);
  });

  it("falls back to a fresh state when storage holds corrupt data", () => {
    localStorage.setItem("learning-hub:progress", "not json at all");
    const store = new LocalStorageStore();
    expect(store.getState().streak.current).toBe(0);
  });
});
