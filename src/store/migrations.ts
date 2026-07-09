import { PROGRESS_VERSION } from "@/store/ProgressStore.ts";

/**
 * MIGRATIONS — how saved progress survives schema changes.
 *
 * The problem this solves: your real streak/history lives in localStorage in
 * the OLD shape. If the schema changes and we just re-validate, old data
 * fails and gets silently replaced with a fresh state — months of streak,
 * wiped. The honest fix is migration: a small function per version bump that
 * transforms "the old shape" into "the next shape" before validation.
 *
 * `migrations[n]` upgrades a version-n state to version n+1. `migrate` runs
 * them in sequence until the data reaches PROGRESS_VERSION — so a save from
 * three versions ago walks up one step at a time (1→2→3→…), each step only
 * needing to know about its own change.
 *
 * v1 → v2 (worked example): v2 added the optional `preferences` field, so no
 * data transformation is needed — the step just stamps the new version. A
 * future step that RENAMES a field would look like:
 *   3: (s) => ({ ...s, newName: s.oldName, oldName: undefined, version: 4 })
 */
type RawState = Record<string, unknown>;

const migrations: Record<number, (state: RawState) => RawState> = {
  1: (state) => ({ ...state, version: 2 }),
};

/** Walk raw parsed JSON up to the current version. Returns null if stuck. */
export function migrate(raw: unknown): unknown {
  if (raw === null || typeof raw !== "object") return raw;
  let state = raw as RawState;

  let guard = 0; // safety: never loop forever on bad data
  while (
    typeof state.version === "number" &&
    state.version < PROGRESS_VERSION &&
    guard++ < 100
  ) {
    const step = migrations[state.version];
    if (!step) return null; // no path forward — treat as unreadable
    state = step(state);
  }
  return state;
}
