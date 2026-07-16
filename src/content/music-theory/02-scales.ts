import { defineModule } from "@/schema/define.ts";

export default defineModule({
  id: "mt-scales",
  title: "Scales",
  summary: "A recipe of steps that works from any starting note.",
  lessons: [
    {
      id: "mt-major-scale",
      title: "The major scale is a recipe",
      estimatedMinutes: 3,
      blocks: [
        {
          kind: "prose",
          body: "A scale isn't a list of notes — it's a **pattern of gaps**. The major scale is seven notes built by this recipe of whole (W) and half (H) steps:\n\n**W – W – H – W – W – W – H**\n\nStart on C, follow the recipe, and you land on exactly the white keys. Start on *any* other note and follow the same recipe, and you get that key's major scale — same flavour, different starting point. That's the entire trick.",
        },
        {
          kind: "callout",
          variant: "tip",
          body: "This is why musicians talk about a song being *in* a key. The key names the starting note; the recipe does the rest.",
        },
        {
          kind: "activity",
          activity: {
            type: "ordering",
            prompt:
              "A major scale is two four-note halves (tetrachords) joined by a step. Put its pieces in order, low to high:",
            items: [
              "Whole — the joining step",
              "Whole, whole, half — upper tetrachord",
              "Whole, whole, half — lower tetrachord",
            ],
            correctOrder: [2, 0, 1],
            explanation:
              "Two identical tetrachords (W–W–H) joined by a whole step: (W W H) · W · (W W H) = W W H W W W H.",
          },
        },
      ],
      reviewItems: [
        {
          question: "What is the step pattern of a major scale?",
          answer: "Whole, whole, half, whole, whole, whole, half.",
        },
      ],
    },
    {
      id: "mt-intervals",
      title: "Intervals: the distance is the feeling",
      estimatedMinutes: 3,
      blocks: [
        {
          kind: "prose",
          body: "An **interval** is the distance between two notes — and distance, it turns out, is emotion. A perfect fifth (seven half steps) sounds open and stable; it's the backbone of power chords and hymns alike. A minor second (one half step) sounds like a horror-film cue, because it *is*: two pitches so close they fight.",
        },
        {
          kind: "callout",
          variant: "insight",
          body: "Consonance isn't a cultural whim — it tracks the math. Intervals whose frequencies form simple ratios (a fifth is 3:2) reinforce each other; ugly ratios grind. Pythagoras noticed this with vibrating strings ~2,500 years ago.",
        },
        {
          kind: "activity",
          activity: {
            type: "recall",
            prompt:
              "From memory: why does a perfect fifth sound so stable, while a minor second sounds tense?",
            answer:
              "The fifth's frequencies form a simple ratio (3:2) and reinforce each other; the minor second's pitches are so close they clash.",
            hint: "Think about ratios, not rules.",
          },
        },
      ],
      reviewItems: [
        {
          question: "What frequency ratio makes a perfect fifth?",
          answer: "3:2 — one of the simplest ratios, hence its stability.",
        },
      ],
    },
  ],
});
