import type { Block } from "@/schema/schema.ts";
import { BlockRenderer } from "@/components/BlockRenderer.tsx";

/**
 * Topics — temporary block-rendering preview for Stage 5. This will be replaced
 * by the real topic list + session player; for now it proves BlockRenderer and
 * the activity registry work end-to-end.
 */
const demoBlocks: Block[] = [
  {
    kind: "prose",
    body: "A **scale** is a sequence of notes ordered by pitch. The *major scale* follows a fixed pattern of steps — whole, whole, half, whole, whole, whole, half.",
  },
  {
    kind: "callout",
    variant: "fact",
    body: "Western music divides the octave into **12** equally-spaced pitches before the pattern repeats.",
  },
  {
    kind: "activity",
    activity: {
      type: "multiple-choice",
      prompt: "How many notes are in a major scale before the octave repeats?",
      choices: ["Five", "Seven", "Twelve"],
      answerIndex: 1,
      explanation: "Seven: do, re, mi, fa, sol, la, ti.",
    },
  },
  {
    kind: "activity",
    activity: {
      type: "recall",
      prompt: "From memory: what is the step pattern of a major scale?",
      answer: "Whole, whole, half, whole, whole, whole, half.",
      hint: "It has two half-steps.",
    },
  },
];

export default function Topics() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Topics</h1>
        <p className="text-muted">Block-rendering preview (temporary).</p>
      </div>

      <div className="space-y-5">
        {demoBlocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>
    </section>
  );
}
