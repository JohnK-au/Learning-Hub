import { defineModule } from "@/schema/define.ts";

export default defineModule({
  id: "hist-eu-antiquity",
  title: "Antiquity",
  summary: "Rome becomes an empire, and then discovers what that costs.",
  lessons: [
    {
      id: "hist-eu-republic-falls",
      title: "The Republic dies of its own success",
      estimatedMinutes: 4,
      blocks: [
        {
          kind: "story",
          speaker: "Rome, 49 BCE",
          body: "Caesar stops at a muddy little river marking the edge of his province. Crossing it with an army is treason — the Republic's one inviolable line. He crosses. The line held for four centuries; it did not survive the man who no longer needed it to.",
        },
        {
          kind: "prose",
          body: "The tidy story is that ambition killed the Roman Republic. The structural story is more interesting: Rome's constitution was designed for a **city-state**, and it kept working right up until Rome wasn't one. Conquest made generals rich enough to pay their own soldiers — so legions became loyal to men rather than to Rome. The institution didn't fail because bad men attacked it; it failed because success made its incentives incoherent.",
        },
        {
          kind: "callout",
          variant: "insight",
          body: "A recurring pattern in institutional collapse: the rules aren't broken, they're *outgrown*. The system keeps running long after the conditions it assumed have vanished.",
        },
        {
          kind: "activity",
          activity: {
            type: "multiple-choice",
            prompt:
              "What structural change most undermined the Republic's stability?",
            choices: [
              "Soldiers came to depend on generals, not the state, for their pay and land",
              "Rome ran out of grain",
              "The Senate was abolished by popular vote",
            ],
            answerIndex: 0,
            explanation:
              "Personal loyalty to commanders turned armies into private power bases — the fatal incentive.",
          },
        },
      ],
      reviewItems: [
        {
          question: "Why did Roman legions become loyal to generals over Rome?",
          answer:
            "Generals, enriched by conquest, paid and settled their own troops — so soldiers' livelihoods depended on the man, not the state.",
        },
      ],
    },
    {
      id: "hist-eu-fall-of-rome",
      title: "Rome didn't fall so much as fade",
      estimatedMinutes: 4,
      blocks: [
        {
          kind: "prose",
          body: "476 CE is the date in the textbooks: a Germanic commander deposes a teenage emperor and doesn't bother replacing him. But nobody alive at the time thought the world had ended. Taxes were still collected, Latin was still spoken, bishops still wrote to each other. The **Eastern** empire carried on from Constantinople for another *thousand years*.",
        },
        {
          kind: "callout",
          variant: "fact",
          body: "The phrase 'Byzantine Empire' is a 16th-century invention. Its citizens called themselves *Romans* — and would have found the idea that Rome fell in 476 baffling.",
        },
        {
          kind: "activity",
          activity: {
            type: "ordering",
            prompt: "Put these Roman milestones in chronological order:",
            items: [
              "Caesar crosses the Rubicon",
              "Constantinople falls to the Ottomans",
              "The last Western emperor is deposed",
            ],
            correctOrder: [0, 2, 1],
            explanation:
              "49 BCE → 476 CE → 1453 CE. The eastern half outlived the western by nearly a millennium.",
          },
        },
      ],
      reviewItems: [
        {
          question: "When did the Eastern Roman Empire actually end?",
          answer: "1453, when Constantinople fell to the Ottomans.",
        },
      ],
    },
  ],
});
