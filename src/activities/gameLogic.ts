/**
 * PURE GAME LOGIC for the brain-training activities.
 *
 * The components in this folder handle timers, clicks, and rendering (the
 * fiddly, hard-to-test parts — provided for you). The DECISIONS — "was that
 * a match?", "what sequence comes next?", "what's the score?" — live here as
 * pure functions, because decisions are what deserve tests.
 *
 * Note how randomness is handled: functions that need it take an `rng`
 * PARAMETER — a function returning 0 ≤ x < 1. The game passes Math.random;
 * a test passes a fake with known values. Same trick as injecting `today`
 * into the scheduler: push the unpredictable thing out to the caller, and
 * the function stays a vending machine.
 */
export type Rng = () => number;

/**
 * PROVIDED — pick a random integer in [0, max), given an rng.
 * randomInt(Math.random, 9) → 0..8.
 */
export function randomInt(rng: Rng, max: number): number {
  return Math.floor(rng() * max);
}

/* ------------------------------------------------------------------------ *
 * YOUR TURN #12 — isNBackMatch
 * ------------------------------------------------------------------------ *
 * In an n-back game, a stream of symbols appears one at a time, and the
 * player answers one question per symbol: is it the SAME as the symbol
 * exactly n steps earlier?
 *
 *   sequence ["A","B","A","C","C"], n = 2:
 *     index 2 ("A") → 2 steps back is index 0 ("A") → match! true
 *     index 3 ("C") → index 1 is "B"               → false
 *     index 4 ("C") → index 2 is "A"               → false (1 back ≠ 2 back)
 *
 * Return whether sequence[index] equals sequence[index - n]. One guard: if
 * index - n is before the start of the array, there is nothing to compare —
 * return false.
 *
 * Verify: unskip `describe.skip("isNBackMatch", ...)` in gameLogic.test.ts.
 */
export function isNBackMatch(
  sequence: string[],
  index: number,
  n: number,
): boolean {
  if (index - n < 0) return false;
  return sequence[index] === sequence[index - n];
}

/* ------------------------------------------------------------------------ *
 * YOUR TURN #13 — generateSequence
 * ------------------------------------------------------------------------ *
 * Sequence-recall shows a series of cells lighting up on a 3×3 grid (cells
 * numbered 0–8); the player repeats it from memory. Produce that series:
 * an array of `length` cell numbers, each picked with randomInt(rng, 9).
 *
 * One rule: no two CONSECUTIVE cells the same (a repeat reads as one long
 * flash — confusing). If the cell you just picked equals the previous one,
 * pick again until it doesn't (a small while loop).
 *
 * Build it with a plain loop pushing into an array — you've seen the shape
 * in nextLessonInTrack.
 *
 * Verify: unskip `describe.skip("generateSequence", ...)` in
 * gameLogic.test.ts — the tests feed a FAKE rng with scripted values, so
 * they know exactly what your function should produce.
 */
export function generateSequence(length: number, rng: Rng): number[] {
  const sequence: number[] = [];
  for (let i = 0; i < length; i++) {
    let cell = randomInt(rng, 9);
    while (cell === sequence[i - 1]) {
      cell = randomInt(rng, 9);
    }
    sequence.push(cell);
  }
  return sequence;
}

/* ------------------------------------------------------------------------ *
 * YOUR TURN #14 — scorePattern
 * ------------------------------------------------------------------------ *
 * Pattern-recognition flashes some target cells, hides them, and the player
 * clicks where they were. Score the answer from 0 to 1:
 *
 *   score = correctPicks / targets.length
 *   where correctPicks = how many of `selected` are actually in `targets`.
 *
 * Wrong extra picks don't earn points (they just fail to add); an empty
 * selection scores 0. Guard: if targets is empty, return 0 rather than
 * dividing by zero.
 *
 * A Set of targets + a loop (or .filter) over selected does it — the same
 * Set-membership trick from the worked example in selection.ts.
 *
 * Verify: unskip `describe.skip("scorePattern", ...)` in gameLogic.test.ts.
 */
export function scorePattern(selected: number[], targets: number[]): number {
  if (targets.length === 0) return 0;
  const targetSet = new Set(targets);
  const correct = selected.filter((cell) => targetSet.has(cell)).length;
  return correct / targets.length;
}
