# AGENT.md — Instructions for AI Coding Agents

This file is the authoritative guide for any AI agent (GitHub Copilot, Claude, GPT, etc.) working on the **BrightPath Play** repository. Read it in full before making any changes.

---

## Purpose of the app

BrightPath Play is an **autism-friendly early-learning tool**. Primary users are young children with autism spectrum disorder (ASD). Every design decision must serve predictability, calm, and clarity for those children first.

Secondary users are caregivers and teachers who use the Caregiver area to extend card sets.

---

## Core principles — never violate these

1. **Work mode must stay deterministic.** `work` mode makes zero live LLM calls. Card content is always identical across sessions so children can build a safe, predictable routine.
2. **One card at a time.** The play screen always shows one card. Do not add multi-card layouts or simultaneous stimulus.
3. **Short, concrete language.** Card text uses simple words and short phrases. No idioms, metaphors, or abstract language.
4. **Calm visuals.** No auto-playing video, no rapidly changing content, no jarring colour shifts. Transitions must stay ≤ 200 ms ease.
5. **Reduced motion respected.** Any CSS animation must be wrapped in `@media (prefers-reduced-motion: no-preference)` or the `reduce` variant suppresses it. The `.kid-home-play-button` pulse already does this.
6. **Large touch targets.** All interactive elements must be ≥ 64 px tall (`min-height: 64px`). Do not reduce button sizes.
7. **100 % test pass rate.** Every new piece of lib logic must have unit tests in `__tests__/lib/`. Run `npm test` before finalising any change and ensure all tests pass.

---

## Repository layout

```
lib/                      Pure TypeScript logic — test everything here
  activity-meta.ts        Maps activity IDs → emoji + short label
  base-catalog.ts         Static base catalog (alphabet + counting)
  catalog-store.ts        Merge, read, write customizations
  play-config.ts          Build card configs, themes, modules
  copilot.ts              AI proposal builder + fallback
  schema.ts               Zod schemas
  types.ts                Shared types

app/                      Next.js App Router pages and components (React)
  globals.css             All styles — autism-friendly layer is at the bottom
  components/             Client and server React components

__tests__/lib/            Vitest unit tests — one file per lib module
data/
  customizations.json     Local persistence (ignored in git if present)
public/cards/alphabet/    26 real-photo card images (CC-licensed)
```

---

## How to run and test

```bash
npm install
npm run dev        # local dev server
npm test           # vitest unit tests — must be 100 % green
npm run typecheck  # tsc --noEmit
npm run build      # production build check
```

---

## Adding new features — checklist

- [ ] If you add logic to `lib/`, add corresponding tests in `__tests__/lib/`.
- [ ] Run `npm test` and confirm all tests pass before committing.
- [ ] Run `npm run typecheck` to catch type errors.
- [ ] For UI changes, keep touch targets ≥ 64 px and don't reduce font sizes below the 18 px base.
- [ ] If adding CSS animations, include a `prefers-reduced-motion` suppression block.
- [ ] Update `CHANGELOG.md` with a new entry describing your change.
- [ ] Keep `README.md` accurate if you change architecture, commands, or environment variables.

---

## Extending activities

Prefer extending `alphabet-cards` or `counting-cards` over creating entirely new activities. New activities go into the customisation layer (`catalog-store`) — never mutate `base-catalog.ts` unless fixing a clear error.

Play configs for non-standard activities live in `lib/play-config.ts` inside `bespokeConfigs`. Add a new entry there if needed.

Activity metadata (emoji, short label) is in `lib/activity-meta.ts`. Add an entry for every new activity so the home screen picker shows the right emoji.

---

## Card images

Images live in `public/cards/alphabet/`. They are CC-licensed (see `public/cards/attribution.json`).

**Known issues to fix if replacing images:**
- `lily.jpg` — actually a cactus flower; needs an isolated lily or flower photo.
- `tree.jpg` — complex background scene; needs an isolated tree.
- `quilt.jpg` — textile pattern; needs a recognisable quilt.
- `dog.jpg` — shelter dog; fine for content but a clearer background photo is preferred.

When adding or replacing images: use clear, uncluttered photos with a single identifiable subject on a plain or simple background. Avoid busy or confusing scenes.

---

## Train mode guidance

- `train` mode may propose at most **one new activity** or **additional items for an existing activity** per request.
- Proposals must pass the `trainingProposalSchema` Zod schema before being applied.
- The fallback generator in `lib/copilot.ts` produces deterministic proposals when the Copilot SDK is unavailable — do not remove it.
- Applied proposals are stored in `data/customizations.json` (or Supabase if configured).

---

## Documentation maintenance rule

**Every significant change must update the relevant doc:**

| What changed | Update |
|---|---|
| Architecture, commands, env vars | `README.md` |
| Agent instructions or principles | `AGENT.md` (this file) |
| Any user-visible change | `CHANGELOG.md` (new entry at the top) |

---

## Style conventions

- TypeScript strict mode — no `any`, no `as unknown`.
- CSS: add new autism-friendly overrides at the bottom of `globals.css` under the clearly marked section.
- Prefer small, named functions over inline logic.
- Zod for all external data validation.
- No new npm dependencies unless absolutely necessary; check the advisory database before adding any.
