import { useEffect, useState } from "react";
import type { ActivityProps } from "@/activities/registry.tsx";
import { generateSequence } from "@/activities/gameLogic.ts";
import { TodoCard } from "@/activities/TodoCard.tsx";

/**
 * Sequence-recall: cells light up in order on a 3×3 grid; repeat the order
 * from memory. Provided — your piece is generateSequence, YOUR TURN #13 in
 * gameLogic.ts (the game shows a TodoCard until it exists).
 */
export function SequenceRecallActivity({
  activity,
  onResult,
}: ActivityProps<"sequence-recall">) {
  const [phase, setPhase] = useState<"idle" | "showing" | "input" | "done">(
    "idle",
  );
  const [sequence, setSequence] = useState<number[]>([]);
  const [showIndex, setShowIndex] = useState(0);
  const [inputIndex, setInputIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [todo, setTodo] = useState<string | null>(null);

  function start() {
    try {
      setSequence(generateSequence(activity.length, Math.random));
    } catch (error) {
      setTodo(error instanceof Error ? error.message : String(error));
      return;
    }
    setShowIndex(0);
    setInputIndex(0);
    setFailed(false);
    setPhase("showing");
  }

  // Playback: light each cell in turn, then hand over to the player.
  useEffect(() => {
    if (phase !== "showing") return;
    const timer = setTimeout(() => {
      if (showIndex + 1 >= sequence.length) setPhase("input");
      else setShowIndex(showIndex + 1);
    }, activity.speedMs);
    return () => clearTimeout(timer);
  }, [phase, showIndex, sequence.length, activity.speedMs]);

  function onCellClick(cell: number) {
    if (phase !== "input") return;
    if (cell === sequence[inputIndex]) {
      if (inputIndex + 1 >= sequence.length) {
        setPhase("done");
        onResult?.(true);
      } else {
        setInputIndex(inputIndex + 1);
      }
    } else {
      setFailed(true);
      setPhase("done");
      onResult?.(false);
    }
  }

  if (todo) return <TodoCard message={todo} />;

  if (phase === "idle" || phase === "done") {
    return (
      <div className="space-y-3">
        <p className="font-medium">
          {phase === "idle"
            ? `Watch ${activity.length} cells light up, then repeat the order.`
            : failed
              ? `Not quite — you got ${inputIndex} of ${sequence.length}.`
              : "Perfect recall! 🔥"}
        </p>
        <button
          type="button"
          onClick={start}
          className="rounded-lg bg-accent-strong px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent"
        >
          {phase === "idle" ? "Start" : "Play again"}
        </button>
      </div>
    );
  }

  const litCell = phase === "showing" ? sequence[showIndex] : null;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        {phase === "showing"
          ? "Watch…"
          : `Your turn — ${inputIndex} / ${sequence.length}`}
      </p>
      <div className="grid w-fit grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, cell) => (
          <button
            key={cell}
            type="button"
            onClick={() => onCellClick(cell)}
            disabled={phase !== "input"}
            className={[
              "size-16 rounded-lg border transition-colors",
              cell === litCell
                ? "border-accent bg-accent-strong"
                : "border-border bg-surface hover:bg-surface-raised",
            ].join(" ")}
            aria-label={`Cell ${cell + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
