import { useState } from "react";
import type { ActivityProps } from "@/activities/registry.tsx";

/**
 * Put-these-in-order activity (chronologies, scales, process steps).
 *
 * --- YOUR TURN #11 — your first full component, from scratch ---
 *
 * This is the capstone of what you practiced in MultipleChoiceActivity and
 * RecallActivity — open those two side by side as references; every tool you
 * need appears in one of them.
 *
 * HOW IT SHOULD BEHAVE
 *   1. Show `activity.prompt`.
 *   2. Show a button per item (activity.items). Tapping an item appends its
 *      INDEX to the player's picked list and disables that button (a picked
 *      item can't be picked twice). Show the running order they've built so
 *      far (e.g. numbered, or a joined string).
 *   3. When picked.length === activity.items.length, the answer is complete:
 *      compare picked against activity.correctOrder and show right/wrong plus
 *      `activity.explanation` (look at how MC shows its explanation).
 *   4. Call `onResult?.(isCorrect)` exactly once when the answer completes.
 *
 * THE PIECES
 *   - State: const [picked, setPicked] = useState<number[]>([]);
 *     Appending WITHOUT mutating (same rule as the store):
 *       setPicked([...picked, index]);
 *   - "Is this index already picked?" → picked.includes(index) — that's your
 *     `disabled` prop for each button.
 *   - Comparing two arrays: `===` compares IDENTITY, not contents(!) — the
 *     simplest content-compare here is
 *       picked.join(",") === activity.correctOrder.join(",")
 *   - Rendering the items: activity.items.map((item, index) => ...), exactly
 *     like the choices loop in MultipleChoiceActivity — copy its <li>/<button>
 *     structure and classNames for the styling.
 *
 * WHEN IT WORKS — register it (your Open/Closed rep):
 *   In registry.tsx: import { OrderingActivity } from "./OrderingActivity.tsx"
 *   and add   ordering: OrderingActivity,   to the registry map. The example
 *   topic's ordering exercise (Topics → the example topic) comes alive the
 *   moment you do — with zero changes to any renderer.
 *
 * (Until you replace it, the placeholder below just names the task.)
 */
export function OrderingActivity({
  activity,
  onResult,
}: ActivityProps<"ordering">) {
  const [picked, setPicked] = useState<number[]>([]);
  const complete = picked.length === activity.items.length;
  const correct =
    complete && picked.join(",") === activity.correctOrder.join(",");

  function pick(index: number) {
    if (complete || picked.includes(index)) return;
    const next = [...picked, index];
    setPicked(next);
    if (next.length === activity.items.length) {
      onResult?.(next.join(",") === activity.correctOrder.join(","));
    }
  }

  return (
    <div className="space-y-3">
      <p className="font-medium">{activity.prompt}</p>

      <ul className="space-y-2">
        {activity.items.map((item, index) => {
          const position = picked.indexOf(index);
          return (
            <li key={index}>
              <button
                type="button"
                disabled={picked.includes(index)}
                onClick={() => pick(index)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-left transition-colors hover:bg-surface-raised disabled:opacity-60"
              >
                {position >= 0 && (
                  <span className="mr-2 text-accent">{position + 1}.</span>
                )}
                {item}
              </button>
            </li>
          );
        })}
      </ul>

      {complete && (
        <p className="text-sm text-muted">
          {correct ? "Correct! " : "Not quite. "}
          {activity.explanation}
        </p>
      )}
      {complete && !correct && (
        <button
          type="button"
          onClick={() => setPicked([])}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm transition-colors hover:bg-surface-raised"
        >
          Try again
        </button>
      )}
    </div>
  );
}
