import type { Lesson, Module, Topic, Track } from "@/schema/schema.ts";
import {
  createDefaultProgressState,
  type ProgressState,
} from "@/store/ProgressStore.ts";

/**
 * Tiny builders for test data. Tests read best when they only mention what
 * matters to THAT test; these fill in every required field with a sane
 * default and let a test override the parts it cares about.
 */

export function makeLesson(id: string, overrides: Partial<Lesson> = {}): Lesson {
  return {
    id,
    title: `Lesson ${id}`,
    estimatedMinutes: 2,
    blocks: [{ kind: "prose", body: `Body of ${id}.` }],
    ...overrides,
  };
}

export function makeModule(
  id: string,
  lessons: Lesson[],
  overrides: Partial<Module> = {},
): Module {
  return {
    id,
    title: `Module ${id}`,
    summary: `Summary of ${id}.`,
    lessons,
    ...overrides,
  };
}

export function makeTrack(
  id: string,
  modules: Module[],
  overrides: Partial<Track> = {},
): Track {
  return {
    id,
    title: `Track ${id}`,
    progression: "sequential",
    modules,
    ...overrides,
  };
}

export function makeTopic(
  id: string,
  tracks: Track[],
  overrides: Partial<Topic> = {},
): Topic {
  return {
    id,
    title: `Topic ${id}`,
    blurb: `Blurb for ${id}.`,
    accent: "accent",
    icon: "✨",
    pedagogy: "text-first",
    tracks,
    ...overrides,
  };
}

/** A fresh ProgressState with any slice overridden. */
export function makeProgress(
  overrides: Partial<ProgressState> = {},
): ProgressState {
  return { ...createDefaultProgressState(), ...overrides };
}
