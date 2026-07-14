import { useRef, useState } from "react";
import { useProgress } from "@/hooks/useProgress.ts";
import { useStreak } from "@/hooks/useStreak.ts";
import { useProgressStore } from "@/store/ProgressContext.tsx";

/**
 * Stats — streak, session history, and backup (export/import).
 * Export is the worked example; import is YOUR TURN #9.
 */
export default function Stats() {
  const streak = useStreak();
  const { state } = useProgress();
  const store = useProgressStore();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Stats</h1>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Current streak" value={`${streak.current}d`} />
        <StatTile label="Longest streak" value={`${streak.longest}d`} />
        <StatTile label="Sessions" value={String(state.history.length)} />
      </div>

      <HistoryList history={state.history} />

      <div className="space-y-4 rounded-card border border-border bg-surface p-5">
        <h2 className="font-semibold">Backup</h2>
        <p className="text-sm text-muted">
          Progress lives in this browser only. Export a JSON backup, or import
          one to restore (for example, on another machine).
        </p>
        <div className="flex gap-3">
          <ExportButton exportJSON={() => store.exportJSON()} />
          <ImportButton importJSON={(json) => store.importJSON(json)} />
        </div>
      </div>
    </section>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <p className="text-xs text-faint">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function HistoryList({
  history,
}: {
  history: { date: string; topicId: string; lessonIds: string[] }[];
}) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-faint">
        No sessions yet — finish a lesson and it shows up here.
      </p>
    );
  }
  // Newest first; show the last 20 to keep the page snappy.
  const recent = history.slice(-20).reverse();
  return (
    <ul className="space-y-1">
      {recent.map((record, index) => (
        <li
          key={index}
          className="flex justify-between rounded-lg bg-surface px-3 py-2 text-sm"
        >
          <span className="text-muted">{record.date}</span>
          <span>
            {record.topicId} · {record.lessonIds.length} lesson
            {record.lessonIds.length === 1 ? "" : "s"}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * WORKED EXAMPLE — downloading a file from the browser has a standard
 * incantation: make a Blob (a file-like chunk of bytes), mint a temporary
 * URL for it, "click" an invisible link pointing at that URL, then revoke
 * the URL to free the memory.
 */
function ExportButton({ exportJSON }: { exportJSON: () => string }) {
  function onExport() {
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `learning-hub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={onExport}
      className="rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent"
    >
      Export progress
    </button>
  );
}

/* -------------------------------------------------------------------------- *
 * YOUR TURN #9 — the import handler.
 * -------------------------------------------------------------------------- *
 * The plumbing (file picker, reading the file, message display) is done.
 * Implement `handleImportedText`: it receives the file's text and must
 *
 *   1. call importJSON(text) — your Stage-3 method: it validates against the
 *      schema and THROWS if the backup is invalid, so…
 *   2. …wrap the call in try/catch (you've seen this shape in onFinish in
 *      SessionPlayer.tsx):
 *        - success → setMessage("Progress restored ✓")
 *        - failure → setMessage(the error's message)
 *          (error is `unknown` in a catch; get text safely with
 *           `error instanceof Error ? error.message : String(error)`)
 *
 * Verify manually: Export a backup → finish another lesson → Import the
 * backup → stats roll back to the exported snapshot. Then try importing any
 * non-backup .json — you should see a friendly error, not a crash. That
 * validation is your own Stage-3 `safeParse` doing its job.
 */
function ImportButton({ importJSON }: { importJSON: (json: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleImportedText(text: string) {
    try {
      importJSON(text);
      setMessage("Progress restored ✓");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }

  async function onFileChosen(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    try {
      handleImportedText(text);
    } catch (error) {
      // Until #9 is done, surface the TODO instead of crashing.
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(event) => onFileChosen(event.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-border bg-surface px-4 py-2 text-sm transition-colors hover:bg-surface-raised"
      >
        Import backup…
      </button>
      {message && <p className="mt-2 text-sm text-muted">{message}</p>}
    </div>
  );
}
