import { defineModule } from "@/schema/define.ts";

export default defineModule({
  id: "mt-reading-music",
  title: "Reading music",
  summary: "The staff, the twelve notes, and why the piano looks like that.",
  lessons: [
    {
      id: "mt-twelve-notes",
      title: "There are only twelve notes",
      estimatedMinutes: 3,
      blocks: [
        {
          kind: "prose",
          body: "Western music divides the octave into **twelve** equally-spaced pitches. That's the whole alphabet. Every song you've ever loved is a rearrangement of those twelve, and when you run out, you start again an octave higher — the same letters, at double the frequency.",
        },
        {
          kind: "figure",
          src: "/figures/keyboard-octave.svg",
          alt: "One octave of a piano keyboard from C to C, with the two half-steps (E–F and B–C) marked in red.",
          caption:
            "White keys, black keys, and the two places where neighbours have no black key between them.",
        },
        {
          kind: "prose",
          body: "Look at the gaps. Between most white keys sits a black key — a **whole step** apart. But between **E and F**, and between **B and C**, there is no black key: those pairs are a **half step** apart. That irregularity isn't a design flaw; it's the scaffolding the entire major scale is built on.",
        },
        {
          kind: "callout",
          variant: "fact",
          body: "The piano's keyboard is a *map of the C major scale*. The white keys are exactly C major — which is why beginners start there, and why the black keys look like the exceptions rather than the rule.",
        },
        {
          kind: "activity",
          activity: {
            type: "multiple-choice",
            prompt: "Which pair of white keys has NO black key between them?",
            choices: ["C and D", "E and F", "G and A"],
            answerIndex: 1,
            explanation:
              "E–F (and B–C) are half steps — neighbours with nothing in between.",
          },
        },
      ],
      reviewItems: [
        {
          question: "How many distinct pitches are in a Western octave?",
          answer: "Twelve, equally spaced.",
        },
      ],
    },
  ],
});
