import { Link, useParams } from "react-router-dom";
import type { Track } from "@/schema/schema.ts";
import { getTopic } from "@/content/index.ts";
import { trackCompletionSummary } from "@/engine/selection.ts";
import { useProgress } from "@/hooks/useProgress.ts";
import { useTrackProgress } from "@/hooks/useTrackProgress.ts";
import { Unbuilt } from "@/components/ErrorBoundary.tsx";

/**
 * TopicDetail — one topic's curriculum map at /topic/:topicId.
 * The lesson list always renders; the progress decorations (summary line,
 * ✓ marks) depend on YOUR TURN #6 and #8 and light up when those are done.
 */
export default function TopicDetail() {
  const { topicId } = useParams();
  const topic = topicId ? getTopic(topicId) : undefined;

  if (!topic) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Topic not found
        </h1>
        <Link to="/topics" className="text-accent underline">
          Browse topics
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-3xl" aria-hidden>
          {topic.icon}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {topic.title}
        </h1>
        <p className="mt-1 text-muted">{topic.blurb}</p>
      </header>

      {topic.tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </section>
  );
}

function TrackCard({ track }: { track: Track }) {
  return (
    <div className="space-y-4 rounded-card border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">{track.title}</h2>
          <Unbuilt feature="Progress summary">
            <TrackSummary track={track} />
          </Unbuilt>
        </div>
        <Link
          to={`/learn/${track.id}`}
          className="shrink-0 rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent"
        >
          Continue →
        </Link>
      </div>

      <Unbuilt feature="Lesson checkmarks">
        <LessonList track={track} />
      </Unbuilt>
    </div>
  );
}

function TrackSummary({ track }: { track: Track }) {
  const { state } = useProgress();
  const { completed, total } = trackCompletionSummary(track, state);
  return (
    <p className="text-sm text-faint">
      {completed} / {total} lessons
    </p>
  );
}

function LessonList({ track }: { track: Track }) {
  const { completedLessonIds } = useTrackProgress(track.id);
  const done = new Set(completedLessonIds);

  return (
    <div className="space-y-3">
      {track.modules.map((module) => (
        <div key={module.id}>
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            {module.title}
          </p>
          <ul className="mt-1 space-y-1">
            {module.lessons.map((lesson) => (
              <li key={lesson.id} className="flex items-center gap-2 text-sm">
                <span
                  className={done.has(lesson.id) ? "text-success" : "text-faint"}
                  aria-hidden
                >
                  {done.has(lesson.id) ? "✓" : "○"}
                </span>
                <span className={done.has(lesson.id) ? "text-muted" : ""}>
                  {lesson.title}
                </span>
                <span className="ml-auto text-xs text-faint">
                  ~{lesson.estimatedMinutes}m
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
