import type { Topic, Track } from "@/schema/schema.ts";
import learningAboutLearning from "@/content/learning-about-learning/index.ts";
import brainTraining from "@/content/brain-training/index.ts";
import musicTheory from "@/content/music-theory/index.ts";
import history from "@/content/history/index.ts";
import gameTheory from "@/content/game-theory/index.ts";

/**
 * The content library — the registry of all topics.
 *
 * Each topic lives in its own folder and is added here. The app reads only from
 * this array, so the whole curriculum is data: adding content never touches app
 * logic.
 *
 * This is SEED content — a real but deliberately small slice, enough to see the
 * engine work end-to-end (multi-topic suggestions, module grouping, History's
 * three parallel tracks, the drill games, spaced reviews). The remaining topics
 * — psychology, cognitive science, behavioural economics, product & business,
 * cooking — get authored in Stage 9; adding them touches no app code.
 *
 * ORDER MATTERS: a brand-new user with no history is suggested the first
 * unfinished lesson found scanning this array top-down.
 */
export const topics: Topic[] = [
  learningAboutLearning, // deliberately first: it explains how to use the rest
  brainTraining,
  musicTheory,
  history,
  gameTheory,
];

/** Look up a topic by its stable id. */
export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

/** Find a track anywhere in the library, plus the topic that owns it. */
export function findTrack(
  trackId: string,
): { topic: Topic; track: Track } | undefined {
  for (const topic of topics) {
    const track = topic.tracks.find((t) => t.id === trackId);
    if (track) return { topic, track };
  }
  return undefined;
}
