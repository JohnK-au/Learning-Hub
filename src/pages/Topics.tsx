import { Link } from "react-router-dom";
import { topics } from "@/content/index.ts";

/** Topics — the library. One card per topic, straight from the content data. */
export default function Topics() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Topics</h1>
        <p className="text-muted">Pick a curriculum to work through.</p>
      </div>

      {topics.length === 0 ? (
        <p className="text-sm text-faint">
          No topics registered yet — add one in src/content/index.ts.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/topic/${topic.id}`}
              className="rounded-card border border-border bg-surface p-5 transition-colors hover:bg-surface-raised"
            >
              <p className="text-2xl" aria-hidden>
                {topic.icon}
              </p>
              <h2 className="mt-2 font-semibold">{topic.title}</h2>
              <p className="mt-1 text-sm text-muted">{topic.blurb}</p>
              <p className="mt-2 text-xs text-faint">
                {topic.tracks.length} track
                {topic.tracks.length === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
