import { describe, it, expect } from "vitest";
import {
  continueSuggestion,
  nextDrillLevel,
  nextLessonInTrack,
  trackCompletionSummary,
} from "@/engine/selection.ts";
import {
  makeLesson,
  makeModule,
  makeProgress,
  makeTopic,
  makeTrack,
} from "@/test/fixtures.ts";

/**
 * HOW TO READ A TEST FILE (first one on the flight — take a minute here):
 *
 * describe(...) groups tests for one function. it(...) is one behavior,
 * named as a plain-English sentence. Inside, the pattern is always
 * arrange (build inputs) → act (call the function) → assert (expect(...)).
 *
 * `describe.skip` means "don't run these yet" — they're specs for YOUR
 * TURN pieces. Your loop: delete the `.skip`, run `npm test`, watch it fail
 * RED, implement until GREEN. Red-first matters: it proves the test can
 * fail, so green actually means something.
 */

// One track used across tests: two modules, three lessons, in this order:
//   m1: [l1, l2]   m2: [l3]
const track = makeTrack("t-demo", [
  makeModule("m1", [makeLesson("l1"), makeLesson("l2")]),
  makeModule("m2", [makeLesson("l3")]),
]);

describe("nextLessonInTrack (worked example)", () => {
  it("returns the first lesson when nothing is completed", () => {
    const progress = makeProgress();
    expect(nextLessonInTrack(track, progress)?.id).toBe("l1");
  });

  it("skips completed lessons, crossing module boundaries", () => {
    const progress = makeProgress({
      tracks: {
        "t-demo": {
          completedLessonIds: ["l1", "l2"],
          lastActiveAt: 0,
        },
      },
    });
    expect(nextLessonInTrack(track, progress)?.id).toBe("l3");
  });

  it("returns null when every lesson is done", () => {
    const progress = makeProgress({
      tracks: {
        "t-demo": {
          completedLessonIds: ["l1", "l2", "l3"],
          lastActiveAt: 0,
        },
      },
    });
    expect(nextLessonInTrack(track, progress)).toBeNull();
  });
});

/* YOUR TURN #1 — delete `.skip` when you start continueSuggestion. */
describe.skip("continueSuggestion", () => {
  const trackA = makeTrack("track-a", [
    makeModule("ma", [makeLesson("a1"), makeLesson("a2")]),
  ]);
  const trackB = makeTrack("track-b", [
    makeModule("mb", [makeLesson("b1")]),
  ]);
  const topics = [makeTopic("topic-a", [trackA]), makeTopic("topic-b", [trackB])];

  it("resumes from lastPosition when that track has a next lesson", () => {
    const progress = makeProgress({
      lastPosition: { topicId: "topic-a", trackId: "track-a" },
      tracks: {
        "track-a": { completedLessonIds: ["a1"], lastActiveAt: 0 },
      },
    });

    const suggestion = continueSuggestion(topics, progress);
    expect(suggestion).not.toBeNull();
    expect(suggestion?.topicId).toBe("topic-a");
    expect(suggestion?.trackId).toBe("track-a");
    expect(suggestion?.lesson.id).toBe("a2");
  });

  it("falls back to the first unfinished track when lastPosition is finished", () => {
    const progress = makeProgress({
      lastPosition: { topicId: "topic-a", trackId: "track-a" },
      tracks: {
        "track-a": { completedLessonIds: ["a1", "a2"], lastActiveAt: 0 },
      },
    });

    const suggestion = continueSuggestion(topics, progress);
    expect(suggestion?.topicId).toBe("topic-b");
    expect(suggestion?.lesson.id).toBe("b1");
  });

  it("suggests the very first lesson for a brand-new user (no lastPosition)", () => {
    const suggestion = continueSuggestion(topics, makeProgress());
    expect(suggestion?.topicId).toBe("topic-a");
    expect(suggestion?.lesson.id).toBe("a1");
  });

  it("returns null when every track everywhere is complete", () => {
    const progress = makeProgress({
      tracks: {
        "track-a": { completedLessonIds: ["a1", "a2"], lastActiveAt: 0 },
        "track-b": { completedLessonIds: ["b1"], lastActiveAt: 0 },
      },
    });
    expect(continueSuggestion(topics, progress)).toBeNull();
  });
});

/* YOUR TURN #6 — delete `.skip` when you start trackCompletionSummary. */
describe.skip("trackCompletionSummary", () => {
  it("counts lessons across all modules", () => {
    expect(trackCompletionSummary(track, makeProgress())).toEqual({
      completed: 0,
      total: 3,
    });
  });

  it("counts only completed ids that belong to this track", () => {
    const progress = makeProgress({
      tracks: {
        "t-demo": {
          // "ghost" was removed from the curriculum — it must not count.
          completedLessonIds: ["l1", "l3", "ghost"],
          lastActiveAt: 0,
        },
      },
    });
    expect(trackCompletionSummary(track, progress)).toEqual({
      completed: 2,
      total: 3,
    });
  });
});

/* YOUR TURN #2 — delete `.skip` when you start nextDrillLevel. */
describe.skip("nextDrillLevel", () => {
  it("moves up a level on a strong score (>= 0.8)", () => {
    expect(nextDrillLevel(3, 0.8)).toBe(4);
    expect(nextDrillLevel(3, 0.95)).toBe(4);
  });

  it("moves down a level on a weak score (< 0.5)", () => {
    expect(nextDrillLevel(3, 0.49)).toBe(2);
    expect(nextDrillLevel(3, 0)).toBe(2);
  });

  it("stays put in the productive-struggle zone", () => {
    expect(nextDrillLevel(3, 0.5)).toBe(3);
    expect(nextDrillLevel(3, 0.79)).toBe(3);
  });

  it("never drops below level 1", () => {
    expect(nextDrillLevel(1, 0)).toBe(1);
  });
});
