import { Link } from "react-router-dom";

/** Fallback for unmatched routes. */
export default function NotFound() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
      <p className="text-muted">That page doesn’t exist.</p>
      <Link
        to="/"
        className="inline-block rounded-lg bg-accent-strong px-4 py-2 text-sm text-white"
      >
        Back home
      </Link>
    </section>
  );
}
