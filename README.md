# Learning Hub

A personal, browser-based learning app for short breaks — something cognitively engaging to open for 2–10 minutes instead of scrolling. Each session resumes a structured curriculum: a short **learning moment** (a micro-lesson, a fun fact, a visual, or a story) followed by an **interactive activity** (a quiz, a recall exercise, or a brain-training game). It tracks streaks and history so the habit sticks.

> Personal project — not a public product. Runs locally in the browser, no backend or account required.

## Why

Idle minutes usually go to social media. Learning Hub aims to make the path of least resistance *learning* instead — a curriculum you can dip into for a couple of minutes, that remembers exactly where you left off, and that rewards consistency with a visible streak.

## How it works

- **Curriculum, not a question bank.** Content is organized as **Topic → Track → Module → Lesson**, and lessons progress in order. Studying the Han dynasty means working through it chronologically before the next era — the same forward motion applies to every topic.
- **Sessions resume where you left off.** On open, the app suggests where to continue based on your last position, and you can freely navigate to any topic to pick up its curriculum. Smart suggestion *and* full manual control.
- **Flexible lesson shape.** A lesson is an ordered stream of **blocks** — prose, figures, callouts, story segments, and activities — so text-heavy topics can teach before testing, while story- or visual-driven topics lead with narrative or diagrams.
- **Built on evidence-based learning.** The engine leans on what actually improves retention: **retrieval practice** (activities framed as active recall), **spaced repetition** (reviews resurface on a schedule), **interleaving**, and **dual coding** (pairing text with visuals).
- **Progress that persists.** Streaks, session history, per-curriculum position, and spaced-review schedules are saved locally and survive across sessions.

## The 9 topic areas

| Topic | Shape |
|---|---|
| **Brain training** | Working-memory & attention drills (n-back, sequence recall, pattern recognition) that scale in difficulty rather than following a fixed path |
| **Music theory** | Fundamentals up: reading music, notes, rhythm, scales, intervals, chords — diagram-rich |
| **History** | Three parallel tracks — European, Chinese, Japanese — each chronological from ancient times to ~1800, told as story |
| **Psychology** | Social psychology, interpersonal dynamics, learning & habit formation; fun facts woven in |
| **Cognitive science & neuroplasticity** | How memory and attention work, why they degrade, how the brain adapts |
| **Behavioral economics** | Cognitive biases and decision-making, built concept by concept (Kahneman, Ariely, Thaler) |
| **Game theory** | From first principles: what it is, core concepts, Nash equilibrium, real-world applications |
| **Product & business** | Startup growth patterns and career-development frameworks, organized thematically |
| **Cooking** | Culinary techniques, food science, interesting recipes, organized by skill area |

## Architecture

- **Stack:** React + Vite + TypeScript + Tailwind, React Router. Dark theme, responsive. Runs locally via `npm run dev`.
- **Content schema is the single source of truth.** Every topic, module, and lesson is a typed data file validated by a **Zod** schema. The app renders whatever the schema describes — adding modules and lessons never requires touching app logic.
- **Pluggable persistence.** All progress flows through a `ProgressStore` interface backed by `localStorage` today (with JSON export/import), so a hosted backend can be dropped in later with no changes to app logic.
- **Extensible by design.** New activity types are added via a single registry entry + component (Open/Closed); new content blocks via one renderer branch.

## Roadmap

- **Learning-preferences profile** — a short onboarding assessment that tunes default presentation (more text / more visual / story-first / jump-to-interactive). Honest by design: it personalizes engagement, not a claim that "matching style" boosts retention — that comes from the universal techniques above.
- **Spaced-repetition review** — due reviews surfaced on the home screen, interleaved with new lessons.
- **Text-to-speech** — optional narration of learning moments (nice-to-have).
- **Phone support** — installable PWA, offline-capable, "add to home screen".
- **Optional cloud sync** — a free hosted-Postgres backend (e.g. Supabase) for cross-device progress, swapped in behind the existing `ProgressStore` interface.

## A note on this repo

This project doubles as a hands-on software-engineering exercise. The foundational stages are built as guided practice — each demonstrates a core principle (single source of truth, SOLID, DRY, the Open/Closed Principle, pure functions) exactly where the codebase uses it. Stage-by-stage notes live in `docs/build-journal/`.
