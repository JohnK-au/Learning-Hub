# List of questions for Claude after the flight

I would like Claude to answer the questions here, storing the answer to each question just below its associated question.

---

1. When there is an export prior to function ..., what is the export doing?

**Answer:** `export` makes that function visible to _other files_. A file only shares the things it marks `export`; everything else stays private to that file. When another file writes `import { nextLessonInTrack } from "@/engine/selection.ts"`, that only works because `selection.ts` wrote `export function nextLessonInTrack`.

Analogy: each file is a locked room. `export` puts a labelled item on a shelf in the shared hallway so other rooms can grab it by name. No `export` → it stays locked in the room, usable only inside that one file.

(`export default` is the same idea but marks the _one_ main thing a file offers — that's why pages use it: `import Home from "@/pages/Home.tsx"` needs no braces because `Home` is that file's default.)

---

2. I am a bit confused about how these functions work, like nextLessonInTrack. Can you walk through how it works and how it flows through the code?

**Answer:** The job of `nextLessonInTrack`: _"given a track and my progress, which is the next lesson I haven't finished?"_

```ts
export function nextLessonInTrack(track, progress): Lesson | null {
  const completed = new Set(
    progress.tracks[track.id]?.completedLessonIds ?? [],
  );
  for (const module of track.modules) {
    for (const lesson of module.lessons) {
      if (!completed.has(lesson.id)) return lesson;
    }
  }
  return null;
}
```

Line by line:

- `completed` = the set of lesson-ids I've already finished in this track (see Q4 for that line in detail).
- `for (const module of track.modules)` — a track is a list of modules, in curriculum order; walk them in order.
- `for (const lesson of module.lessons)` — each module is a list of lessons, in order; walk them in order.
- `if (!completed.has(lesson.id)) return lesson;` — the **first** lesson whose id is NOT in `completed` is the next one to do. `return` immediately hands it back and stops both loops.
- `return null;` — if we walked every lesson and they were all completed, there's nothing next → the track is finished.

How it flows through the app: this is a **pure decision function** — it touches no store, no screen, just inputs → output. Two callers feed it data:

- `SessionPlayer.tsx` calls `nextLessonInTrack(track, state)` to decide which lesson to put on screen.
- `continueSuggestion` (in the same file) calls it once per track to find where you should resume.

So the pages fetch the messy real-world data (the track from the content library, `state` from the store) and hand it to this clean function; it just answers the question.

---

3. Why does track.id work when the only variable in the function was track: Track?

**Answer:** `track: Track` is **two different things** joined by the colon:

- `track` (left of `:`) is the **variable** — the actual value passed in when the function is called.
- `Track` (right of `:`) is its **type** — a description of the _shape_ that value has.

`track.id` reads the `id` field off the value. It works because the type `Track` declares that every track has an `id: string` (see `trackSchema` in `src/schema/schema.ts`). So the value carries the data; the type just promises which fields exist so the editor/compiler know `.id` is legal.

Rule of thumb: a lowercase name _before_ a colon is a value; a Capitalized name _after_ a colon is usually a type. You only ever _use_ the value (`track.id`); the type is scaffolding for the tools.

---

4. I'm confused how this works:

```
): Lesson | null {
const completed = new Set(
progress.tracks[track.id]?.completedLessonIds ?? [],
);
```

**Answer:** Read it from the **inside out** — that's the trick with any nested expression.

