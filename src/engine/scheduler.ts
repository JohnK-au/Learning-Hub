import type { ProgressState, ReviewState } from "@/store/ProgressStore.ts";

/**
 * SPACED-REPETITION SCHEDULER — decides when a lesson's review comes back.
 *
 * THE IDEA (the science this app is built on): memory fades on a curve. If
 * you re-test yourself just before you'd forget, the memory comes back
 * stronger and the next safe gap is LONGER. So each successful review pushes
 * the next one further out: 1 day → 3 days → a week → weeks. Failing pulls
 * it back to tomorrow. This is a simplified version of the classic SM-2
 * algorithm (the one behind Anki).
 *
 * A ReviewState is three numbers-in-a-trenchcoat (see ProgressStore.ts):
 *   ease         — how "easy" this item has proven (multiplier, starts 2.5)
 *   intervalDays — the current gap between reviews
 *   dueDate      — when it next comes due ("YYYY-MM-DD")
 *
 * WHY IS `today` A PARAMETER EVERYWHERE?
 * Notice no function here ever asks the computer for the date — the caller
 * hands `today` in. If a function secretly read the real clock, a test that
 * passes on Monday could fail on Tuesday (same inputs, different output —
 * impure!). Injecting the clock keeps every function a vending machine:
 * pages pass the real date, tests pass a made-up one, and both get
 * deterministic behavior. This is the #1 trick for testing time-based logic.
 */

/** The three ways a review can go, self-graded after the reveal. */
export type ReviewGrade = "again" | "good" | "easy";

/** A brand-new review: due immediately, default ease. */
export function newReview(today: string): ReviewState {
  return { ease: 2.5, intervalDays: 0, dueDate: today };
}

/**
 * Date helper — PROVIDED, because calendar math is fiddly and isn't the
 * learning goal. Adds N days to a "YYYY-MM-DD" string, safely, in UTC.
 * addDays("2026-01-30", 3) === "2026-02-02".
 */
export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------------ *
 * WORKED EXAMPLE — a review is due when its due date has arrived or passed.
 *
 * The neat trick: "YYYY-MM-DD" strings sort EXACTLY like dates ("2026-03-01"
 * < "2026-11-20" as strings, and as dates). So plain <= is a correct date
 * comparison — no Date objects needed. This only works because the format
 * pads with zeros; it's one reason the whole codebase stores dates this way.
 * ------------------------------------------------------------------------ */
export function reviewIsDue(review: ReviewState, today: string): boolean {
  return review.dueDate <= today;
}

/* ------------------------------------------------------------------------ *
 * YOUR TURN #3 — scheduleNext: the heart of spaced repetition
 * ------------------------------------------------------------------------ *
 * Given the current ReviewState, the user's grade, and today's date, return
 * the NEW ReviewState (a fresh object — never mutate the input; same rule as
 * the store's update()). The rules:
 *
 *   grade "again" (forgot):
 *     - ease drops by 0.2, but never below 1.3   (Math.max again!)
 *     - intervalDays resets to 1
 *   grade "good" (recalled with effort):
 *     - ease stays the same
 *     - intervalDays: if it was 0 (first ever review) → 1
 *                     otherwise → the old interval × ease
 *   grade "easy" (instant recall):
 *     - ease grows by 0.15
 *     - intervalDays: if 0 → 2 (skip ahead)
 *                     otherwise → old interval × the NEW (grown) ease
 *
 *   In every case:
 *     - round the final interval UP to a whole day: Math.ceil(...)
 *     - dueDate = addDays(today, thatInterval)   ← reuse the helper (DRY)
 *
 * Worked trace to check your logic against (start: ease 2.5, interval 0):
 *   "good" today=2026-07-15 → { ease: 2.5, intervalDays: 1, dueDate: 2026-07-16 }
 *   then "good" on the 16th → interval 1×2.5 → ceil → 3, due 2026-07-19
 *   then "again" on the 19th → ease 2.3, interval 1, due 2026-07-20
 *
 * Verify: unskip `describe.skip("scheduleNext", ...)` in scheduler.test.ts.
 */
export function scheduleNext(
  review: ReviewState,
  grade: ReviewGrade,
  today: string,
): ReviewState {
  let ease = review.ease;
  let intervalDays: number;

  if (grade === "again") {
    ease = Math.max(1.3, ease - 0.2);
    intervalDays = 1;
  } else if (grade === "good") {
    intervalDays = review.intervalDays === 0 ? 1 : review.intervalDays * ease;
  } else {
    ease = ease + 0.15;
    intervalDays = review.intervalDays === 0 ? 2 : review.intervalDays * ease;
  }

  intervalDays = Math.ceil(intervalDays);
  return { ease, intervalDays, dueDate: addDays(today, intervalDays) };
}

/* ------------------------------------------------------------------------ *
 * YOUR TURN #4 — dueReviews: which lessons are due today?
 * ------------------------------------------------------------------------ *
 * `progress.reviews` is a Record — an object used as a dictionary:
 * lessonId → ReviewState. Return the array of lesson ids whose review is due
 * (reuse reviewIsDue — don't re-write the comparison).
 *
 * New tool: `Object.entries(obj)` turns a dictionary into an array of
 * [key, value] pairs you can loop or filter:
 *
 *   Object.entries({ a: 1, b: 2 })  →  [["a", 1], ["b", 2]]
 *
 * Two good shapes — either is fine:
 *   - a for...of loop over Object.entries(progress.reviews), pushing ids
 *   - .filter(...) then .map(([id]) => id)
 *
 * Verify: unskip `describe.skip("dueReviews", ...)` in scheduler.test.ts.
 */
export function dueReviews(progress: ProgressState, today: string): string[] {
  return Object.entries(progress.reviews)
    .filter(([, review]) => reviewIsDue(review, today))
    .map(([lessonId]) => lessonId);
}
