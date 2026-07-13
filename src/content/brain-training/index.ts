import { defineTopic } from "@/schema/define.ts";
import workingMemory from "@/content/brain-training/01-working-memory.ts";

/** The one adaptive-drill topic: difficulty scales with performance. */
export default defineTopic({
  id: "brain-training",
  title: "Brain Training",
  blurb: "Working-memory and attention drills that push back as you improve.",
  accent: "warning",
  icon: "🧩",
  pedagogy: "drill",
  tracks: [
    {
      id: "bt-main",
      title: "Daily drills",
      progression: "adaptive-drill",
      modules: [workingMemory],
    },
  ],
});
