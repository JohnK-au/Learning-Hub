import { defineTopic } from "@/schema/define.ts";
import foundations from "@/content/game-theory/01-foundations.ts";

export default defineTopic({
  id: "game-theory",
  title: "Game Theory",
  blurb:
    "Strategic interaction from first principles — up to Nash and its discontents.",
  accent: "danger",
  icon: "🎲",
  pedagogy: "text-first",
  tracks: [
    {
      id: "gt-main",
      title: "Foundations",
      progression: "sequential",
      modules: [foundations],
    },
  ],
});
