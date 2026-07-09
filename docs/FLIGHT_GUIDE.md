# ✈️ Flight Guide — build Learning Hub offline

Everything you need is on this machine: dependencies installed, app runs,
teaching is written into the files. **No internet required.** This is your
single reference — start here, come back whenever you're lost.

**The loop for every step:**

1. Open the file named in the step — read its `YOUR TURN` comment (the
   teaching lives there).
2. Open the matching test file and **delete the `.skip`** on that
   `describe.skip(...)` block.
3. Run `npm test` (keep it running — it re-runs on every save). Watch the
   new tests fail **red**. That's correct: red first proves the tests can
   fail, so green means something.
4. Implement until green.
5. Run the app (`npm run dev`) and watch the feature come alive — every TODO
   lights up a visible piece of UI (the 🔧 cards tell you which).
6. Truly stuck after a real attempt? Peek at that ONE solution in
   `docs/SOLUTIONS.md`, understand it, type it yourself (don't paste).
7. Commit: `git add -A && git commit -m "feat(engine): implement <thing>"`.

---

## 1. Commands

| Command                    | What it does                                 |
| -------------------------- | -------------------------------------------- |
| `npm run dev`              | Start the app → http://localhost:5173        |
| `npm test`                 | Run tests in WATCH mode (leave it running)   |
| `npm run test:run`         | Run tests once                               |
| `npm run typecheck`        | Type-check without building                  |
| `npm run lint`             | ESLint — catches mistakes types don't        |
| `npm run format`           | Auto-format everything with Prettier         |
| `npm run validate-content` | Check the content library against the schema |
| `npm run build`            | Full production build (typecheck + bundle)   |

Green before you stop for the day: `test:run`, `typecheck`, `lint`, `build`.

## 2. The map — how a piece of content becomes pixels

```
schema/schema.ts        Zod schemas — THE single source of truth
   ↓ validates
content/…               topic folders (data files; template: learning-about-learning/)
   ↓ read by
engine/…                PURE decisions: what's next, what's due, what changed
   ↓ called by                          (selection / scheduler / session)
pages/…                 routes: Home, Topics, TopicDetail, SessionPlayer, Stats, Onboarding
   ↓ render via
components/BlockRenderer → activities/registry.tsx → activity components
   ↕ progress flows through
hooks/useProgress (base) + selector hooks (useStreak, useDueReviews, …)
   ↓ backed by
store/ProgressStore (interface) ← LocalStorageStore (the ONLY file touching localStorage)
```

The principles, mapped: **schema** = single source of truth (types via
`z.infer`, never hand-written) · **store** = Dependency Inversion (program to
the interface) · **registry/BlockRenderer** = Open/Closed (extend by adding,
never editing) · **hooks** = composition + DRY · **engine** = pure functions
(same inputs → same output; `today`/rng always injected, never read inside).

## 3. Conventions (things that look odd but are deliberate)

- **Imports carry extensions and the alias**: `import … from "@/engine/selection.ts"`
  — `@` = `src/`, and the `.ts`/`.tsx` is required by our config. Copy the
  import style of any neighboring file.
- **Exports**: route-level pages use `export default`; everything else uses
  named exports.
- **Styling**: Tailwind classes referencing tokens from `src/index.css`
  (`bg-surface`, `text-muted`, `border-border`, `rounded-card`…). Never raw
  hex in components. Topic `accent` = a token name (e.g. `"accent"`); topic
  `icon` = one emoji.
- **Content ids**: kebab-case, globally unique, topic-prefixed
  (`lal-forgetting-curve`). Progress is keyed on them — **never rename a
  used id** (that's what migrations are for).
- **Dates** are `"YYYY-MM-DD"` strings everywhere; they compare correctly
  with `<=` (see `reviewIsDue`).
- **State changes are immutable**: build new objects with `{ ...old, field: new }`,
  never assign into the old one. The store and React both depend on this.
- **Versioned saves**: if you ever change `progressStateSchema`, bump
  `PROGRESS_VERSION` and add a step in `store/migrations.ts` — otherwise
  loading silently falls back to a fresh state and wipes real progress.

## 4. The build sequence (do them in this order)

Each step: the TODO number, the file, and how you'll know it's done. Tests
live next to their file (`selection.ts` ↔ `selection.test.ts`). The table is
the quick reference; **§4.1 below explains WHY the order is what it is** —
read it once before you start, because the ordering itself is a software
lesson.

| #   | Step                                         | TODO · file                                 | Done when                                                                                                                      |
| --- | -------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Warm-up** — drill difficulty rule          | #2 · `src/engine/selection.ts`              | `nextDrillLevel` tests green                                                                                                   |
| 2   | **The core loop** — record a finished lesson | #5 · `src/engine/session.ts`                | Tests green; in the app: finish a lesson in _Learning about Learning_ → streak bumps, Stats shows the session, lesson gets a ✓ |
| 3   | **Continue card** — where to pick up         | #1 · `src/engine/selection.ts`              | Tests green; Home's 🔧 "Continue" card becomes a real suggestion                                                               |
| 4   | **What's due** — review filter               | #4 · `src/engine/scheduler.ts`              | Tests green                                                                                                                    |
| 5   | **Due-reviews hook** — clock meets engine    | #7 · `src/hooks/useDueReviews.ts`           | Home's 🔧 "Reviews due" card comes alive (needs step 4)                                                                        |
| 6   | **Spacing algorithm** — the SM-2 heart       | #3 · `src/engine/scheduler.ts`              | Tests green — trace your logic against the worked example in the comment                                                       |
| 7   | **Topic page: summary**                      | #6 · `src/engine/selection.ts`              | Tests green; topic page shows "n / m lessons"                                                                                  |
| 8   | **Topic page: checkmarks**                   | #8 · `src/hooks/useTrackProgress.ts`        | ✓ marks appear on completed lessons                                                                                            |
| 9   | **Backup import**                            | #9 · `src/pages/Stats.tsx`                  | Manual: export → complete another lesson → import → state rolls back; a bogus file shows a friendly error                      |
| 10  | **n-back judgment**                          | #12 · `src/activities/gameLogic.ts`         | Tests green; the n-back game starts (see §5 to try it)                                                                         |
| 11  | **Sequence generator**                       | #13 · `src/activities/gameLogic.ts`         | Tests green; sequence-recall playable                                                                                          |
| 12  | **Pattern scoring**                          | #14 · `src/activities/gameLogic.ts`         | Tests green; pattern game scores                                                                                               |
| 13  | **Capstone** — full component from scratch   | #11 · `src/activities/OrderingActivity.tsx` | The ordering exercise in lesson 2 of the example topic works end-to-end — including YOU registering it in `registry.tsx`       |
| 14  | **Preferences filter**                       | #10 · `src/engine/session.ts`               | Tests green; with a non-"Rich text" profile (set via Onboarding), the deep-dive paragraph in lesson 1 disappears               |

### 4.1 Why this order — how developers actually sequence work

Four rules generate this entire sequence. They're the same rules professionals
use to plan any feature work:

1. **Dependencies before dependents.** If A calls B, build B first —
   otherwise you're building A against something that doesn't exist, and you
   can't test A honestly. (You'll see it below: the `dueReviews` engine
   function comes before the `useDueReviews` hook that calls it.)
2. **Core loop first.** Every product has one interaction that makes it what
   it is — here, _finishing a lesson and having it count_. Build that as
   early as possible: everything after it becomes more testable (you can
   generate real progress data by using the app), and psychologically the
   project is "alive" from that point on.
3. **Work in vertical slices, grouped by context.** A "slice" is one feature
   through all its layers (engine → hook → UI) rather than one layer across
   all features. You ship something _visible_ at each step, and you batch
   work that shares a mental model (all three game functions together) so
   you're not paying the cost of context-switching.
4. **Calibrate difficulty: warm up, then climb, save the novel thing for
   when you're strong, cool down.** Confidence and skill compound within a
   session — order the work to exploit that.

Now the walkthrough — why each step, and why it's _there_:

- **Step 1 — `nextDrillLevel` (#2), the warm-up.** Three lines of pure
  logic, no new concepts. Its real job isn't the feature — it's practicing
  the _workflow_ (unskip → red → implement → green → commit) on something
  where the logic can't be the obstacle. Pilots do a walk-around before
  flying; this is that. Never start a work session with the hardest task.

- **Step 2 — `completeLesson` (#5), the core loop.** The biggest single
  piece, deliberately second. Rule 2: this is the transaction that makes the
  app an app — before it, nothing you do in the UI _counts_; after it,
  finishing a lesson bumps your streak, appends history, schedules a review.
  Doing it early also means every later step can be manually verified
  against _real_ progress data you create by just... using the app. Note
  what it depends on: `bumpStreak` and `newReview` — both provided, both
  already tested. Rule 1 satisfied downward: you're composing solved pieces,
  not building on sand.

- **Step 3 — `continueSuggestion` (#1).** First thing you see on the Home
  screen, and it consumes the data step 2 now produces (`lastPosition`,
  completed lessons). Build producers before consumers — this is rule 1 at
  the _data_ level, not just the function level. It also reuses
  `nextLessonInTrack` (the worked example), teaching the composition habit:
  new features should be mostly assembled from existing verified parts.

- **Steps 4–6 — the reviews slice: `dueReviews` (#4) → `useDueReviews`
  (#7) → `scheduleNext` (#3).** One feature, three layers — a textbook
  vertical slice. The engine filter (#4) must exist before the hook (#7)
  that calls it (rule 1, literally). The hook then makes Home's reviews card
  come alive — visible payoff. Only _then_ the SM-2 algorithm (#3): notice
  the app already _works_ without it (reviews just stay due), so it's
  sequenced as an enhancement inside the slice, not a blocker before it.
  That's a real pattern: ship the simplest working version of a system, then
  deepen it.

- **Steps 7–8 — the topic-page slice: `trackCompletionSummary` (#6) →
  `useTrackProgress` (#8).** Same slice shape (engine → hook), smaller.
  Sequenced here because these are _reads_ of the data the core loop writes
  — by now you have real completions to see. Purely decorative features
  (progress numbers, checkmarks) come after functional ones; users forgive
  missing polish, not a missing product.

- **Step 9 — the import handler (#9).** Your first UI-layer task, and the
  first with no test to lean on — you verify manually (the guide says how).
  Sequenced after the engine work on purpose: in the layered flow
  (data → logic → presentation), UI work is most productive when the logic
  under it is already trustworthy, so any bug you see is almost certainly in
  the layer you just touched. That's the debugging value of building
  bottom-up: each new layer sits on a verified one.

- **Steps 10–12 — the game-logic batch: `isNBackMatch` (#12),
  `generateSequence` (#13), `scorePattern` (#14).** Three small pure
  functions, batched (rule 3): same file, same testing style, same
  "decisions are pure, timers stay in components" idea — one mental model,
  three reps. Each unlocks a playable game, so the reward rate is high.
  They're also a deliberate breather before the capstone: real work
  sessions alternate heavy and light.

- **Step 13 — `OrderingActivity` (#11), the capstone.** The only task where
  you build a whole React component from scratch — state, events, conditional
  rendering, then registering it (your Open/Closed rep). It's last-but-one
  because it's the only _novel_ skill in the list, and by now you've banked
  twelve wins, you've read two reference components, and the app around it
  all works — so if something misbehaves, the suspect list is short. Hard,
  novel work goes where your context is deepest.

- **Step 14 — `shouldShowBlock` (#10), the cool-down.** Technically easy
  (three lines), but it closes the loop on a _product_ idea: it's the first
  place the preferences profile actually changes what renders. Ending on an
  easy, visible win is deliberate — it's the same "end on a success" spacing
  trick this app uses on you.

**The meta-lesson** to take off the plane: the natural rhythm of development
is _core transaction first → producers before consumers → one vertical slice
at a time → polish after function → novel work where your context is deepest_.
When you plan Stage 9 (content) or any future feature, sequence it the same
way.

Then, if you still have runway: author a new module in
`src/content/learning-about-learning/` (copy `01-how-memory-works.ts`), run
`npm run validate-content`, and watch the app grow with **zero app-code
changes** — the whole point of the architecture.

### §5 Trying the games before they're in content

The three games are registered but no lesson uses them yet. Quickest
playground: temporarily add to a lesson's `blocks` in the example topic:

```ts
{ kind: "activity", activity: { type: "n-back", n: 2, trials: 12, intervalMs: 1500 } },
{ kind: "activity", activity: { type: "sequence-recall", length: 4, speedMs: 600 } },
{ kind: "activity", activity: { type: "pattern-recognition", gridSize: 4, targets: 4, flashMs: 1200 } },
```

(`validate-content` will hold you to the schema. Remove them after, or keep —
your app.)

## 6. Glossary — the ideas, with the analogies that landed

- **Pure function**: a vending machine — same coins, same snack, nothing else
  in the building changes. No clocks, no storage, no randomness inside;
  those get passed IN (`today`, `rng`).
- **useState**: React keeps the real value on a **whiteboard**; each render
  gets a **sticky-note copy** (`revealed`). `setRevealed(true)` rewrites the
  whiteboard and orders a redraw — it never changes your current sticky note.
  That's why you never write `revealed = true`.
- **`this` and why methods get unbound**: `store.update(x)` reads as "update,
  _belonging to store_". If you copy the method out (`const f = store.update`)
  and call `f()`, the "belonging to" is lost — `this` is undefined. Fix: keep
  the dot at the call site, `(x) => store.update(x)`. (This bug really
  happened — see `useProgress.ts`.)
- **Discriminated union**: shapes tagged by a field (`kind`/`type`);
  TypeScript narrows by reading the tag. `blockSchema`, `activitySchema`.
- **`z.infer`**: the type is _derived from_ the schema — one definition, so
  validator and type can't drift (single source of truth).
- **Dependency Inversion**: the app depends on the socket (`ProgressStore`
  interface), not the appliance (`LocalStorageStore`). Swap appliances freely.
- **Open/Closed**: extend by _plugging in_ (a registry entry), not by
  _rewiring the wall_ (editing the renderer).
- **Immutable update**: `{ ...state, streak: … }` builds a NEW object; React
  detects change by identity, so mutating in place renders nothing.
- **JSX `{}` vs `()`**: `{expr}` injects a JavaScript value; `(text)` is
  literal text. `<p>{activity.answer}</p>` ✔ — `<p>(activity.answer)</p>` ✘.
- **`??`**: fallback-if-missing. `a ?? b` = "a, unless it's null/undefined,
  then b".
- **`Object.entries(obj)`**: dictionary → array of `[key, value]` pairs, so
  you can loop/filter a Record.
- **try/catch**: `try { risky() } catch (error) { handle }` — in a catch,
  `error` is unknown; get text with
  `error instanceof Error ? error.message : String(error)`.

## 7. Troubleshooting

| Symptom                                                               | Likely cause → fix                                                                                                                                   |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Cannot find module '@/…'`                                            | Import path missing `.ts`/`.tsx` extension, or a typo — compare with a neighbor's import                                                             |
| `'x' is declared but its value is never read`                         | Strict rule: unused variable/import fails the build — delete it (or you forgot to use it)                                                            |
| Test stays green after you break something on purpose                 | You edited a different `describe` than you unskipped, or `npm test` isn't watching that file                                                         |
| Red test: `expected [ … ] to deeply equal [ … ]`                      | Read the diff top-to-bottom — the first differing field names the rule you missed                                                                    |
| `Cannot read properties of undefined (reading 'state')`               | An unbound method — you passed `store.method` bare; wrap it: `(x) => store.method(x)`                                                                |
| A page shows the big red error card                                   | Open the browser console (⌥⌘J) — the first stack-trace line with `src/` in it is yours                                                               |
| 🔧 card won't go away after implementing                              | Hard-refresh (⌘⇧R); if it persists, the TODO `throw` line is still in the function                                                                   |
| `Type 'string' is not assignable to type 'never'` on a registry entry | The key doesn't match the schema's `type` literal exactly (check hyphens/quotes)                                                                     |
| Streak didn't bump after finishing a lesson                           | Second session same day is a no-op by design (`bumpStreak`); check Stats history to confirm the session recorded                                     |
| Progress vanished after a schema edit                                 | You changed `progressStateSchema` without a migration — see §3 last bullet; restore from an exported backup (Stats → Export… you did export, right?) |

## 8. If everything breaks

`git log --oneline` shows the stage commits. `git stash` parks your current
mess so you can re-run checks from the last good commit; `git stash pop`
brings it back. Nothing you do in the working tree can hurt the committed
history — experiment freely.
