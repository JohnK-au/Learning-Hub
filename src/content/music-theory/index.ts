import { defineTopic } from "@/schema/define.ts";
import readingMusic from "@/content/music-theory/01-reading-music.ts";
import scales from "@/content/music-theory/02-scales.ts";

/** Two modules — so the topic page shows real module grouping. */
export default defineTopic({
  id: "music-theory",
  title: "Music Theory",
  blurb: "From twelve notes to scales, intervals, and chords. Diagram-heavy.",
  accent: "success",
  icon: "🎼",
  pedagogy: "visual-first",
  tracks: [
    {
      id: "mt-main",
      title: "Fundamentals",
      progression: "sequential",
      modules: [readingMusic, scales],
    },
  ],
});
