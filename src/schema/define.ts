import {
  moduleSchema,
  topicSchema,
  type Module,
  type Topic,
} from "@/schema/schema.ts";

/**
 * Authoring helpers for the content library.
 *
 * Wrapping content in `defineTopic` / `defineModule` does two things:
 *   1. Gives editor autocomplete + type-checking while you write content.
 *   2. Validates against the Zod schema AT LOAD, so a malformed lesson throws
 *      the moment its file is imported — loud failure, not a silent render bug.
 *
 * `.parse` returns the validated value (and throws a descriptive ZodError on
 * failure), so content files read naturally: `export default defineModule({...})`.
 */

export function defineTopic(topic: Topic): Topic {
  return topicSchema.parse(topic);
}

export function defineModule(module: Module): Module {
  return moduleSchema.parse(module);
}
