import { useProgress } from "@/hooks/useProgress.ts";

/**
 * Selector hook: returns just the streak slice of progress. Builds on
 * useProgress so the store-subscription logic stays in one place.
 */
export function useStreak(): {
  current: number;
  longest: number;
  lastActiveDate: string | null;
} {
  const { state } = useProgress();
  return state.streak;
}
