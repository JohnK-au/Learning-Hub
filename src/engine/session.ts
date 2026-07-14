import type { Block, Lesson } from "@/schema/schema.ts";
import type { LearningProfile, ProgressState } from "@/store/ProgressStore.ts";
import { addDays, newReview } from "@/engine/scheduler.ts";

/**
 * SESSION ENGINE — what happens to progress when a lesson is finished.
 * Pure functions, same rules as the rest of the engine: the caller injects
 * `today`/`now`, nothing here reads a clock or touches the store.
 */

/**
 * PROVIDED — correct streak arithmetic (subtler than it looks):
 *   - second session on the same day: no change
 *   - first session exactly one day after the last: streak grows
 *   - any longer gap (or first session ever): streak resets to 1
 * Note this fixes the old Home button, which grew the streak even after a
 * week away. `addDays(today, -1)` is "yesterday" — reusing the tested helper
 * instead of doing date math twice (DRY).
 */
export function bumpStreak(
  streak: ProgressState["streak"],
  today: string,
): ProgressState["streak"] {
  if (streak.lastActiveDate === today) return streak;
  const current =
    streak.lastActiveDate === addDays(today, -1) ? streak.current + 1 : 1;
  return {
    current,
    longest: Math.max(current, streak.longest),
    lastActiveDate: today,
  };
}

export interface CompleteLessonArgs {
  topicId: string;
  trackId: string;
  lesson: Lesson;
  today: string; // "YYYY-MM-DD"
  now: number; // epoch ms, for lastActiveAt
}

/* ------------------------------------------------------------------------ *
 * YOUR TURN #5 — completeLesson: the biggest one. Take your time.
 * ------------------------------------------------------------------------ *
 * This is the single state change at the heart of the app: given the current
 * ProgressState and a finished lesson, return the NEW ProgressState. It
 * composes pieces you already have — bumpStreak (above) and newReview (add it
 * to the import from "@/engine/scheduler.ts" up top) — plus the
 * update-immutably pattern from Stage 3.
 *
 * The new state must have, in any order of assembly:
 *
 *   1. tracks[args.trackId] updated:
 *        - completedLessonIds includes args.lesson.id — WITHOUT duplicates
 *          (finishing twice must not add it twice; `.includes()` is your guard)
 *        - currentLessonId = args.lesson.id
 *        - lastActiveAt = args.now
 *        The track record may not exist yet — start from
 *        `state.tracks[args.trackId] ?? { completedLessonIds: [], lastActiveAt: 0 }`.
 *   2. streak = bumpStreak(state.streak, args.today)
 *   3. history: the old array plus one new record:
 *        { date: args.today, topicId: args.topicId, trackId: args.trackId,
 *          lessonIds: [args.lesson.id] }
 *   4. reviews: if the lesson HAS reviewItems (non-empty) AND there is no
 *      existing review for it, add reviews[args.lesson.id] = newReview(args.today).
 *      (An existing review keeps its schedule — don't reset it.)
 *   5. lastPosition = { topicId: args.topicId, trackId: args.trackId }
 *
 * NEVER mutate `state` — build new objects with spreads, exactly like the
 * mutators you've written: { ...state, streak: ..., tracks: { ...state.tracks,
 * [args.trackId]: ... } }. (The [args.trackId] square-bracket key means "use
 * the VALUE of this variable as the key" — a computed property name.)
 *
 * Verify: unskip `describe.skip("completeLesson", ...)` in session.test.ts.
 * The tests check every rule above, including the no-duplicates guard.
 */
export function completeLesson(
  state: ProgressState,
  args: CompleteLessonArgs,
): ProgressState {
  const existing = state.tracks[args.trackId] ?? {
    completedLessonIds: [],
    lastActiveAt: 0,
  };
  const completedLessonIds = existing.completedLessonIds.includes(
    args.lesson.id,
  )
    ? existing.completedLessonIds
    : [...existing.completedLessonIds, args.lesson.id];

  const hasReviewItems = (args.lesson.reviewItems?.length ?? 0) > 0;
  const reviews =
    hasReviewItems && !state.reviews[args.lesson.id]
      ? { ...state.reviews, [args.lesson.id]: newReview(args.today) }
      : state.reviews;

  return {
    ...state,
    streak: bumpStreak(state.streak, args.today),
    tracks: {
      ...state.tracks,
      [args.trackId]: {
        completedLessonIds,
        currentLessonId: args.lesson.id,
        lastActiveAt: args.now,
      },
    },
    history: [
      ...state.history,
      {
        date: args.today,
        topicId: args.topicId,
        trackId: args.trackId,
        lessonIds: [args.lesson.id],
      },
    ],
    reviews,
    lastPosition: { topicId: args.topicId, trackId: args.trackId },
  };
}

/* ------------------------------------------------------------------------ *
 * YOUR TURN #10 — shouldShowBlock: preferences meet content
 * ------------------------------------------------------------------------ *
 * Some prose blocks are tagged depth: "deep-dive" — optional extra depth.
 * Whether they show by default depends on the learning profile:
 *
 *   - a block that is NOT prose, or has no depth, or depth "core" → always true
 *   - a prose block with depth "deep-dive" → true ONLY when
 *     profile?.presentation === "more-text"
 *
 * Mind the undefineds: profile may be undefined (onboarding skipped), and
 * `profile?.presentation` handles that — optional chaining returns undefined
 * instead of crashing, and undefined !== "more-text".
 *
 * Verify: unskip `describe.skip("shouldShowBlock", ...)` in session.test.ts.
 */
export function shouldShowBlock(
  block: Block,
  profile: LearningProfile | undefined,
): boolean {
  void block;
  void profile;
  throw new Error("TODO: implement shouldShowBlock (YOUR TURN #10)");
}
