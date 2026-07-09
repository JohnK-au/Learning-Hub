import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** What to show instead of a crash. A function receives the error. */
  fallback?: ReactNode | ((error: Error) => ReactNode);
}
interface State {
  error: Error | null;
}

/**
 * Catches errors thrown while rendering anything inside it and shows a
 * fallback instead of unmounting the whole app to a white screen.
 *
 * This is a CLASS component — the one place React still requires one,
 * because only classes get the `componentDidCatch`/`getDerivedStateFromError`
 * lifecycle. Think of it as a circuit breaker: an error in one room trips
 * this breaker instead of blacking out the house. You won't need to write
 * one of these yourself; you just wrap things in it.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error === null) return this.props.children;

    const { fallback } = this.props;
    if (typeof fallback === "function") return fallback(error);
    if (fallback !== undefined) return fallback;

    return (
      <div className="rounded-card border border-danger/40 bg-surface p-6">
        <p className="font-medium text-danger">Something went wrong here.</p>
        <p className="mt-1 text-sm text-muted">{error.message}</p>
      </div>
    );
  }
}

/**
 * Wraps a feature that depends on a YOUR TURN function. Until that function
 * is implemented (its body throws "TODO: …"), this renders a friendly card
 * naming exactly which TODO unlocks the feature — so the app always runs,
 * and finishing a TODO makes a visible piece of UI come alive.
 */
export function Unbuilt({
  feature,
  children,
}: {
  feature: string;
  children: ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="rounded-card border border-dashed border-border bg-surface p-4">
          <p className="text-sm font-medium text-warning">🔧 {feature}</p>
          <p className="mt-1 text-sm text-faint">
            Unlocks when you finish: {error.message}
          </p>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
