import { useState } from "react";
import type { ActivityProps } from "@/activities/registry.tsx";

/**
 * Put-these-in-order activity. The learner taps items to build a sequence
 * (each tap appends a position number), taps again to remove one, and locks
 * the answer in with Confirm. Nothing is graded until Confirm.
 */
export function OrderingActivity({
  activity,
  onResult,
}: ActivityProps<"ordering">) {
  // The order being built, as item indexes. `submitted` locks it for grading.
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const complete = picked.length === activity.items.length;
  const correct = picked.join(",") === activity.correctOrder.join(",");

  function toggle(index: number) {
    if (submitted) return;
    setPicked(
      picked.includes(index)
        ? picked.filter((i) => i !== index) // tap again to remove
        : [...picked, index], // otherwise place it next
    );
  }

  function confirm() {
    if (!complete || submitted) return;
    setSubmitted(true);
    onResult?.(correct);
  }

  function reset() {
    setPicked([]);
    setSubmitted(false);
  }

  return (
    <div className="space-y-3">
      <p className="font-medium">{activity.prompt}</p>

      {/* Make the multi-step nature explicit. */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="rounded-full border border-border bg-surface-raised px-2 py-0.5 font-medium uppercase tracking-wide">
          Put in order
        </span>
        <span>
          {submitted
            ? correct
              ? "Locked in ✓"
              : "Locked in"
            : "Tap items in order · tap again to remove"}
        </span>
      </div>

      <ul className="space-y-2">
        {activity.items.map((item, index) => {
          const position = picked.indexOf(index);
          const isPicked = position >= 0;

          // Colour the tile by state.
          let tone = "border-border bg-surface hover:bg-surface-raised";
          if (submitted && isPicked) {
            const rightHere = activity.correctOrder[position] === index;
            tone = rightHere
              ? "border-success bg-success/10"
              : "border-danger bg-danger/10";
          } else if (isPicked) {
            tone = "border-accent bg-accent/10";
          }

          return (
            <li key={index}>
              <button
                type="button"
                disabled={submitted}
                onClick={() => toggle(index)}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2 text-left transition-colors disabled:cursor-default ${tone}`}
              >
                {/* Numbered badge shows where this item sits in the sequence. */}
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                    isPicked
                      ? "border-transparent bg-accent-strong text-white"
                      : "border-border text-faint"
                  }`}
                  aria-hidden
                >
                  {isPicked ? position + 1 : ""}
                </span>
                <span>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Progress + controls. */}
      {!submitted && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={confirm}
            disabled={!complete}
            className="rounded-lg bg-accent-strong px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent disabled:opacity-40"
          >
            Confirm answer
          </button>
          <span className="text-xs text-faint">
            {picked.length} / {activity.items.length} placed
          </span>
          {picked.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="ml-auto text-xs text-muted underline hover:text-text"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {submitted && (
        <div className="space-y-2">
          <p className="text-sm text-muted">
            <span
              className={
                correct ? "font-medium text-success" : "font-medium text-danger"
              }
            >
              {correct ? "Correct! " : "Not quite. "}
            </span>
            {activity.explanation}
          </p>
          {!correct && (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm transition-colors hover:bg-surface-raised"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
