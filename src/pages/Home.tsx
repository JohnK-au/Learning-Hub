import { Link } from "react-router-dom";
import { topics } from "@/content/index.ts";
import { continueSuggestion } from "@/engine/selection.ts";
import { useProgress } from "@/hooks/useProgress.ts";
import { useStreak } from "@/hooks/useStreak.ts";
import { useDueReviews } from "@/hooks/useDueReviews.ts";
import { Unbuilt } from "@/components/ErrorBoundary.tsx";

/**
 * Home — streak, the "Continue" suggestion, and due reviews.
 * The last two are wrapped in <Unbuilt>: they render wrench cards until
 * YOUR TURN #1 (continueSuggestion) and #4+#7 (due reviews) are finished.
 */
export default function Home() {
  const streak = useStreak();
  const { state } = useProgress();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted">
          A couple of minutes is all it takes. Pick up where you left off, or
          explore a topic.
        </p>
      </div>

      {!state.preferences && (
        <Link
          to="/onboarding"
          className="block rounded-card border border-accent/40 bg-surface p-4 text-sm transition-colors hover:bg-surface-raised"
        >
          ✨ First time? <span className="text-accent">Set your learning
          preferences</span> — 30 seconds, shapes how lessons are presented.
        </Link>
      )}

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
      </div>

      <Unbuilt feature="Continue where you left off">
        <ContinueCard />
      </Unbuilt>

      <Unbuilt feature="Reviews due today">
        <ReviewsCard />
      </Unbuilt>

      <Link
        to="/topics"
        className="block rounded-card border border-border bg-surface p-4 text-sm text-muted transition-colors hover:bg-surface-raised"
      >
        Browse all topics →
      </Link>
    </section>
  );
}

function ContinueCard() {
  const { state } = useProgress();
  const suggestion = continueSuggestion(topics, state);

  if (!suggestion) {
    return (
      <div className="rounded-card border border-border bg-surface p-5">
        <p className="text-sm text-muted">
          Everything is complete — add more content to keep going.
        </p>
      </div>
    );
  }

  return (
    <Link
      to={`/learn/${suggestion.trackId}`}
      className="block rounded-card border border-accent/40 bg-surface p-5 transition-colors hover:bg-surface-raised"
    >
      <p className="text-xs uppercase tracking-wide text-faint">Continue</p>
      <p className="mt-1 font-semibold">{suggestion.lesson.title}</p>
      <p className="mt-1 text-sm text-muted">
        ~{suggestion.lesson.estimatedMinutes} min · pick up where you left off
      </p>
    </Link>
  );
}

function ReviewsCard() {
  const due = useDueReviews();
  if (due.length === 0) {
    return (
      <div className="rounded-card border border-border bg-surface p-5">
        <p className="text-sm text-muted">No reviews due today. 🎉</p>
      </div>
    );
  }
  return (
    <div className="rounded-card border border-warning/40 bg-surface p-5">
      <p className="text-sm font-medium">
        {due.length} review{due.length === 1 ? "" : "s"} due today
      </p>
      <p className="mt-1 text-sm text-faint">
        Reviewing just before you forget is what makes memories stick.
      </p>
    </div>
  );
}
