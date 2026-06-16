import { NavLink, Outlet } from "react-router-dom";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/topics", label: "Topics", end: false },
  { to: "/stats", label: "Stats", end: false },
] as const;

/**
 * App shell: a header with primary navigation and a routed content outlet.
 * Layout owns chrome only — pages own their own content (separation of concerns).
 */
export default function Layout() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-accent-strong text-sm text-white">
              L
            </span>
            <span>Learning Hub</span>
          </NavLink>
          <nav className="flex items-center gap-1 text-sm">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-1.5 transition-colors",
                    isActive
                      ? "bg-surface-raised text-text"
                      : "text-muted hover:text-text hover:bg-surface",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
