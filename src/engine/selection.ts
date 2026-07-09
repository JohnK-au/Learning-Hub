import type { Lesson, Topic, Track } from "@/schema/schema.ts";
import type { ProgressState } from "@/store/ProgressStore.ts";

/**
 * SELECTION ENGINE — decides "what should I learn next?"
 *
 * WHY PURE FUNCTIONS?
 * Every function in this file follows one rule: same inputs → same output,
 * touching nothing outside itself. No store, no localStorage, no clock, no
 * React. Think of each one as a vending machine: put the same coins in, the
 * same snack always comes out — nothing else in the building changes.
 *
 * Why does that matter? Two big payoffs:
 *   1. TESTABLE. A test can hand a function made-up inputs and check the
 *      output, with no setup or mocking. (Remember the Stage-3 lesson: a
 *      green typecheck ≠ correct logic. Tests prove logic — and pure
 *      functions are the easiest code in the world to test.)
 *   2. PREDICTABLE. A bug is reproducible with the exact same inputs. There
 *      is no "works on my machine" caused by hidden state.
 *
 * That's also why nothing here calls the store: pages will do
 * `nextLessonInTrack(track, useProgress().state)` — the impure world FETCHES
 * the data, the pure world DECIDES. Separating "deciding" from "doing" is the
 * whole design.
 */

/** What the Home screen's "Continue" card needs to render. */
export interface ContinueSuggestion {
  topicId: string;
  trackId: string;
  lesson: Lesson;
}

/* ------------------------------------------------------------------------ *
 * WORKED EXAMPLE — study this one; the TODOs below reuse its ideas.
 * ------------------------------------------------------------------------ */

/**
 * The next lesson to take in a track: the FIRST lesson (in curriculum order)
 * that hasn't been completed. Returns null when the track is finished.
 *
 * How to read it:
 *   - `progress.tracks[track.id]` may not exist yet (a never-touched track),
 *     so `?? []` falls back to "nothing completed".
 *   - A Set makes `has()` fast and reads like English.
 *   - The double for-loop IS the curriculum order: modules in order, lessons
 *     in order inside each. The first miss is the answer — return early.
 */
export function nextLessonInTrack(
  track: Track,
  progress: ProgressState,
): Lesson | null {
  const completed = new Set(progress.tracks[track.id]?.completedLessonIds ?? []);

  for (const module of track.modules) {
    for (const lesson of module.lessons) {
      if (!completed.has(lesson.id)) return lesson;
    }
  }
  return null; // every lesson in the track is done
}

/* ------------------------------------------------------------------------ *
 * YOUR TURN #1 — continueSuggestion
 * ------------------------------------------------------------------------ *
 * The Home screen asks: "where should the user pick up?" The answer, in
 * order of preference:
 *
 *   1. If `progress.lastPosition` exists, find that topic (by topicId) and
 *      that track (by trackId) in `topics`. If both exist AND
 *      `nextLessonInTrack` finds a lesson there, return
 *      `{ topicId, trackId, lesson }` — the user continues where they were.
 *   2. Otherwise (never studied, or that track is finished/missing): scan
 *      `topics` in order, and each topic's tracks in order, and return the
 *      FIRST track that still has a next lesson.
 *   3. If absolutely everything is complete, return null.
 *
 * Hints:
 *   - `topics.find((t) => t.id === someId)` returns the match or undefined.
 *   - You already have the hard part: call nextLessonInTrack(track, progress)
 *     — don't re-implement its loop (DRY!).
 *   - Step 2 is the same double-loop shape as the worked example, one level
 *     up: for each topic → for each track → first hit wins.
 *
 * Verify: unskip the `describe.skip("continueSuggestion", ...)` block in
 * selection.test.ts and make it green.
 */
export function continueSuggestion(
  topics: Topic[],
  progress: ProgressState,
): ContinueSuggestion | null {
  void topics;
  void progress;
  throw new Error("TODO: implement continueSuggestion (YOUR TURN #1)");
}

/* ------------------------------------------------------------------------ *
 * YOUR TURN #2 — nextDrillLevel
 * ------------------------------------------------------------------------ *
 * Brain-training tracks don't move forward lesson-by-lesson — they move UP
 * and DOWN in difficulty based on how you scored (0 to 1). The rule:
 *
 *   - score >= 0.8            → go up one level    (they've got this)
 *   - score < 0.5             → go down one level  (too hard right now)
 *   - anything in between     → stay put           (productive struggle)
 *   - the level NEVER goes below 1.
 *
 * That "never below 1" needs Math.max — e.g. `Math.max(1, something)` means
 * "something, but at least 1".
 *
 * This is desirable difficulty from the learning research, as code: keep the
 * exercise hard enough to strain, never so hard it defeats.
 *
 * Verify: unskip `describe.skip("nextDrillLevel", ...)` in selection.test.ts.
 */
export function nextDrillLevel(currentLevel: number, score: number): number {
  void currentLevel;
  void score;
  throw new Error("TODO: implement nextDrillLevel (YOUR TURN #2)");
}
