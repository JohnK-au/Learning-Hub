import {
  createDefaultProgressState,
  progressStateSchema,
  type ProgressState,
  type ProgressStore,
} from "@/store/ProgressStore.ts";

const STORAGE_KEY = "learning-hub:progress";

/**
 * localStorage-backed implementation of ProgressStore.
 *
 * This is the ONLY file that touches the browser's storage. Because it
 * implements the ProgressStore interface, the rest of the app neither knows
 * nor cares that progress lives in localStorage — a future SupabaseStore could
 * replace it without any consumer changing.
 */
export class LocalStorageStore implements ProgressStore {
  private state: ProgressState;
  private readonly listeners = new Set<() => void>();

  constructor() {
    this.state = this.load();
  }

  /** Read + validate from storage; fall back to a fresh state on any problem. */
  private load(): ProgressState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultProgressState();
      const parsed = progressStateSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : createDefaultProgressState();
    } catch {
      return createDefaultProgressState();
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }

  getState(): ProgressState {
    return this.state;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // --- YOUR TURN ---------------------------------------------------------
  //
  // Implement the three methods the interface still requires. Use the private
  // helpers above (`persist`, `notify`) — don't duplicate their logic.
  //
  // 1. update(mutate): apply `mutate` to the current state to get the NEXT
  //    state, store it, persist it, then notify listeners.
  //    Why "next" must be a new object: React (Stage 4) detects changes by
  //    object identity, so mutating in place would render nothing.
  //
  //    update(mutate: (state: ProgressState) => ProgressState): void { ... }

  update(mutate: (state: ProgressState) => ProgressState): void {
    const result = mutate(this.state);
    this.state = result;
    this.persist();
    this.notify()
  }

  //
  // 2. exportJSON(): return the state as a pretty JSON string (2-space indent).
  //
  //    exportJSON(): string { ... }

  exportJSON(): string {
    return JSON.stringify(this.state, null, 2)
  }

  //
  // 3. importJSON(json): parse the string, VALIDATE it with
  //    progressStateSchema (reuse it — don't trust backup files), and on
  //    success replace state + persist + notify. On failure, throw an Error
  //    with a clear message. (Hint: JSON.parse can throw too.)
  //
  //    importJSON(json: string): void { ... }

  importJSON(json: string): void {
    const parsed = JSON.parse(json)
    const check = progressStateSchema.safeParse(parsed)
    if (!check.success) {
      throw new Error("This state is not a valid schema")
    }
    this.state = check.data;
    this.persist();
    this.notify()
  }
}

/** App-wide singleton. Consumers import THIS, typed as the interface. */
export const progressStore: ProgressStore = new LocalStorageStore();
