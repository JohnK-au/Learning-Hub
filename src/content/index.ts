import type { Topic, Track } from "@/schema/schema.ts";

/**
 * The content library — the registry of all topics.
 *
 * Each topic lives in its own folder and is added here. The app reads only from
 * this array, so the whole curriculum is data: adding content never touches app
 * logic. Topics are populated in Stage 9.
 */
export const topics: Topic[] = [];

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
