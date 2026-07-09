import { useEffect, useMemo, useState } from "react";
import type { ActivityProps } from "@/activities/registry.tsx";
import { isNBackMatch, randomInt } from "@/activities/gameLogic.ts";
import { TodoCard } from "@/activities/TodoCard.tsx";

const LETTERS = ["A", "E", "K", "M", "R", "T"];

/**
 * N-back working-memory game (provided — the timers and phases are the
 * fiddly part). Your piece is the judgment call it depends on:
 * isNBackMatch, YOUR TURN #12 in gameLogic.ts. Until that's done, the game
 * shows a TodoCard instead of starting.
 */
export function NBackActivity({
  activity,
  onResult,
}: ActivityProps<"n-back">) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [sequence, setSequence] = useState<string[]>([]);
  const [position, setPosition] = useState(0);
  const [pressed, setPressed] = useState<Set<number>>(new Set());
  const [todo, setTodo] = useState<string | null>(null);

  function start() {
    // Build a stream with deliberate matches (~1 in 3) so there's something
    // to find; pure chance alone would make matches rare and the game dull.
    const seq: string[] = [];
    for (let i = 0; i < activity.trials; i++) {
      const forceMatch = i >= activity.n && Math.random() < 0.34;
      seq.push(
        forceMatch
          ? seq[i - activity.n]
          : LETTERS[randomInt(Math.random, LETTERS.length)],
      );
    }
    // Probe the user's judgment fn once up front: if it's still a TODO we
    // find out now (TodoCard) rather than mid-game.
    try {
      isNBackMatch(seq, activity.n, activity.n);
    } catch (error) {
      setTodo(error instanceof Error ? error.message : String(error));
      return;
    }
    setSequence(seq);
    setPressed(new Set());
    setPosition(0);
    setPhase("playing");
  }

  // Advance the stream one letter per interval while playing.
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setTimeout(() => {
      if (position + 1 >= sequence.length) setPhase("done");
      else setPosition(position + 1);
    }, activity.intervalMs);
    return () => clearTimeout(timer); // cleanup if we re-render or unmount
  }, [phase, position, sequence.length, activity.intervalMs]);

  const score = useMemo(() => {
    if (phase !== "done") return 0;
    let correct = 0;
    for (let i = 0; i < sequence.length; i++) {
      const shouldPress = isNBackMatch(sequence, i, activity.n);
      if (shouldPress === pressed.has(i)) correct++;
    }
    const s = correct / sequence.length;
    onResult?.(s >= 0.6);
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (todo) return <TodoCard message={todo} />;

  if (phase === "idle") {
    return (
      <div className="space-y-3">
        <p className="font-medium">
          {activity.n}-back: press Match when the letter equals the one{" "}
          {activity.n} steps earlier.
        </p>
        <button type="button" onClick={start} className={buttonPrimary}>
          Start ({activity.trials} letters)
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="space-y-3">
        <p className="font-medium">
          Score: {Math.round(score * 100)}%{" "}
          {score >= 0.6 ? "— sharp! 🔥" : "— tricky, run it again."}
        </p>
        <button type="button" onClick={start} className={buttonSecondary}>
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <p className="text-6xl font-semibold tabular-nums">{sequence[position]}</p>
      <p className="text-xs text-faint">
        {position + 1} / {sequence.length}
      </p>
      <button
        type="button"
        disabled={pressed.has(position)}
        onClick={() => setPressed(new Set(pressed).add(position))}
        className={buttonPrimary}
      >
        Match!
      </button>
    </div>
  );
}

const buttonPrimary =
  "rounded-lg bg-accent-strong px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent disabled:opacity-50";
const buttonSecondary =
  "rounded-lg border border-border bg-surface px-5 py-2.5 text-sm transition-colors hover:bg-surface-raised";
