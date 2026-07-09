import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LearningProfile } from "@/store/ProgressStore.ts";
import { useProgress } from "@/hooks/useProgress.ts";

/**
 * Onboarding — a 30-second learning-preferences profile.
 *
 * Honest by design: the copy below tells the truth — presentation preference
 * tunes engagement, while retention comes from retrieval + spacing, which the
 * app applies to everyone. (The "match teaching to learning styles" idea is
 * not supported by the research; we don't pretend otherwise.)
 */
const PRESENTATIONS: {
  value: LearningProfile["presentation"];
  label: string;
  hint: string;
}[] = [
  { value: "more-text", label: "Rich text", hint: "Full depth, deep-dives expanded" },
  { value: "more-visual", label: "Visual", hint: "Diagrams and figures forward" },
  { value: "story-first", label: "Story-first", hint: "Narrative before theory" },
  { value: "interactive-first", label: "Interactive", hint: "Get to the activity fast" },
];

const LENGTHS: {
  value: LearningProfile["sessionLength"];
  label: string;
  hint: string;
}[] = [
  { value: "short", label: "Short", hint: "~2–3 min" },
  { value: "standard", label: "Standard", hint: "~5 min" },
  { value: "long", label: "Long", hint: "~10 min" },
];

export default function Onboarding() {
  const { update } = useProgress();
  const navigate = useNavigate();
  const [presentation, setPresentation] =
    useState<LearningProfile["presentation"]>("more-text");
  const [sessionLength, setSessionLength] =
    useState<LearningProfile["sessionLength"]>("short");

  function save() {
    update((s) => ({ ...s, preferences: { presentation, sessionLength } }));
    navigate("/");
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          How do you like to learn?
        </h1>
        <p className="mt-2 text-muted">
          This tunes how lessons are <em>presented</em> — you can change it any
          time.
        </p>
      </div>

      <Chooser
        title="Default presentation"
        options={PRESENTATIONS}
        selected={presentation}
        onSelect={setPresentation}
      />
      <Chooser
        title="Typical session length"
        options={LENGTHS}
        selected={sessionLength}
        onSelect={setSessionLength}
      />

      <aside className="rounded-card border border-border bg-surface-raised p-4 text-sm text-muted">
        <span className="font-medium text-text">A note on honesty:</span>{" "}
        research doesn’t support the idea that matching content to a “learning
        style” improves retention. What does: testing yourself and spacing
        reviews — which this app does for everyone, whatever you pick here.
        This choice is about what you’ll <em>enjoy</em> showing up for.
      </aside>

      <button
        type="button"
        onClick={save}
        className="rounded-lg bg-accent-strong px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent"
      >
        Save preferences
      </button>
    </section>
  );
}

function Chooser<T extends string>({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: { value: T; label: string; hint: string }[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{title}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={[
              "rounded-lg border px-4 py-3 text-left transition-colors",
              selected === option.value
                ? "border-accent bg-surface-raised"
                : "border-border bg-surface hover:bg-surface-raised",
            ].join(" ")}
          >
            <p className="text-sm font-medium">{option.label}</p>
            <p className="mt-0.5 text-xs text-faint">{option.hint}</p>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
