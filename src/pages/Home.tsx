/**
 * Home — placeholder for Stage 1. Will host the "Continue" suggestion,
 * streak, due reviews, and the topic grid once the engine and content land.
 */
export default function Home() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted">
          A couple of minutes is all it takes. Pick up where you left off, or
          explore a topic.
        </p>
      </div>

      <div className="rounded-card border border-border bg-surface p-6">
        <p className="text-sm text-faint">
          Scaffold ready. Continue-suggestion, streak, and topic grid arrive in
          later stages.
        </p>
      </div>
    </section>
  );
}
