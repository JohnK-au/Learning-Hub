import type { ReactNode } from "react";
import type { Activity } from "@/schema/schema.ts";
import { MultipleChoiceActivity } from "@/activities/MultipleChoiceActivity.tsx";
import { RecallActivity } from "@/activities/RecallActivity.tsx";
import { NBackActivity } from "@/activities/NBackActivity.tsx";
import { SequenceRecallActivity } from "@/activities/SequenceRecallActivity.tsx";
import { PatternRecognitionActivity } from "@/activities/PatternRecognitionActivity.tsx";
import { OrderingActivity } from "@/activities/OrderingActivity.tsx";

/** Narrow the Activity union to a single variant by its `type` tag. */
type ActivityOf<T extends Activity["type"]> = Extract<Activity, { type: T }>;

/** Props every activity component receives: its specific activity + a result callback. */
export type ActivityProps<T extends Activity["type"] = Activity["type"]> = {
  activity: ActivityOf<T>;
  onResult?: (correct: boolean) => void;
};

type ActivityComponent<T extends Activity["type"]> = (
  props: ActivityProps<T>,
) => ReactNode;

/**
 * THE REGISTRY — the single extension point for activities.
 *
 * Map each activity `type` to the component that renders it. Adding a new
 * activity means adding a component and ONE entry here; `ActivityRenderer`
 * below never changes. That is the Open/Closed Principle: the rendering engine
 * is closed for modification but open for extension via this map.
 */
const registry: { [T in Activity["type"]]?: ActivityComponent<T> } = {
  "multiple-choice": MultipleChoiceActivity,
  recall: RecallActivity,
  "n-back": NBackActivity,
  "sequence-recall": SequenceRecallActivity,
  "pattern-recognition": PatternRecognitionActivity,
  ordering: OrderingActivity,
};

/**
 * Renders the right component for an activity, or degrades gracefully if no
 * component is registered for its type yet.
 *
 * The one cast below is deliberate and isolated: TypeScript can't prove that
 * the component looked up by `activity.type` matches this specific activity's
 * variant, so we assert it at this single boundary. The registry guarantees it
 * at runtime (a component is only ever stored under its own type).
 */
export function ActivityRenderer({
  activity,
  onResult,
}: {
  activity: Activity;
  onResult?: (correct: boolean) => void;
}): ReactNode {
  const Component = registry[activity.type] as
    ActivityComponent<Activity["type"]> | undefined;

  if (!Component) {
    return (
      <p className="text-sm text-faint">
        (No renderer for “{activity.type}” yet.)
      </p>
    );
  }
  return <Component activity={activity} onResult={onResult} />;
}
