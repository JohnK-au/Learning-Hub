import { describe, it, expect } from "vitest";
import {
  generateSequence,
  isNBackMatch,
  randomInt,
  scorePattern,
  type Rng,
} from "@/activities/gameLogic.ts";

/** A fake rng that returns scripted values in order — determinism in tests. */
function fakeRng(values: number[]): Rng {
  let i = 0;
  return () => values[i++ % values.length];
}

describe("randomInt (provided)", () => {
  it("maps rng output into [0, max)", () => {
    expect(randomInt(() => 0, 9)).toBe(0);
    expect(randomInt(() => 0.999, 9)).toBe(8);
    expect(randomInt(() => 0.5, 4)).toBe(2);
  });
});

/* YOUR TURN #12 — delete `.skip` when you start isNBackMatch. */
describe("isNBackMatch", () => {
  const seq = ["A", "B", "A", "C", "C"];

  it("detects a true n-back match", () => {
    expect(isNBackMatch(seq, 2, 2)).toBe(true); // "A" ... "A"
  });

  it("rejects a non-match", () => {
    expect(isNBackMatch(seq, 3, 2)).toBe(false); // "B" vs "C"
  });

  it("a 1-back repeat is not a 2-back match", () => {
    expect(isNBackMatch(seq, 4, 2)).toBe(false); // "C","C" adjacent
    expect(isNBackMatch(seq, 4, 1)).toBe(true);
  });

  it("returns false when there is nothing n steps back", () => {
    expect(isNBackMatch(seq, 0, 2)).toBe(false);
    expect(isNBackMatch(seq, 1, 2)).toBe(false);
  });
});

/* YOUR TURN #13 — delete `.skip` when you start generateSequence. */
describe("generateSequence", () => {
  it("produces the requested length with scripted rng values", () => {
    // 0.0→cell 0, 0.5→cell 4, 0.99→cell 8 …
    const rng = fakeRng([0.0, 0.5, 0.99]);
    expect(generateSequence(3, rng)).toEqual([0, 4, 8]);
  });

  it("re-rolls when two consecutive cells would repeat", () => {
    // First pick: 0.5 → 4. Second pick: 0.5 → 4 again (repeat — must re-roll),
    // then 0.0 → 0. Result: [4, 0], and the scripted repeat was skipped.
    const rng = fakeRng([0.5, 0.5, 0.0]);
    expect(generateSequence(2, rng)).toEqual([4, 0]);
  });

  it("never produces two identical neighbours (random spot-check)", () => {
    const seq = generateSequence(50, Math.random);
    for (let i = 1; i < seq.length; i++) {
      expect(seq[i]).not.toBe(seq[i - 1]);
    }
  });
});

/* YOUR TURN #14 — delete `.skip` when you start scorePattern. */
describe("scorePattern", () => {
  it("full marks for a perfect answer", () => {
    expect(scorePattern([1, 4, 7], [1, 4, 7])).toBe(1);
  });

  it("partial credit for partial recall", () => {
    expect(scorePattern([1, 4], [1, 4, 7])).toBeCloseTo(2 / 3);
  });

  it("wrong picks earn nothing", () => {
    expect(scorePattern([2, 3, 5], [1, 4, 7])).toBe(0);
  });

  it("handles the empty cases", () => {
    expect(scorePattern([], [1, 2])).toBe(0);
    expect(scorePattern([1], [])).toBe(0); // no divide-by-zero
  });
});
