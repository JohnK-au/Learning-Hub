import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Lesson, Topic, Track } from "@/schema/schema.ts";
import { findTrack } from "@/content/index.ts";
import { nextLessonInTrack } from "@/engine/selection.ts";
import { completeLesson, shouldShowBlock } from "@/engine/session.ts";
import { useProgress } from "@/hooks/useProgress.ts";
import { BlockRenderer } from "@/components/BlockRenderer.tsx";

/**
 * SessionPlayer — runs one lesson at /learn/:trackId.
 *
 * Flow: pick the next uncompleted lesson in the track → reveal its blocks
 * one at a time (progressive disclosure keeps attention on one idea) →
 * "Finish lesson" records progress via the engine → offer the next lesson.
 *
 * Note the key={lesson.id} below: when the lesson changes, React throws away
 * the old <LessonView> (with its "how far have I read" state) and mounts a
 * fresh one — that's how the view resets between lessons without any manual
 * cleanup code.
 */
export default function SessionPlayer() {
  const { trackId } = useParams();
  const { state } = useProgress();

  const found = trackId ? findTrack(trackId) : undefined;
  if (!found) {
    return (
      <EmptyCard title="Track not found">
        <Link to="/topics" className="text-accent underline">
          Browse topics
        </Link>
      </EmptyCard>
    );
  }

  const lesson = nextLessonInTrack(found.track, state);
  if (!lesson) {
    return (
      <EmptyCard title="Track complete 🎉">
        <p className="text-muted">
          Every lesson in “{found.track.title}” is done.
        </p>
        <Link to="/topics" className="text-accent underline">
          Pick another topic
        </Link>
      </EmptyCard>
    );
  }

  return (
    <LessonView
      key={lesson.id}
      topic={found.topic}
      track={found.track}
      lesson={lesson}
    />
  );
}

function LessonView({
  topic,
  track,
  lesson,
}: {
  topic: Topic;
  track: Track;
  lesson: Lesson;
}) {
  const { state, update } = useProgress();

  // Preferences filter (YOUR TURN #10). Until it's implemented we fall back
  // to showing everything — the safe default — via the catch.
  const blocks = lesson.blocks.filter((block) => {
    try {
      return shouldShowBlock(block, state.preferences);
    } catch {
      return true;
    }
  });

  // Progressive disclosure: how many blocks are revealed so far.
  const [visibleCount, setVisibleCount] = useState(1);
  const [finished, setFinished] = useState(false);
  const [todoNotice, setTodoNotice] = useState<string | null>(null);

  const allRevealed = visibleCount >= blocks.length;

  function onFinish() {
    const today = new Date().toISOString().slice(0, 10);
    try {
      // The impure world (this page) gathers date/clock and hands them to
      // the pure engine — then the store persists the result.
      update((s) =>
        completeLesson(s, {
          topicId: topic.id,
          trackId: track.id,
          lesson,
          today,
          now: Date.now(),
        }),
      );
      setFinished(true);
    } catch (error) {
      // completeLesson is YOUR TURN #5 — until then, explain instead of crash.
      setTodoNotice(error instanceof Error ? error.message : String(error));
    }
  }

  if (finished) {
    return (
      <EmptyCard title="Lesson complete ✓">
        <p className="text-muted">
          “{lesson.title}” is recorded — streak and reviews updated.
        </p>
        <Link
          to={`/learn/${track.id}`}
          className="inline-block rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-white"
        >
          Next lesson
        </Link>
        <Link to="/" className="ml-3 text-sm text-accent underline">
          Home
        </Link>
      </EmptyCard>
    );
  }

  return (
    <section className="space-y-5">
      <header>
        <p className="text-xs uppercase tracking-wide text-faint">
          {topic.title} · {track.title}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {lesson.title}
        </h1>
        <p className="mt-1 text-sm text-faint">
          ~{lesson.estimatedMinutes} min · {blocks.length} steps
        </p>
      </header>

      <div className="space-y-5">
        {blocks.slice(0, visibleCount).map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>

      {todoNotice && (
        <div className="rounded-card border border-dashed border-border bg-surface p-4">
          <p className="text-sm font-medium text-warning">
            🔧 Finishing a lesson isn’t wired up yet
          </p>
          <p className="mt-1 text-sm text-faint">{todoNotice}</p>
        </div>
      )}

      {allRevealed ? (
        <button
          type="button"
          onClick={onFinish}
          className="rounded-lg bg-accent-strong px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent"
        >
          Finish lesson
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setVisibleCount((n) => n + 1)}
          className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm transition-colors hover:bg-surface-raised"
        >
          Continue
        </button>
      )}
    </section>
  );
}

function EmptyCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-card border border-border bg-surface p-6">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      {children}
    </section>
  );
}
