import { useState } from "react";
import type { ActivityProps } from "@/activities/registry.tsx";

/**
 * A single-answer quiz. The learner picks one option; we lock the choices,
 * highlight correct/incorrect, show the explanation, and report the result.
 *
 * This is your reference for building RecallActivity — note the shape:
 *   - useState holds what the learner has done so far
 *   - an event handler (`choose`) updates that state
 *   - the JSX reads the state to decide what to show
 */
export function MultipleChoiceActivity({
  activity,
  onResult,
}: ActivityProps<"multiple-choice">) {
  // `picked` is null until the learner answers, then the chosen index.
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  function choose(index: number) {
    if (answered) return; // lock after the first answer
    setPicked(index);
    onResult?.(index === activity.answerIndex);
  }

  return (
    <div className="space-y-3">
      <p className="font-medium">{activity.prompt}</p>

      <ul className="space-y-2">
        {activity.choices.map((choice, index) => {
          const isCorrect = index === activity.answerIndex;
          const isPicked = index === picked;

          let tone = "border-border bg-surface hover:bg-surface-raised";
          if (answered && isCorrect) tone = "border-success bg-success/10";
          else if (answered && isPicked) tone = "border-danger bg-danger/10";

          return (
            <li key={index}>
              <button
                type="button"
                disabled={answered}
                onClick={() => choose(index)}
                className={`w-full rounded-lg border px-4 py-2 text-left transition-colors ${tone}`}
              >
                {choice}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <p className="text-sm text-muted">
          {picked === activity.answerIndex ? "Correct! " : "Not quite. "}
          {activity.explanation}
        </p>
      )}
    </div>
  );
}
