/** Shown by a game whose pure-logic YOUR TURN isn't implemented yet. */
export function TodoCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface p-4">
      <p className="text-sm font-medium text-warning">🔧 This game needs you</p>
      <p className="mt-1 text-sm text-faint">Unlocks when you finish: {message}</p>
    </div>
  );
}
