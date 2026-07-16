import { defineModule } from "@/schema/define.ts";

export default defineModule({
  id: "hist-cn-early-imperial",
  title: "Early imperial China",
  summary:
    "Unification, and the dynasty that set the template for two millennia.",
  lessons: [
    {
      id: "hist-cn-qin-unification",
      title: "The First Emperor standardizes everything",
      estimatedMinutes: 4,
      blocks: [
        {
          kind: "story",
          speaker: "China, 221 BCE",
          body: "After centuries of warring states, one king finishes the job and declares himself *Qin Shi Huang* — First Emperor. Then he does something stranger than conquest: he standardizes the width of cart axles. And the weights. And the coins. And the writing.",
        },
        {
          kind: "prose",
          body: "The axle detail sounds trivial and is anything but. Roads wore ruts; carts with the wrong axle width couldn't use them. Standardize the axle and you've built an **interoperable transport network** across a continent. Standardize the script and an official from anywhere can administer anywhere. The Qin dynasty collapsed within fifteen years of its founder's death — but its *infrastructure of uniformity* outlived it by two thousand.",
        },
        {
          kind: "callout",
          variant: "insight",
          body: "China's enduring political unity, versus Europe's enduring fragmentation, is often traced to exactly this: a shared script and standardized administration that survived every dynasty that collapsed on top of it.",
        },
        {
          kind: "activity",
          activity: {
            type: "recall",
            prompt:
              "Why would standardizing cart-axle width matter enough for an emperor to decree it?",
            answer:
              "Roads wore into ruts, so a uniform axle width made a single continent-wide transport network usable — an infrastructure standard, not a vanity.",
            hint: "Think about ruts in a dirt road.",
          },
        },
      ],
      reviewItems: [
        {
          question: "What did Qin Shi Huang standardize?",
          answer:
            "Writing, weights, measures, coinage — and cart-axle widths, unifying the road network.",
        },
      ],
    },
    {
      id: "hist-cn-han-exam",
      title: "The Han build a bureaucracy on merit",
      estimatedMinutes: 4,
      blocks: [
        {
          kind: "prose",
          body: "The Han inherited the Qin's machinery and softened its ideology, and in doing so pushed something genuinely novel: recruiting officials by **merit** — through recommendation, an imperial academy, and early written examinations — rather than by birth. In principle, a farmer's son who mastered the classics could rise to govern a province. In practice, the leisure to study kept the gentry firmly on top — but the *principle* mattered. The fully standardized exam came centuries later under the Sui and Tang, yet the Han set the template that lasted until 1905.",
        },
        {
          kind: "callout",
          variant: "fact",
          body: "When European powers built their modern civil services in the 1800s, they explicitly cited China's examination system as the model — the idea of hiring officials by exam is a Chinese export.",
        },
        {
          kind: "activity",
          activity: {
            type: "multiple-choice",
            prompt:
              "What made the Han approach to officialdom radical for its time?",
            choices: [
              "Officials were recruited on merit rather than by noble birth",
              "It was staffed entirely by the military",
              "It abolished taxation",
            ],
            answerIndex: 0,
            explanation:
              "Merit over birth — recommendation and early exams, the seed of a system Europe would echo nearly two millennia later.",
          },
        },
      ],
      reviewItems: [
        {
          question: "What was radical about how the Han recruited officials?",
          answer:
            "By merit (recommendation and early examinations) rather than noble birth — the template for the later imperial exam and modern civil services.",
        },
      ],
    },
  ],
});
