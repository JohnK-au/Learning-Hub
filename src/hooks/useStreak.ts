import { useProgress } from "@/hooks/useProgress.ts";

/**
 * Returns just the streak portion of progress.
 *
 * This is a "selector" hook: it doesn't re-implement any subscription logic —
 * it builds on useProgress and hands back one slice. Small focused hooks like
 * this keep components readable (`const streak = useStreak()`) and mean the
 * store wiring lives in exactly one place.
 */

// --- YOUR TURN -----------------------------------------------------------
//
// A React hook is just a function whose name starts with "use" and which calls
// other hooks. Implement useStreak:
//
//   1. Call useProgress() to get the current progress. It returns an object
//      with a `state` property, so you can pull `state` out of it with
//      destructuring:  const { state } = useProgress();
//      (Destructuring = "reach into the returned object and grab the `state`
//       field into its own variable" — same `{ }` shape you used in mutators.)
//
//   2. Return the streak slice of that state: state.streak
//
// The return type is already declared for you below — your body just needs to
// produce a value that matches it.



export function useStreak(): { current: number; longest: number; lastActiveDate: string | null } {
  const { state } = useProgress();
  return state.streak;
}
