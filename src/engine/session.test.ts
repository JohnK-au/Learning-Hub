import { describe, it, expect } from "vitest";
import {
  bumpStreak,
  completeLesson,
  shouldShowBlock,
} from "@/engine/session.ts";
import { makeLesson, makeProgress } from "@/test/fixtures.ts";
import type { LearningProfile } from "@/store/ProgressStore.ts";

describe("bumpStreak (provided)", () => {
  it("ignores a second session on the same day", () => {
    const streak = { current: 4, longest: 6, lastActiveDate: "2026-07-15" };
    expect(bumpStreak(streak, "2026-07-15")).toEqual(streak);
  });

  it("grows the streak on a consecutive day", () => {
    const streak = { current: 4, longest: 6, lastActiveDate: "2026-07-14" };
    expect(bumpStreak(streak, "2026-07-15")).toEqual({
      current: 5,
      longest: 6,
      lastActiveDate: "2026-07-15",
    });
  });

  it("resets to 1 after a gap, keeping the longest record", () => {
    const streak = { current: 9, longest: 9, lastActiveDate: "2026-07-01" };
    expect(bumpStreak(streak, "2026-07-15")).toEqual({
      current: 1,
      longest: 9,
      lastActiveDate: "2026-07-15",
    });
  });
});

/* YOUR TURN #5 — delete `.skip` when you start completeLesson. */
describe("completeLesson", () => {
  const lesson = makeLesson("l1", {
    reviewItems: [{ question: "Q?", answer: "A." }],
  });
  const args = {
    topicId: "topic-x",
    trackId: "track-x",
    lesson,
    today: "2026-07-15",
    now: 1234567890,
  };

  it("records the completed lesson on the track", () => {
    const next = completeLesson(makeProgress(), args);
    expect(next.tracks["track-x"].completedLessonIds).toEqual(["l1"]);
    expect(next.tracks["track-x"].currentLessonId).toBe("l1");
    expect(next.tracks["track-x"].lastActiveAt).toBe(1234567890);
  });

  it("does not duplicate an already-completed lesson", () => {
    const once = completeLesson(makeProgress(), args);
    const twice = completeLesson(once, args);
    expect(twice.tracks["track-x"].completedLessonIds).toEqual(["l1"]);
  });

  it("bumps the streak and appends a history record", () => {
    const next = completeLesson(makeProgress(), args);
    expect(next.streak.current).toBe(1);
    expect(next.history).toHaveLength(1);
    expect(next.history[0]).toEqual({
      date: "2026-07-15",
      topicId: "topic-x",
      trackId: "track-x",
      lessonIds: ["l1"],
    });
  });

  it("schedules a review for a lesson with reviewItems", () => {
    const next = completeLesson(makeProgress(), args);
    expect(next.reviews["l1"]).toEqual({
      ease: 2.5,
      intervalDays: 0,
      dueDate: "2026-07-15",
    });
  });

  it("does NOT reset an existing review's schedule", () => {
    const existing = { ease: 2.1, intervalDays: 7, dueDate: "2026-07-20" };
    const progress = makeProgress({ reviews: { l1: existing } });
    const next = completeLesson(progress, args);
    expect(next.reviews["l1"]).toEqual(existing);
  });

  it("does not schedule a review for a lesson without reviewItems", () => {
    const bare = makeLesson("l2");
    const next = completeLesson(makeProgress(), { ...args, lesson: bare });
    expect(next.reviews["l2"]).toBeUndefined();
  });

  it("updates lastPosition and never mutates the input", () => {
    const before = makeProgress();
    const next = completeLesson(before, args);
    expect(next.lastPosition).toEqual({
      topicId: "topic-x",
      trackId: "track-x",
    });
    expect(before.history).toHaveLength(0); // input untouched
    expect(before.tracks["track-x"]).toBeUndefined();
  });
});

/* YOUR TURN #10 — delete `.skip` when you start shouldShowBlock. */
describe("shouldShowBlock", () => {
  const textLover: LearningProfile = {
    presentation: "more-text",
    sessionLength: "short",
  };
  const visualLover: LearningProfile = {
    presentation: "more-visual",
    sessionLength: "short",
  };

  it("always shows non-prose blocks", () => {
    const callout = {
      kind: "callout",
      variant: "fact",
      body: "Hi",
    } as const;
    expect(shouldShowBlock(callout, visualLover)).toBe(true);
    expect(shouldShowBlock(callout, undefined)).toBe(true);
  });

  it("always shows core prose (with or without an explicit depth)", () => {
    expect(shouldShowBlock({ kind: "prose", body: "x" }, visualLover)).toBe(
      true,
    );
    expect(
      shouldShowBlock({ kind: "prose", body: "x", depth: "core" }, undefined),
    ).toBe(true);
  });

  it("shows deep-dive prose only to the more-text profile", () => {
    const deep = { kind: "prose", body: "x", depth: "deep-dive" } as const;
    expect(shouldShowBlock(deep, textLover)).toBe(true);
    expect(shouldShowBlock(deep, visualLover)).toBe(false);
    expect(shouldShowBlock(deep, undefined)).toBe(false);
  });
});
