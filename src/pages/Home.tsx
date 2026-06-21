import { useProgress } from "@/hooks/useProgress.ts";
import { useStreak } from "@/hooks/useStreak.ts";

/**
 * Home — shows the live streak (powered by your useStreak hook). The
 * "Continue" suggestion, due reviews, and topic grid arrive in later stages.
 *
 * The "Mark a day" button is a temporary control so you can watch the streak
 * update + persist end-to-end; it'll be replaced by real session completion.
 */
export default function Home() {
  const streak = useStreak();
  const { update } = useProgress();

  function markToday() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    update((state) => {
      if (state.streak.lastActiveDate === today) return state; // already counted today
      const current = state.streak.current + 1;
      return {
        ...state,
        streak: {
          current,
          longest: Math.max(current, state.streak.longest),
          lastActiveDate: today,
        },
      };
    });
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted">
          A couple of minutes is all it takes. Pick up where you left off, or
          explore a topic.
        </p>
      </div>

      <div className="rounded-card border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-faint">Current streak</p>
            <p className="mt-1 text-4xl font-semibold tabular-nums">
              {streak.current}
              <span className="ml-2 text-lg font-normal text-muted">
                {streak.current === 1 ? "day" : "days"}
              </span>
            </p>
            <p className="mt-1 text-sm text-faint">
              Longest: {streak.longest} ·{" "}
              {streak.lastActiveDate ?? "no sessions yet"}
            </p>
          </div>
          <span className="text-4xl" aria-hidden>
            {streak.current > 0 ? "🔥" : "✨"}
          </span>
        </div>

        <button
          type="button"
          onClick={markToday}
          className="mt-5 rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent"
        >
          Mark today (temporary)
        </button>
      </div>
    </section>
  );
}
