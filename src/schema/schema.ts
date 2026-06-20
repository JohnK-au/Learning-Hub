import { z } from "zod";

/**
 * CONTENT SCHEMA — the single source of truth.
 *
 * Each shape is defined once as a Zod schema; its TypeScript type is derived
 * with `z.infer`, so the type and the runtime validator can never drift apart.
 * Content is validated at load, so a typo in a data file fails loudly instead
 * of silently rendering broken.
 *
 * Hierarchy: Topic -> Track -> Module -> Lesson -> Block[] (-> Activity).
 */

/* ------------------------------------------------------------------------ *
 * Activities — the interactive part of a lesson.
 *
 * A discriminated union on `type`. Add a new kind = add a schema + list it in
 * `activitySchema`; nothing else in the app needs to change.
 * ------------------------------------------------------------------------ */

// Data-driven activities (the content lives in the data).
export const multipleChoiceActivitySchema = z.object({
  type: z.literal("multiple-choice"),
  prompt: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2),
  answerIndex: z.number().int().min(0),
  explanation: z.string().optional(),
});

export const recallActivitySchema = z.object({
  type: z.literal("recall"),
  prompt: z.string().min(1),
  answer: z.string().min(1),
  hint: z.string().optional(),
});

export const orderingActivitySchema = z.object({
  type: z.literal("ordering"),
  prompt: z.string().min(1),
  items: z.array(z.string().min(1)).min(2),
  correctOrder: z.array(z.number().int().min(0)).min(2), // 0-based indices into `items`
  explanation: z.string().optional(),
});

// Brain-training games (configuration, not authored content).
export const nBackActivitySchema = z.object({
  type: z.literal("n-back"),
  n: z.number().int().min(1),
  trials: z.number().int().min(1),
  intervalMs: z.number().int().min(250),
});

export const sequenceRecallActivitySchema = z.object({
  type: z.literal("sequence-recall"),
  length: z.number().int().min(2),
  speedMs: z.number().int().min(100),
});

export const patternRecognitionActivitySchema = z.object({
  type: z.literal("pattern-recognition"),
  gridSize: z.number().int().min(2),
  targets: z.number().int().min(1),
  flashMs: z.number().int().min(100),
});

export const activitySchema = z.discriminatedUnion("type", [
  multipleChoiceActivitySchema,
  recallActivitySchema,
  orderingActivitySchema,
  nBackActivitySchema,
  sequenceRecallActivitySchema,
  patternRecognitionActivitySchema,
]);

export type Activity = z.infer<typeof activitySchema>;

/* ------------------------------------------------------------------------ *
 * Blocks — the ordered pieces a lesson is built from.
 *
 * Same discriminated-union pattern, keyed on `kind`. Lets a lesson mix prose,
 * visuals, story, and activities in any order. The `activity` block reuses
 * `activitySchema` (composition / DRY).
 * ------------------------------------------------------------------------ */

export const proseBlockSchema = z.object({
  kind: z.literal("prose"),
  body: z.string().min(1),
  depth: z.enum(["core", "deep-dive"]).optional(), // prefs profile may hide "deep-dive"
});

export const figureBlockSchema = z.object({
  kind: z.literal("figure"),
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
});

export const calloutBlockSchema = z.object({
  kind: z.literal("callout"),
  variant: z.enum(["fact", "tip", "insight"]),
  body: z.string().min(1),
});

export const storyBlockSchema = z.object({
  kind: z.literal("story"),
  body: z.string().min(1),
  speaker: z.string().optional(),
});

export const activityBlockSchema = z.object({
  kind: z.literal("activity"),
  activity: activitySchema,
});

export const blockSchema = z.discriminatedUnion("kind", [
  proseBlockSchema,
  figureBlockSchema,
  calloutBlockSchema,
  storyBlockSchema,
  activityBlockSchema,
]);

export type Block = z.infer<typeof blockSchema>;

/* ------------------------------------------------------------------------ *
 * Curriculum containers — Lesson -> Module -> Track -> Topic.
 *
 * All IDs are stable strings; progress and the spaced-repetition scheduler
 * reference content by these IDs, so they must stay unique and unchanging.
 * ------------------------------------------------------------------------ */

// A retrieval prompt fed to the spaced-repetition scheduler after a lesson.
export const reviewItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});
export type ReviewItem = z.infer<typeof reviewItemSchema>;

export const lessonSchema = z.object({
  id: z.string().min(1), // globally unique — progress + review key
  title: z.string().min(1),
  estimatedMinutes: z.number().int().min(1),
  blocks: z.array(blockSchema).min(1),
  reviewItems: z.array(reviewItemSchema).optional(),
});
export type Lesson = z.infer<typeof lessonSchema>;

export const moduleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  lessons: z.array(lessonSchema).min(1), // ordered — sequential progression follows this
});
export type Module = z.infer<typeof moduleSchema>;

// How a track advances: a fixed ordered curriculum, or difficulty-scaling drills.
export const progressionSchema = z.enum(["sequential", "adaptive-drill"]);
export type Progression = z.infer<typeof progressionSchema>;

export const trackSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  progression: progressionSchema,
  modules: z.array(moduleSchema).min(1),
});
export type Track = z.infer<typeof trackSchema>;

// Default presentation intent for a topic (informs the prefs profile / styling).
export const pedagogyProfileSchema = z.enum([
  "drill",
  "visual-first",
  "story-driven",
  "text-first",
]);
export type PedagogyProfile = z.infer<typeof pedagogyProfileSchema>;

export const topicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  blurb: z.string().min(1),
  accent: z.string().min(1), // theme accent token, e.g. "--color-accent"
  icon: z.string().min(1),
  pedagogy: pedagogyProfileSchema,
  tracks: z.array(trackSchema).min(1),
});
export type Topic = z.infer<typeof topicSchema>;

// The whole content library is just an array of topics.
export const contentLibrarySchema = z.array(topicSchema);
export type ContentLibrary = z.infer<typeof contentLibrarySchema>;
