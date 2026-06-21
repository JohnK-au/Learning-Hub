import { useState } from "react";
import type { ActivityProps } from "@/activities/registry.tsx";

/**
 * A flashcard for retrieval practice: show the prompt, let the learner attempt
 * to recall the answer, then reveal it on demand.
 */
export function RecallActivity({ activity }: ActivityProps<"recall">) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-3">
      <p className="font-medium">{activity.prompt}</p>

      {revealed ? (
        <p className="text-muted">{activity.answer}</p>
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm transition-colors hover:bg-surface-raised"
        >
          Reveal answer
        </button>
      )}
    </div>
  );
}
