/**
 * Selector hook: the lesson ids whose spaced-repetition reviews are due
 * today. Same pattern as useStreak — build on useProgress, return one slice.
 *
 * YOUR TURN #7 (do #4 first — this hook calls your dueReviews):
 *   1. Import useProgress (from "@/hooks/useProgress.ts") and dueReviews
 *      (from "@/engine/scheduler.ts") — copy how useStreak.ts does imports.
 *   2. Get `state` from useProgress() (destructure, like useStreak does).
 *   3. Compute today's date as "YYYY-MM-DD":
 *        const today = new Date().toISOString().slice(0, 10);
 *      THIS is the boundary where the impure world (the real clock) injects
 *      `today` into the pure engine — the engine never reads a clock itself.
 *   4. Return dueReviews(state, today).
 *
 * Verify: finish #4, implement this, run the app — Home's "Reviews due"
 * card comes alive (it's wrapped in <Unbuilt>, so right now it shows a
 * wrench card naming this TODO).
 */
export function useDueReviews(): string[] {
  throw new Error("TODO: implement useDueReviews (YOUR TURN #7)");
}
