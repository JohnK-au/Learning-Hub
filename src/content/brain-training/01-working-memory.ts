import { defineModule } from "@/schema/define.ts";

/** Drill module: minimal prose, mostly activity — difficulty scales with score. */
export default defineModule({
  id: "bt-working-memory",
  title: "Working memory drills",
  summary: "Short, hard, daily. The gym for the mental scratchpad.",
  lessons: [
    {
      id: "bt-n-back",
      title: "N-back",
      estimatedMinutes: 3,
      blocks: [
        {
          kind: "prose",
          body: "Letters appear one at a time. Press **Match** whenever the current letter is the same as the one *n* steps back. That's it — and it's brutal, because you have to hold a rolling window in mind while new items keep arriving.",
        },
        {
          kind: "callout",
          variant: "insight",
          body: "N-back is the closest thing psychology has to a pure working-memory stress test. Whether it transfers to *general* intelligence is hotly disputed — but it absolutely trains the thing it measures.",
        },
        {
          kind: "activity",
          activity: { type: "n-back", n: 2, trials: 14, intervalMs: 1800 },
        },
      ],
    },
    {
      id: "bt-sequence-recall",
      title: "Sequence recall",
      estimatedMinutes: 2,
      blocks: [
        {
          kind: "prose",
          body: "Watch the cells light up, then repeat the order back. You're rehearsing a **span task** — the same family of test used to measure memory span since the 1880s.",
        },
        {
          kind: "activity",
          activity: { type: "sequence-recall", length: 5, speedMs: 650 },
        },
      ],
      reviewItems: [
        {
          question: "Roughly how many items can working memory juggle at once?",
          answer:
            "About four — the famous 'seven plus or minus two' has been revised sharply downward.",
        },
      ],
    },
    {
      id: "bt-pattern-recognition",
      title: "Pattern recognition",
      estimatedMinutes: 2,
      blocks: [
        {
          kind: "prose",
          body: "Cells flash, then vanish. Mark where they were. This one leans on **visuospatial** memory — a different scratchpad from the verbal one the n-back hammers.",
        },
        {
          kind: "activity",
          activity: {
            type: "pattern-recognition",
            gridSize: 4,
            targets: 5,
            flashMs: 1300,
          },
        },
      ],
    },
  ],
});
