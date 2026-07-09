import { useEffect, useState } from "react";
import type { ActivityProps } from "@/activities/registry.tsx";
import { randomInt, scorePattern } from "@/activities/gameLogic.ts";
import { TodoCard } from "@/activities/TodoCard.tsx";

/**
 * Pattern-recognition: target cells flash briefly on a grid; mark where they
 * were. Provided — your piece is the scoring, scorePattern, YOUR TURN #14 in
 * gameLogic.ts (results show a TodoCard until it exists).
 */
export function PatternRecognitionActivity({
  activity,
  onResult,
}: ActivityProps<"pattern-recognition">) {
  const cellCount = activity.gridSize * activity.gridSize;
  const [phase, setPhase] = useState<"idle" | "flash" | "input" | "done">(
    "idle",
  );
  const [targets, setTargets] = useState<number[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [todo, setTodo] = useState<string | null>(null);

  function start() {
    // Distinct random cells: keep adding until we have enough (a Set can't
    // hold duplicates, so collisions just don't grow it).
    const picked = new Set<number>();
    while (picked.size < Math.min(activity.targets, cellCount)) {
      picked.add(randomInt(Math.random, cellCount));
    }
    setTargets([...picked]);
    setSelected(new Set());
    setPhase("flash");
  }

  // Hide the targets after flashMs.
  useEffect(() => {
    if (phase !== "flash") return;
    const timer = setTimeout(() => setPhase("input"), activity.flashMs);
    return () => clearTimeout(timer);
  }, [phase, activity.flashMs]);

  function toggle(cell: number) {
    if (phase !== "input") return;
    const next = new Set(selected);
    if (next.has(cell)) next.delete(cell);
    else next.add(cell);
    setSelected(next);
  }

  function submit() {
    try {
      const s = scorePattern([...selected], targets);
      setScore(s);
      setPhase("done");
      onResult?.(s >= 0.6);
    } catch (error) {
      setTodo(error instanceof Error ? error.message : String(error));
    }
  }

  if (todo) return <TodoCard message={todo} />;

  if (phase === "idle") {
    return (
      <div className="space-y-3">
        <p className="font-medium">
          {activity.targets} cells will flash for{" "}
          {(activity.flashMs / 1000).toFixed(1)}s — remember where they are.
        </p>
        <button type="button" onClick={start} className={buttonPrimary}>
          Start
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {phase === "done" ? (
        <p className="font-medium">
          Score: {Math.round(score * 100)}%{" "}
          {score === 1 ? "— flawless! 🔥" : score >= 0.6 ? "— solid." : "— again!"}
        </p>
      ) : (
        <p className="text-sm text-muted">
          {phase === "flash" ? "Memorize…" : "Mark the cells, then check."}
        </p>
      )}

      <div
        className="grid w-fit gap-2"
        style={{
          gridTemplateColumns: `repeat(${activity.gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: cellCount }, (_, cell) => {
          const showAsTarget =
            (phase === "flash" || phase === "done") && targets.includes(cell);
          const isPicked = selected.has(cell);
          return (
            <button
              key={cell}
              type="button"
              onClick={() => toggle(cell)}
              disabled={phase !== "input"}
              className={[
                "size-12 rounded-lg border transition-colors",
                showAsTarget
                  ? "border-accent bg-accent-strong"
                  : isPicked
                    ? "border-warning bg-warning/30"
                    : "border-border bg-surface hover:bg-surface-raised",
              ].join(" ")}
              aria-label={`Cell ${cell + 1}`}
            />
          );
        })}
      </div>

      {phase === "input" && (
        <button type="button" onClick={submit} className={buttonPrimary}>
          Check ({selected.size} marked)
        </button>
      )}
      {phase === "done" && (
        <button type="button" onClick={start} className={buttonSecondary}>
          Play again
        </button>
      )}
    </div>
  );
}

const buttonPrimary =
  "rounded-lg bg-accent-strong px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent";
const buttonSecondary =
  "rounded-lg border border-border bg-surface px-5 py-2.5 text-sm transition-colors hover:bg-surface-raised";
