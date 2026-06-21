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

  /** Replace state via a pure mutator, then persist and notify subscribers. */
  update(mutate: (state: ProgressState) => ProgressState): void {
    const result = mutate(this.state);
    this.state = result;
    this.persist();
    this.notify();
  }

  /** Serialize the full state as a pretty JSON string for backup. */
  exportJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  /** Replace state from a validated backup string; throws if it doesn't match. */
  importJSON(json: string): void {
    const parsed = JSON.parse(json);
    const check = progressStateSchema.safeParse(parsed);
    if (!check.success) {
      throw new Error("Invalid progress backup: does not match the expected shape.");
    }
    this.state = check.data;
    this.persist();
    this.notify();
  }
}

/** App-wide singleton. Consumers import THIS, typed as the interface. */
export const progressStore: ProgressStore = new LocalStorageStore();
