import { defineModule } from "@/schema/define.ts";

export default defineModule({
  id: "hist-jp-classical",
  title: "Classical & feudal Japan",
  summary:
    "Borrowed institutions, a stolen throne, and two centuries of deliberate isolation.",
  lessons: [
    {
      id: "hist-jp-heian-court",
      title: "The court that governed by aesthetics",
      estimatedMinutes: 4,
      blocks: [
        {
          kind: "story",
          speaker: "Heian-kyō, c. 1000 CE",
          body: "In a palace in Kyoto, a lady-in-waiting named Murasaki Shikibu finishes a sprawling story about a prince and his entanglements. *The Tale of Genji* is, by most reckonings, the first novel in any language — written by a woman, in a court where the men were busy writing in Chinese.",
        },
        {
          kind: "prose",
          body: "The Heian aristocracy took the extraordinary position that **taste was competence**. Careers turned on the calligraphy of a note, the appropriateness of a poem, the layering of colours in a sleeve. It looks like decadence — and it partly was. But while the court perfected its aesthetics, real power quietly drained to the provincial warrior families who were actually collecting the taxes and holding the land.",
        },
        {
          kind: "callout",
          variant: "insight",
          body: "A theme worth carrying into the other tracks: prestige and power come apart. The Heian court kept the prestige for centuries after the samurai took the power — and Japan's emperors would go on reigning-without-ruling for most of the next thousand years.",
        },
        {
          kind: "activity",
          activity: {
            type: "multiple-choice",
            prompt:
              "What was happening while the Heian court refined its aesthetics?",
            choices: [
              "Provincial warrior families were accumulating the real power",
              "Japan was ruled directly from China",
              "The imperial line was abolished",
            ],
            answerIndex: 0,
            explanation:
              "Power drifted to the provincial samurai clans — setting up the shogunates.",
          },
        },
      ],
      reviewItems: [
        {
          question: "Who wrote The Tale of Genji, and why is it notable?",
          answer:
            "Murasaki Shikibu, c. 1000 CE — widely considered the world's first novel.",
        },
      ],
    },
    {
      id: "hist-jp-sakoku",
      title: "Japan closes the door",
      estimatedMinutes: 4,
      blocks: [
        {
          kind: "prose",
          body: "By the 1630s the Tokugawa shoguns had unified the country and drawn a startling conclusion: contact with the outside world was a **destabilizing technology**. Christianity was banned, most foreigners expelled, and Japanese subjects forbidden to leave on pain of death. Foreign trade was funnelled through a single artificial island in Nagasaki harbour.",
        },
        {
          kind: "callout",
          variant: "fact",
          body: "*Sakoku* held for roughly 220 years — and they were peaceful, literate, and prosperous ones. The policy is easy to mock as reactionary, but it bought Japan two centuries without civil war, in an era when Europe had almost none.",
        },
        {
          kind: "activity",
          activity: {
            type: "recall",
            prompt:
              "From memory: what was the Tokugawa reasoning behind sakoku (closed country)?",
            answer:
              "Foreign contact — especially Christianity and foreign arms — was seen as destabilizing to the shogunate's hard-won unity, so it was tightly restricted to preserve internal order.",
            hint: "They had just ended a century of civil war.",
          },
        },
      ],
      reviewItems: [
        {
          question: "Roughly how long did Japan's sakoku policy last?",
          answer: "About 220 years, from the 1630s until the 1850s.",
        },
      ],
    },
  ],
});
