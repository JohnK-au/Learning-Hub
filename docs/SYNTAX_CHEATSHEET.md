# JS/TS pocket reference — offline MDN substitute

Every syntax tool the 14 YOUR TURNs need, with examples in this codebase's
style. When you think "how do I write that in JavaScript?", look here first.

## Variables

```ts
const x = 5; // can't be reassigned — the default; use it unless you must reassign
let y = 0; // can be reassigned:  y = y + 1  /  y++
```

`const` on an array/object means the _binding_ is fixed — the contents could
still be mutated, which is why our immutability rule is a discipline, not
enforced by `const`.

## Functions

```ts
// Declaration — params and return get type annotations
function add(a: number, b: number): number {
  return a + b;
}

// Arrow — same thing, expression form; braces + return when multi-line
const add = (a: number, b: number): number => a + b;

// Optional param (?) and default value (=)
function greet(name: string, punctuation = "!"): string {
  return `Hi ${name}${punctuation}`;
}

// A function as a PARAMETER (you call it like any function)
function apply(fn: (n: number) => number): number {
  return fn(10);
}
```

Return early to keep logic flat:

```ts
if (index - n < 0) return false; // guard clause first
return sequence[index] === sequence[index - n]; // main case last
```

## Strings

```ts
const s = `Lesson ${lesson.id} done`; // template literal: ${} injects values (backticks!)
"2026-07-15".slice(0, 10); // substring by index
"2026-07-14" <= "2026-07-15"; // true — YYYY-MM-DD compares correctly as strings
["a", "b"].join(","); // "a,b" — also the easy array-content compare
new Date().toISOString().slice(0, 10); // today as "YYYY-MM-DD"
```

## Arrays

```ts
const xs = [1, 2, 3];
xs.length; // 3
xs[0]; // 1 — 0-based!  xs[xs.length - 1] is the last
xs[-1]; // undefined (no negative indexing — handy: never equals a number)

xs.includes(2); // true — "is this in there?"
xs.find((x) => x > 1); // 2 — first match, or undefined
xs.filter((x) => x > 1); // [2, 3] — all matches (new array)
xs.map((x) => x * 2); // [2, 4, 6] — transform each (new array)
xs.indexOf(2); // 1 — position, or -1
xs.slice(-20); // last 20 items (new array)

const ys = [...xs, 4]; // "append" immutably: copy + add (NOT xs.push in our state code)
xs.join(",") === ys.join(","); // content-compare trick; === alone compares IDENTITY

// Building with a loop
const out: number[] = [];
for (const x of xs) {
  out.push(x * 2); // push is fine on an array YOU just created
}
```

## Objects

```ts
const user = { name: "Sam", age: 30 };
user.name; // dot access
user["name"]; // bracket access — same thing
state.tracks[trackId]; // brackets when the key is a VARIABLE
const next = { ...user, age: 31 }; // copy-with-change (immutable update)
const withKey = { ...obj, [trackId]: value }; // computed key: VALUE of trackId as the key

user.pet?.name; // optional chaining: undefined instead of crash if pet missing
maybe ?? fallback; // ?? : use fallback only if maybe is null/undefined

Object.entries({ a: 1, b: 2 }); // [["a", 1], ["b", 2]] — loop/filter a Record
Object.keys(obj); // ["a", "b"]

const { state } = useProgress(); // destructuring: grab a field into a variable
const [first, second] = pair; // array destructuring (useState uses this)
```

## Set (fast membership)

```ts
const done = new Set(["l1", "l2"]);
done.has("l1"); // true — the point of Set: fast, readable "is X in there?"
done.add("l3"); // grows (duplicates ignored — a Set can't hold two of a kind)
done.size; // 3
[...done]; // back to an array
new Set(xs).size === xs.length; // true only if xs had no duplicates
```

## Control flow

```ts
if (a) { ... } else if (b) { ... } else { ... }

const label = score >= 0.8 ? "up" : "same"; // ternary: pick one of two VALUES

for (const lesson of module.lessons) { ... }   // loop over items
for (let i = 0; i < n; i++) { ... }            // loop with a counter

while (cell === previous) { cell = reroll(); } // repeat until condition breaks

Math.max(1, level - 1);  // "at least 1"
Math.min(a, b);          // smaller of two
Math.ceil(2.1);          // 3 — round UP;  Math.floor rounds down
```

## try/catch

```ts
try {
  riskyThing(); // anything that might throw
  setMessage("ok ✓");
} catch (error) {
  // error is `unknown` — extract text safely:
  setMessage(error instanceof Error ? error.message : String(error));
}
throw new Error("what went wrong"); // how you throw
```

## TypeScript in 8 lines

```ts
const n: number = 1;                    // annotation (usually inferred — omit when obvious)
function f(xs: string[]): boolean {}    // param + return types
type Grade = "again" | "good" | "easy"; // union of literal values
let maybe: string | null = null;        // union with null
type Dict = Record<string, ReviewState>; // dictionary type: key → value
type Partial<Lesson>;                    // all fields optional (used in fixtures)
type Activity = z.infer<typeof activitySchema>; // type DERIVED from a Zod schema
value as SomeType;                       // cast — rare, only at proven-safe boundaries
```

## React mini-patterns (full examples: MultipleChoiceActivity.tsx)

```tsx
const [picked, setPicked] = useState<number[]>([]); // memory box + its setter
setPicked([...picked, index]); // update = setter with a NEW value (re-renders)

<button type="button" onClick={() => pick(index)} disabled={done}>
  …
</button>;

{
  answered && <p>shows only when answered is true</p>;
}
{
  revealed ? <p>{answer}</p> : <button>Reveal</button>;
}

{
  items.map((item, index) => (
    <li key={index}>{item}</li> // list render — key required
  ));
}
```

## Gotcha table (things that silently bite)

| Trap                                  | Truth                                                                                        |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `[1,2] === [1,2]` is `false`          | `===` on arrays/objects compares identity, not contents — use `.join(",")` or field-by-field |
| `state.x = 5` then nothing renders    | Mutation is invisible to React/the store — build a new object with spread                    |
| `revealed = true`                     | Never assign to state — call `setRevealed(true)`                                             |
| `const f = store.update; f()` crashes | Method lost its `this` — wrap: `(x) => store.update(x)`                                      |
| `<p>(value)</p>` shows "(value)"      | JSX injects with `{value}`, parentheses are literal text                                     |
| `xs[xs.length]`                       | Off the end (undefined) — last item is `xs.length - 1`                                       |
| `0.1 + 0.2 !== 0.3`                   | Float math — compare with `toBeCloseTo` in tests                                             |
| `"10" < "9"` is `true`                | String compare is char-by-char — only YYYY-MM-DD dates are safe to compare as strings        |
| forgot `return`                       | Function silently gives `undefined` — first thing to check on a weird test diff              |
