import process from "node:process";
import { topics } from "@/content/index.ts";
import { contentLibrarySchema, type Topic } from "@/schema/schema.ts";

/**
 * Validates the entire content library:
 *   1. Every topic matches the Zod schema (shape + field constraints).
 *   2. Cross-cutting invariants the schema can't express on its own —
 *      globally-unique ids, and valid `correctOrder` permutations.
 *
 * Run with `npm run validate-content`. Exits non-zero on any problem so it can
 * gate a build or commit.
 */

const errors: string[] = [];

// 1. Schema validation (collects all issues at once).
const parsed = contentLibrarySchema.safeParse(topics);
if (!parsed.success) {
  for (const issue of parsed.error.issues) {
    errors.push(`schema: ${issue.path.join(".")} — ${issue.message}`);
  }
}

// 2. Structural invariants beyond the schema.
const seenIds = new Map<string, string>(); // id -> where it was first seen

function requireUnique(id: string, where: string) {
  const prior = seenIds.get(id);
  if (prior) errors.push(`duplicate id "${id}" (in ${where} and ${prior})`);
  else seenIds.set(id, where);
}

for (const topic of topics as Topic[]) {
  requireUnique(topic.id, `topic ${topic.title}`);
  for (const track of topic.tracks) {
    requireUnique(track.id, `track ${topic.id}/${track.id}`);
    for (const mod of track.modules) {
      requireUnique(mod.id, `module ${track.id}/${mod.id}`);
      for (const lesson of mod.lessons) {
        requireUnique(lesson.id, `lesson ${mod.id}/${lesson.id}`);
        for (const block of lesson.blocks) {
          if (block.kind === "activity" && block.activity.type === "ordering") {
            const { items, correctOrder } = block.activity;
            const valid =
              correctOrder.length === items.length &&
              new Set(correctOrder).size === items.length &&
              correctOrder.every((i) => i >= 0 && i < items.length);
            if (!valid) {
              errors.push(
                `lesson "${lesson.id}": ordering activity correctOrder is not a permutation of items`,
              );
            }
          }
        }
      }
    }
  }
}

const lessonCount = topics.reduce(
  (n, t) =>
    n +
    t.tracks.reduce(
      (m, tr) => m + tr.modules.reduce((k, md) => k + md.lessons.length, 0),
      0,
    ),
  0,
);

if (errors.length > 0) {
  console.error(`\n✗ Content validation failed (${errors.length}):\n`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error("");
  process.exit(1);
}

console.log(
  `✓ Content valid — ${topics.length} topic(s), ${lessonCount} lesson(s).`,
);
