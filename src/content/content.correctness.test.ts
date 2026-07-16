import { describe, it, expect } from "vitest";
import { topics } from "@/content/index.ts";
import type { Activity } from "@/schema/schema.ts";

/**
 * CONTENT CORRECTNESS — the semantic safety net.
 *
 * `validate-content` checks *mechanics* (valid permutations, in-range indices,
 * no duplicates). It CANNOT tell a wrong-but-valid answer from a right one —
 * that's what let the major-scale ordering ship with the wrong sequence.
 *
 * This file pins the *facts* for the graded activities: it asserts the correct
 * answer by a key concept (so ordinary copy-edits don't break it, but flipping
 * `answerIndex` or mis-indexing `correctOrder` does). Add a line here whenever
 * you author an activity whose answer you want guarded.
 */

// Index every activity by its lesson id.
const byLesson = new Map<string, Activity[]>();
for (const topic of topics)
  for (const track of topic.tracks)
    for (const mod of track.modules)
      for (const lesson of mod.lessons)
        byLesson.set(
          lesson.id,
          lesson.blocks
            .filter((b) => b.kind === "activity")
            .map(
              (b) => (b as Extract<typeof b, { kind: "activity" }>).activity,
            ),
        );

/** The text of the marked-correct choice in a lesson's multiple-choice. */
function correctChoice(lessonId: string): string {
  const a = byLesson.get(lessonId)?.find((x) => x.type === "multiple-choice");
  if (a?.type !== "multiple-choice") throw new Error(`no MC in ${lessonId}`);
  return a.choices[a.answerIndex];
}

/** The item labels in the order `correctOrder` actually produces. */
function correctSequence(lessonId: string): string[] {
  const a = byLesson.get(lessonId)?.find((x) => x.type === "ordering");
  if (a?.type !== "ordering") throw new Error(`no ordering in ${lessonId}`);
  return a.correctOrder.map((i) => a.items[i]);
}

/** The W/H step letters an ordering composes to (for music step-patterns). */
function stepLetters(lessonId: string): string {
  return (
    correctSequence(lessonId)
      .join(" ")
      .toLowerCase()
      .match(/whole|half/g) ?? []
  )
    .map((w) => (w === "whole" ? "W" : "H"))
    .join("");
}

describe("multiple-choice answers point at the right concept", () => {
  it("music: E–F is the half-step pair", () => {
    expect(correctChoice("mt-twelve-notes")).toMatch(/E and F/i);
  });
  it("cog-sci: memory fades fastest right after learning", () => {
    expect(correctChoice("lal-forgetting-curve")).toMatch(/right after/i);
  });
  it("history: client armies undermined the Republic", () => {
    expect(correctChoice("hist-eu-republic-falls")).toMatch(/general/i);
  });
  it("history: the Han recruited on merit, not birth", () => {
    expect(correctChoice("hist-cn-han-exam")).toMatch(/merit/i);
  });
  it("history: warrior families took real power in Heian Japan", () => {
    expect(correctChoice("hist-jp-heian-court")).toMatch(/warrior/i);
  });
  it("game theory: eating alone is not a game", () => {
    expect(correctChoice("gt-what-is-a-game")).toMatch(/alone at home/i);
  });
});

describe("ordering answers compose to the correct sequence", () => {
  it("music: the major scale is W W H W W W H", () => {
    // The fact itself — a hard invariant, robust to relabelling.
    expect(stepLetters("mt-major-scale")).toBe("WWHWWWH");
  });

  it("study methods run highlight → reread → spaced self-test", () => {
    const seq = correctSequence("lal-retrieval-practice");
    expect(seq[0]).toMatch(/highlight/i);
    expect(seq[seq.length - 1]).toMatch(/self-test/i);
  });

  it("Roman milestones are in chronological order", () => {
    const seq = correctSequence("hist-eu-fall-of-rome");
    expect(seq[0]).toMatch(/rubicon/i);
    expect(seq[seq.length - 1]).toMatch(/constantinople/i);
  });
});
