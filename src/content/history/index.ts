import { defineTopic } from "@/schema/define.ts";
import european from "@/content/history/01-european.ts";
import chinese from "@/content/history/02-chinese.ts";
import japanese from "@/content/history/03-japanese.ts";

/**
 * THE THREE-TRACK CASE. History is one topic with three PARALLEL tracks, each
 * advancing chronologically and independently — finishing a Roman lesson does
 * nothing to your position in the Chinese track. This is exactly why the
 * schema has a Track layer between Topic and Module.
 */
export default defineTopic({
  id: "history",
  title: "History",
  blurb:
    "Three parallel chronologies — European, Chinese, Japanese — told as story.",
  accent: "accent",
  icon: "🏛️",
  pedagogy: "story-driven",
  tracks: [
    {
      id: "hist-european",
      title: "European",
      progression: "sequential",
      modules: [european],
    },
    {
      id: "hist-chinese",
      title: "Chinese",
      progression: "sequential",
      modules: [chinese],
    },
    {
      id: "hist-japanese",
      title: "Japanese",
      progression: "sequential",
      modules: [japanese],
    },
  ],
});
