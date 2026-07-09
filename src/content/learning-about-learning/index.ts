import { defineTopic } from "@/schema/define.ts";
import howMemoryWorks from "@/content/learning-about-learning/01-how-memory-works.ts";

/**
 * ═══ TOPIC TEMPLATE — the reference example. ═══
 * A real (tiny) topic that exercises every block kind and three activity
 * types. Copy this folder's structure for each of the nine curriculum
 * topics: ordered module files + an index.ts that assembles the topic.
 *
 * Conventions:
 *   - accent: a theme token name from index.css (e.g. "accent", "success").
 *   - icon: a single emoji.
 *   - one folder per topic; modules numbered in curriculum order.
 */
export default defineTopic({
  id: "learning-about-learning",
  title: "Learning about Learning",
  blurb: "Why this app works the way it does — the science, in two bites.",
  accent: "accent",
  icon: "🧠",
  pedagogy: "text-first",
  tracks: [
    {
      id: "lal-main",
      title: "Foundations",
      progression: "sequential",
      modules: [howMemoryWorks],
    },
  ],
});
