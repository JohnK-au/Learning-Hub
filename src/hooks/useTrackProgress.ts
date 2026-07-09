import type { TrackProgress } from "@/store/ProgressStore.ts";

/**
 * Selector hook: one track's progress record, with a safe default for a
 * track that has never been touched (so callers never deal with undefined).
 *
 * YOUR TURN #8 (a two-liner — same shape as useStreak):
 *   1. Import useProgress and get `state` from useProgress().
 *   2. Return `state.tracks[trackId]`, falling back to
 *      `{ completedLessonIds: [], lastActiveAt: 0 }` when it doesn't exist.
 *      (`??` is the fallback operator you used in nextLessonInTrack.)
 *
 * Verify: implement it, open a topic page — the "n / m lessons" line and
 * the ✓ marks appear (also needs #6 for the summary).
 */
export function useTrackProgress(trackId: string): TrackProgress {
  void trackId;
  throw new Error("TODO: implement useTrackProgress (YOUR TURN #8)");
}
