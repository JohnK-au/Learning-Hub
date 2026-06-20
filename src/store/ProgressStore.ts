import { z } from "zod";

/**
 * PERSISTED PROGRESS — shape + the store abstraction.
 *
 * This file defines WHAT progress looks like and the INTERFACE for reading and
 * writing it — but not HOW it is stored. The concrete storage (localStorage)
 * lives in LocalStorageStore.ts and is the only file that knows about the
 * browser. Everything else in the app depends on the `ProgressStore` interface.
 *
 * That is the Dependency Inversion Principle: high-level code depends on an
 * abstraction, not a detail. Swapping localStorage for a hosted backend later
 * means writing one new class that implements this interface — no app changes.
 */

/* --- The persisted state shape (validated on load, so old/corrupt data can't
       crash the app) ------------------------------------------------------ */

export const sessionRecordSchema = z.object({
  date: z.string(), // ISO date string (YYYY-MM-DD)
  topicId: z.string(),
  trackId: z.string(),
  lessonIds: z.array(z.string()),
  score: z.number().optional(),
});

export const trackProgressSchema = z.object({
  completedLessonIds: z.array(z.string()),
  currentLessonId: z.string().optional(),
  lastActiveAt: z.number(), // epoch ms
});

export const drillStatSchema = z.object({
  level: z.number().int(),
  attempts: z.number().int(),
  bestScore: z.number(),
  lastScore: z.number(),
});

export const reviewStateSchema = z.object({
  ease: z.number(),
  intervalDays: z.number(),
  dueDate: z.string(), // ISO date string
});

export const progressStateSchema = z.object({
  version: z.number().int(),
  streak: z.object({
    current: z.number().int(),
    longest: z.number().int(),
    lastActiveDate: z.string().nullable(),
  }),
  history: z.array(sessionRecordSchema),
  tracks: z.record(z.string(), trackProgressSchema), // keyed by trackId
  drills: z.record(z.string(), drillStatSchema), // keyed by drill/lesson id
  reviews: z.record(z.string(), reviewStateSchema), // keyed by lesson id
  lastPosition: z
    .object({ topicId: z.string(), trackId: z.string() })
    .optional(),
});

export type ProgressState = z.infer<typeof progressStateSchema>;

/** Bump when the persisted shape changes incompatibly (then add a migration). */
export const PROGRESS_VERSION = 1;

/** A fresh, empty progress state for first run or unreadable storage. */
export function createDefaultProgressState(): ProgressState {
  return {
    version: PROGRESS_VERSION,
    streak: { current: 0, longest: 0, lastActiveDate: null },
    history: [],
    tracks: {},
    drills: {},
    reviews: {},
  };
}

/* --- The abstraction every consumer depends on ------------------------- */

export interface ProgressStore {
  /** Current state. Treated as immutable — never mutate the returned object. */
  getState(): ProgressState;

  /**
   * Replace state by applying a pure function to the current state. The mutator
   * must return a NEW object (so subscribers can detect the change by identity),
   * after which the store persists and notifies listeners.
   */
  update(mutate: (state: ProgressState) => ProgressState): void;

  /** Register a change listener; returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;

  /** Serialize the full state for backup. */
  exportJSON(): string;

  /** Replace state from a backup string (validated; throws if invalid). */
  importJSON(json: string): void;
}
