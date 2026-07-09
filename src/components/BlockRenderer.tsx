import type { Block } from "@/schema/schema.ts";
import { Markdown } from "@/components/Markdown.tsx";
import { ActivityRenderer } from "@/activities/registry.tsx";

/**
 * Renders a single lesson block.
 *
 * Block kinds are a small, stable set, so a switch is the right tool here.
 * Activities, which we expect to grow over time, go through the registry
 * instead — that's the part that stays open for extension.
 */
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "prose":
      return <Markdown>{block.body}</Markdown>;

    case "figure":
      return (
        <figure className="space-y-2">
          <img
            src={block.src}
            alt={block.alt}
            className="rounded-lg border border-border"
          />
          {block.caption && (
            <figcaption className="text-sm text-faint">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "callout":
      return (
        <aside className="rounded-lg border border-border bg-surface-raised p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent">
            {block.variant}
          </p>
          <Markdown>{block.body}</Markdown>
        </aside>
      );

    case "story":
      return (
        <blockquote className="border-l-2 border-accent pl-4 italic text-muted">
          {block.speaker && (
            <p className="mb-1 text-xs not-italic text-faint">
              {block.speaker}
            </p>
          )}
          <Markdown>{block.body}</Markdown>
        </blockquote>
      );

    case "activity":
      return (
        <div className="rounded-card border border-border bg-surface p-4">
          <ActivityRenderer activity={block.activity} />
        </div>
      );

    default:
      // Exhaustiveness check: if a new block kind is added to the schema and
      // not handled above, TypeScript flags this line at compile time.
      return assertNever(block);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled block kind: ${JSON.stringify(value)}`);
}
