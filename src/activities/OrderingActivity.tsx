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
export function OrderingActivity({ activity }: ActivityProps<"ordering">) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface p-4">
      <p className="font-medium">{activity.prompt}</p>
      <p className="mt-2 text-sm text-faint">
        🔧 Build me: OrderingActivity (YOUR TURN #11 in
        src/activities/OrderingActivity.tsx)
      </p>
    </div>
  );
}
