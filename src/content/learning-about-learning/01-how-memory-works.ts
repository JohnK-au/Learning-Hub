import { defineModule } from "@/schema/define.ts";

/**
 * ═══ CONTENT TEMPLATE — copy this file when authoring new modules. ═══
 *
 * Conventions it demonstrates (also in docs/FLIGHT_GUIDE.md):
 *   - ids: kebab-case, globally unique, PREFIXED by topic ("lal-" here).
 *     Progress is keyed by these ids — never change one after using it.
 *   - Every block kind and the review-items hook appear at least once below.
 *   - Prose is Markdown; tone: explaining to a smart friend.
 */
export default defineModule({
  id: "lal-how-memory-works",
  title: "How memory actually works",
  summary: "The forgetting curve, and the two tricks that beat it.",
  lessons: [
    {
      id: "lal-forgetting-curve",
      title: "The forgetting curve",
      estimatedMinutes: 3,
      blocks: [
        {
          kind: "prose",
          body: "In the 1880s, Hermann Ebbinghaus memorized thousands of nonsense syllables — *wid*, *zof*, *kel* — and then tested himself at intervals, for years. Grim work, but it produced one of psychology's most replicated findings: the **forgetting curve**. Memory doesn't fade linearly. It collapses — steeply in the first day, then more slowly, until whatever survives becomes nearly permanent.",
        },
        {
          kind: "figure",
          src: "/figures/forgetting-curve.svg",
          alt: "Retention over time: a steep forgetting curve without review, and progressively flatter curves after each spaced review.",
          caption:
            "Each well-timed review interrupts the collapse — and flattens the next curve.",
        },
        {
          kind: "callout",
          variant: "fact",
          body: "Re-reading feels productive because the material seems familiar. But familiarity is not recall — the feeling is called the **fluency illusion**, and it's why cramming evaporates.",
        },
        {
          kind: "prose",
          depth: "deep-dive",
          body: "Why does the curve flatten? Each successful retrieval is thought to strengthen both the memory trace and the *retrieval route* to it — a process called reconsolidation. Effortful recall right before forgetting seems to signal 'this matters, keep it', which is why the *spacing* of reviews matters more than their count.",
        },
        {
          kind: "activity",
          activity: {
            type: "multiple-choice",
            prompt: "When does a memory fade fastest?",
            choices: [
              "Right after learning",
              "About a week later",
              "At a steady rate throughout",
            ],
            answerIndex: 0,
            explanation:
              "The curve is steepest immediately — which is why the first review comes soon, and later ones can wait longer.",
          },
        },
      ],
      reviewItems: [
        {
          question: "What shape does forgetting follow?",
          answer:
            "A steep curve — fastest right after learning, then flattening.",
        },
      ],
    },
    {
      id: "lal-retrieval-practice",
      title: "Testing beats re-reading",
      estimatedMinutes: 3,
      blocks: [
        {
          kind: "story",
          speaker: "Washington University, 2006",
          body: "Roediger and Karpicke had students learn a passage. One group re-read it four times; another read it once, then took three recall tests. A week later, the re-readers had lost most of it — the tested group remembered ~50% more. The act of *retrieving* had done the teaching.",
        },
        {
          kind: "prose",
          body: "That's the **testing effect**: pulling something out of memory strengthens it far more than pushing it back in. It's the reason every lesson here ends with an activity instead of a summary — the quiz isn't checking whether you learned; the quiz **is** the learning.",
        },
        {
          kind: "callout",
          variant: "tip",
          body: "This works on anything. Closing the book and saying what you remember out loud is a test. So is explaining it to someone else.",
        },
        {
          kind: "activity",
          activity: {
            type: "recall",
            prompt:
              "From memory: why does testing beat re-reading, in one sentence?",
            answer:
              "Because retrieving a memory strengthens it — recall is practice for exactly the thing you want to be able to do.",
            hint: "Think about which *action* each method practices.",
          },
        },
        {
          kind: "activity",
          activity: {
            type: "ordering",
            prompt:
              "Order these study steps from least to most effective for long-term retention:",
            items: [
              "Re-read the chapter the night before",
              "Highlight while reading",
              "Self-test, spaced over several days",
            ],
            correctOrder: [1, 0, 2],
            explanation:
              "Highlighting barely registers; massed re-reading fades fast; spaced self-testing compounds.",
          },
        },
      ],
      reviewItems: [
        {
          question: "What is the testing effect?",
          answer:
            "Retrieving information from memory strengthens it more than re-studying it does.",
        },
      ],
    },
  ],
});
