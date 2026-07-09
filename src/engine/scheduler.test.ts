import { describe, it, expect } from "vitest";
import {
  addDays,
  dueReviews,
  newReview,
  reviewIsDue,
  scheduleNext,
} from "@/engine/scheduler.ts";
import { makeProgress } from "@/test/fixtures.ts";

describe("addDays (provided helper)", () => {
  it("adds days, handling month boundaries", () => {
    expect(addDays("2026-07-15", 1)).toBe("2026-07-16");
    expect(addDays("2026-01-30", 3)).toBe("2026-02-02");
  });
});

describe("reviewIsDue (worked example)", () => {
  it("is due on the due date itself", () => {
    expect(reviewIsDue(newReview("2026-07-15"), "2026-07-15")).toBe(true);
  });

  it("is due after the due date has passed", () => {
    const review = { ease: 2.5, intervalDays: 3, dueDate: "2026-07-10" };
    expect(reviewIsDue(review, "2026-07-15")).toBe(true);
  });

  it("is NOT due before the due date", () => {
    const review = { ease: 2.5, intervalDays: 3, dueDate: "2026-07-20" };
    expect(reviewIsDue(review, "2026-07-15")).toBe(false);
  });
});

/* YOUR TURN #3 — delete `.skip` when you start scheduleNext.
 * These tests follow the exact worked trace in the scheduler.ts comment. */
describe.skip("scheduleNext", () => {
  const today = "2026-07-15";

  it("'good' on a first-ever review sets a 1-day interval", () => {
    const next = scheduleNext(newReview(today), "good", today);
    expect(next).toEqual({ ease: 2.5, intervalDays: 1, dueDate: "2026-07-16" });
  });

  it("'good' multiplies the interval by ease", () => {
    const review = { ease: 2.5, intervalDays: 1, dueDate: "2026-07-16" };
    const next = scheduleNext(review, "good", "2026-07-16");
    // 1 × 2.5 = 2.5 → ceil → 3
    expect(next.intervalDays).toBe(3);
    expect(next.dueDate).toBe("2026-07-19");
    expect(next.ease).toBe(2.5);
  });

  it("'again' resets the interval to 1 and drops ease by 0.2", () => {
    const review = { ease: 2.5, intervalDays: 3, dueDate: "2026-07-19" };
    const next = scheduleNext(review, "again", "2026-07-19");
    expect(next).toEqual({
      ease: 2.3,
      intervalDays: 1,
      dueDate: "2026-07-20",
    });
  });

  it("ease never drops below 1.3", () => {
    const review = { ease: 1.35, intervalDays: 1, dueDate: today };
    const next = scheduleNext(review, "again", today);
    expect(next.ease).toBe(1.3);
  });

  it("'easy' grows ease by 0.15 and multiplies by the NEW ease", () => {
    const review = { ease: 2.5, intervalDays: 4, dueDate: today };
    const next = scheduleNext(review, "easy", today);
    expect(next.ease).toBeCloseTo(2.65);
    // 4 × 2.65 = 10.6 → ceil → 11
    expect(next.intervalDays).toBe(11);
    expect(next.dueDate).toBe(addDays(today, 11));
  });

  it("does not mutate the review it was given", () => {
    const review = { ease: 2.5, intervalDays: 3, dueDate: today };
    scheduleNext(review, "again", today);
    expect(review).toEqual({ ease: 2.5, intervalDays: 3, dueDate: today });
  });
});

/* YOUR TURN #4 — delete `.skip` when you start dueReviews. */
describe.skip("dueReviews", () => {
  it("returns only the lesson ids whose reviews are due", () => {
    const progress = makeProgress({
      reviews: {
        "lesson-due": { ease: 2.5, intervalDays: 1, dueDate: "2026-07-14" },
        "lesson-today": { ease: 2.5, intervalDays: 1, dueDate: "2026-07-15" },
        "lesson-later": { ease: 2.5, intervalDays: 7, dueDate: "2026-07-22" },
      },
    });

    const due = dueReviews(progress, "2026-07-15");
    expect(due).toContain("lesson-due");
    expect(due).toContain("lesson-today");
    expect(due).not.toContain("lesson-later");
    expect(due).toHaveLength(2);
  });

  it("returns an empty array when nothing is due (or no reviews exist)", () => {
    expect(dueReviews(makeProgress(), "2026-07-15")).toEqual([]);
  });
});