1. `progress.tracks` — a dictionary (object used as a lookup table): trackId → that track's progress record.
2. `progress.tracks[track.id]` — look up **this** track's record by its id. It might be `undefined` (you've never touched this track).
3. `?.completedLessonIds` — the `?.` means _"if the thing on the left is undefined, stop here and give `undefined` instead of crashing."_ If the record exists, this reads its `completedLessonIds` array (the ids you've finished).
4. `?? []` — _"if the left side came out undefined, use `[]` (an empty array) instead."_ So a never-touched track becomes "nothing completed" rather than `undefined`.
5. `new Set(...)` — wrap that array in a `Set`, which makes `.has(id)` fast and readable.

Net meaning: _"the set of lesson-ids I've completed in this track — or an empty set if I've never done any."_ The `?.` and `?? []` are both guards so the code doesn't explode when a track has no saved progress yet.

Also, `): Lesson | null {` above it is just the function's **return type**: this function hands back either a `Lesson` or `null`.

---

5. How am I supposed to know when it is track.modules or modules.lessons?

**Answer:** It follows the fixed data hierarchy: **Topic → Track → Module → Lesson.** A `Track` has a field called `modules`; a `Module` has a field called `lessons`. So:

- `track.modules` — reach into a _track_ for its modules.
- `module.lessons` — reach into a _module_ for its lessons.

Two reliable ways to always know which is which:

1. **Look at the schema** (`src/schema/schema.ts`): `trackSchema` lists `modules`; `moduleSchema` lists `lessons`. That file is the map of what-contains-what.
2. **Let the editor tell you:** type `track.` and autocomplete shows exactly the fields a Track has (`id`, `title`, `progression`, `modules`) — it will _not_ offer `lessons`, because a track doesn't have lessons directly; its modules do. That autocomplete list is the type guiding your hand.

---

6. I'm also confused how you know what to define a variable as in a function. For example, how did you know to define streak as ProgressState["streak"]?

**Answer:** `ProgressState["streak"]` means _"the type of the `streak` field inside `ProgressState`."_ It's called an **indexed access type** — same square-bracket syntax you use to read a value, but done at the type level to read a _type_.

`bumpStreak` receives `state.streak` and returns a new value of the **exact same shape**. Rather than hand-copy that shape (`{ current: number; longest: number; lastActiveDate: string | null }`), we ask TypeScript for "whatever the streak field's type already is." Why: **single source of truth** — if the streak shape ever changes in the schema, `bumpStreak` updates automatically, no edit needed.

How you'd know to reach for it: whenever a function operates on **one slice of a bigger typed object**, use `BigType["fieldName"]` instead of re-describing the slice.

---

7. I'm still confused about the scheduler dueReviews function... I am confused what the 'review' variable passed into the ReviewIsDue function is and where it comes from?

**Answer:** Here's the function:

```ts
return Object.entries(progress.reviews)
  .filter(([, review]) => reviewIsDue(review, today))
  .map(([lessonId]) => lessonId);
```

Follow the data through three shapes:

1. `progress.reviews` is a **dictionary**: lessonId → ReviewState, e.g.
   `{ "lal-forgetting-curve": { ease, intervalDays, dueDate }, "mt-major-scale": {…} }`.
2. `Object.entries(...)` turns that dictionary into an **array of [key, value] pairs**:
   `[ ["lal-forgetting-curve", {ease,…}], ["mt-major-scale", {ease,…}] ]`.
3. `.filter(([, review]) => …)` runs once **per pair**. The `([, review])` is destructuring each pair: the empty slot before the comma skips the first element (the lessonId), and `review` grabs the second element. So **`review` is each lesson's `ReviewState`** — it comes straight from the _values_ of your reviews dictionary, handed to you one at a time as `filter` walks the array. `reviewIsDue(review, today)` then checks that review's `dueDate` and keeps only the pairs that are due.
4. `.map(([lessonId]) => lessonId)` destructures each surviving pair to grab just the **first** slot (the id), discarding the ReviewState — so you end with an array of lesson-ids.

The whole arc: **dictionary → [id, review] pairs → keep the due ones (using `review`) → return just their ids.** `review` never comes from outside; it _is_ each value in `progress.reviews`.

---

8. I don't understand what you mean by destructuring in the syntax cheat sheet ('grab a field into a variable')?

**Answer:** Destructuring is shorthand for pulling pieces **out** of an object (or array) into their own variables, in one line.

**Object form** — by field name:

```ts
// the long way:
const result = useProgress(); // result is { state: {...}, update: fn }
const state = result.state;

// destructuring — same outcome, one line:
const { state } = useProgress(); // "reach into the returned object, grab its `state` field, name it `state`"
```

The `{ }` on the **left** of `=` is the tell — it's not _building_ an object, it's _unpacking_ one. Grab several at once: `const { state, update } = useProgress()`.

**Array form** — by position, not name:

```ts
const [current, setter] = useState(false); // item 0 → `current`, item 1 → `setter`
```

That's exactly why `useState` is written with `[ ]`: it returns a 2-item array and you unpack both slots.

So "grab a field into a variable" = take one named piece out of a bigger object and give it its own name so you can use it directly instead of writing `result.state` everywhere.

---

9. I don't understand TODO #5 at all... We need to go through line by line... I definitely don't understand what 'args' is.

**Answer:** First, **`args`**. Instead of five separate parameters, `completeLesson` takes **one** parameter — an object called `args` that bundles all the inputs together. Its shape is the `CompleteLessonArgs` type:

```ts
interface CompleteLessonArgs {
  topicId: string;
  trackId: string;
  lesson: Lesson;
  today: string; // "YYYY-MM-DD"
  now: number; // epoch milliseconds
}
```

So `args.trackId`, `args.lesson`, `args.today` are the individual inputs. Why bundle them instead of `completeLesson(state, topicId, trackId, lesson, today, now)`? (1) At the call site you pass them **by name** — `completeLesson(s, { topicId, trackId, lesson, today, now })` — so you can't accidentally swap two of the strings; (2) you can add another field later without re-ordering everything. `args` is just the conventional name for "the bag of arguments."

Now the body. Goal: take the current `state` + the finished lesson, return a brand-new state with it recorded. **Nothing mutates `state`** — every step is "copy, then override."

```ts
const existing = state.tracks[args.trackId] ?? {
  completedLessonIds: [],
  lastActiveAt: 0,
};
```

Look up this track's current progress record. If it's never been touched (`undefined`), `??` falls back to a fresh blank record, so `existing` is always a real object below.

```ts
const completedLessonIds = existing.completedLessonIds.includes(args.lesson.id)
  ? existing.completedLessonIds
  : [...existing.completedLessonIds, args.lesson.id];
```

Decide the new completed-list. `includes(...)` asks "is this lesson already recorded?" If **yes**, keep the list as-is (no duplicate). If **no**, build a NEW array of the old ids plus this one (`[...old, newId]`). This is the no-duplicates guard.

```ts
const hasReviewItems = (args.lesson.reviewItems?.length ?? 0) > 0;
```

Does this lesson carry review questions? `reviewItems?.length` is the count (or `undefined` if the field is absent), `?? 0` turns `undefined` into `0`, `> 0` makes it a plain true/false.

```ts
const reviews =
  hasReviewItems && !state.reviews[args.lesson.id]
    ? { ...state.reviews, [args.lesson.id]: newReview(args.today) }
    : state.reviews;
```

Decide the new reviews dictionary. **Only if** the lesson has review items **and** there's no existing review for it (`!state.reviews[...]`), add one scheduled for today: `{ ...oldReviews, [id]: newReview(today) }` copies the whole old dictionary and adds one entry. (`[args.lesson.id]` is a **computed key** — use the _value_ of that variable as the key.) Otherwise leave reviews untouched, so an existing schedule isn't reset.

```ts
return {
  ...state, // 1. copy every existing field
  streak: bumpStreak(state.streak, args.today), // 2. override streak
  tracks: {
    // 3. override tracks
    ...state.tracks, //    copy all tracks…
    [args.trackId]: {
      //    …then replace THIS one
      completedLessonIds,
      currentLessonId: args.lesson.id,
      lastActiveAt: args.now,
    },
  },
  history: [
    ...state.history,
    {
      // 4. append one session record
      date: args.today,
      topicId: args.topicId,
      trackId: args.trackId,
      lessonIds: [args.lesson.id],
    },
  ],
  reviews, // 5. the dictionary from above
  lastPosition: { topicId: args.topicId, trackId: args.trackId }, // 6. remember where we were
};
```

`...state` first copies **everything**; each line after it _overrides one field_ with an updated copy. That "spread then override" is the immutable-update pattern React and the store both depend on — you're never changing the old state, you're producing a new one.

_(You copied this to keep moving, which was the right call. Want to properly cement it? Next session, delete your `completeLesson` body and rebuild it from these notes with me watching each line.)_

---

10. I'm confused by the rng example in the gameLogic.ts. Let's review this.

**Answer:** `rng` (random-number generator) is a **function you pass in** that returns a random decimal from 0 (inclusive) to 1 (exclusive) each time you call it — exactly what `Math.random()` does.

```ts
export type Rng = () => number; // "a function taking nothing, returning a number"

export function randomInt(rng: Rng, max: number): number {
  return Math.floor(rng() * max);
}
```

`randomInt(rng, 9)`: call `rng()` → say `0.42`; multiply by 9 → `3.78`; `Math.floor` drops the decimal → `3`. So it turns a 0–1 decimal into a whole number `0 … max-1`. (`0.0` → 0; `0.999` → 8.)

The key design choice: **why pass `rng` in** instead of calling `Math.random()` inside? Because a function that calls `Math.random()` internally is untestable — it gives a different answer every run. By taking `rng` as a parameter, the real game passes `Math.random`, but a **test** passes a _fake_ one with scripted values:

```ts
function fakeRng(values) {
  let i = 0;
  return () => values[i++];
}
const rng = fakeRng([0.0, 0.5, 0.99]); // returns 0.0, then 0.5, then 0.99
```

Now the test knows exactly what `randomInt` will produce and can assert on it. Same trick as injecting `today` into the scheduler: push the unpredictable thing _out_ to the caller so the function itself stays a predictable vending machine.

---

11. I don't understand the generateSequence function at all.

**Answer:**

```ts
export function generateSequence(length: number, rng: Rng): number[] {
  const sequence: number[] = [];
  for (let i = 0; i < length; i++) {
    let cell = randomInt(rng, 9);
    while (cell === sequence[i - 1]) {
      cell = randomInt(rng, 9);
    }
    sequence.push(cell);
  }
  return sequence;
}
```

Goal: build a list of `length` random cell numbers (0–8), with **no two neighbours the same**.

- `const sequence: number[] = []` — start with an empty list to fill.
- `for (let i = 0; i < length; i++)` — repeat `length` times; `i` is the slot we're filling (0, 1, 2…).
- `let cell = randomInt(rng, 9)` — pick a random cell 0–8. `let`, not `const`, because we might re-pick.
- `while (cell === sequence[i - 1]) { cell = randomInt(rng, 9); }` — `sequence[i - 1]` is the **previous** cell we added. If the new pick equals it, re-pick; keep going until it differs. (On the first pass `i - 1` is `-1`, and `sequence[-1]` is `undefined`, which never equals a number — so the first pick is always accepted, no special case needed.)
- `sequence.push(cell)` — add the accepted cell.
- `return sequence` after the loop.

**Concrete trace** with a fake rng scripted to `[0.5, 0.5, 0.0]` (→ 4, 4, 0):

- `i=0`: pick 4. previous `sequence[-1]` = `undefined`; 4 ≠ undefined → accept. `sequence = [4]`.
- `i=1`: pick 4. previous `sequence[0]` = 4; 4 === 4 → re-pick → next scripted value `0.0` → 0; 0 ≠ 4 → accept. `sequence = [4, 0]`.

Result `[4, 0]` — the duplicate 4 was rejected and re-rolled. That's exactly the "re-rolls when two consecutive cells would repeat" test.

---

12. Ok I am also skipping the manual implementation of TODOs #11 and #12. I really don't understand how to build a react component so we will need to go through them together.

**Answer:** Agreed — this one's best done **live**, not read. So here's the mental model now, and a plan to build one together next.

**The anatomy of any React component** (a component is just a function that draws UI):

1. **Props** — its inputs (data + callbacks), passed by whoever uses it.
2. **State** — values that change over time, held in `useState` so they survive re-renders.
3. **Handlers** — functions that run on events (a click, a keypress) and update state.
4. **Return JSX** — a description of what to draw. React re-runs the function whenever state changes and repaints from the new JSX.

Your `OrderingActivity` through that lens:

- **Props:** `{ activity, onResult }` — the data to show, and a callback to report the result.
- **State:** `const [picked, setPicked] = useState<number[]>([])` — the indexes tapped so far, in order. Starts empty.
- **Derived values:** `complete` and `correct` are _computed from_ `picked` each render — not state, just calculations.
- **Handler:** `pick(index)` — guards against double-taps, appends with `setPicked([...picked, index])` (immutable!), and when the list is full reports right/wrong via `onResult`.
- **JSX:** the prompt, a `.map` turning each item into a button, and conditional feedback (`{complete && …}`).

The three ideas that make components click: **state is memory that survives re-renders; you change it only through the setter (never `picked = …`); and the screen is a pure function of the current state** (React redraws from `picked` every time it changes).

**Plan for next session:** we delete one component together and rebuild it from scratch — you write each piece (state → handler → JSX) with me checking every line, exactly like we did the store. `RecallActivity` is the gentlest start (one boolean of state); `OrderingActivity` is the fuller rep. Just say "let's build a component" and we'll go.

_(Note from the review: your `OrderingActivity` code is correct, but it wasn't registered in `registry.tsx`, so its exercises weren't actually showing. I registered it — that's the Open/Closed "plug it in" step. It now renders in the Music Theory and History ordering exercises.)_
