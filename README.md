# BrightPath Play

**An autism-friendly learning app for early-childhood picture-card activities.**

BrightPath Play is a Next.js web application built to give children with autism spectrum disorder (ASD) a calm, predictable, and visually clear learning experience. The two core activities — Alphabet Cards and Counting Cards — follow evidence-based practices for early learners: one card at a time, real photos, short language, and consistent routines.

---

## Who it is for

| Role | What they do |
|---|---|
| **Child (primary user)** | Plays picture-card activities in Work mode — no text input required, large touch targets, emoji-labelled buttons |
| **Caregiver / Teacher** | Uses the Caregiver area to add or extend card sets via AI-assisted proposals |

---

## Autism-friendly design principles

- **Predictability** — every card follows an identical layout; navigation never changes position.
- **Calm palette** — warm, low-saturation backgrounds; no flickering or auto-playing media.
- **Large touch targets** — all interactive elements are ≥ 64 px tall.
- **High contrast text** — body ink `#24344a` on white backgrounds.
- **Reduced motion option** — the Play button pulse animation is suppressed when the user's OS has "Reduce Motion" enabled.
- **Clear progress** — a 26 px progress bar spans the full width above every card.
- **Completion celebration** — a 🌟 banner appears on the last card so the child knows they are almost done.
- **Emoji labels** — navigation buttons use emoji (`🎮 Play`, `← Back`, `🔊 Hear it`, `⭐ All done`) as visual anchors alongside text.
- **Consistent sounds** — speech synthesis reads the card phrase at a slightly reduced rate (0.88×) using a calm, natural voice.

---

## Activities

### 🔤 Alphabet Cards
- 26 letter cards (A–Z), one per session step.
- Each card shows a real photo, the letter badge, the object word, and a caption.
- Speech synthesis reads "A for Apple" etc. at a calm pace.
- Supports predictable letter-by-letter navigation or jump-to-letter chips at the bottom.

### 🔢 Counting Cards
- Numbers 1–20 in two modules (1–10 and 11–20).
- **Apple set** — the same apple image repeated, reducing visual distraction.
- **Mixed set** — a different object for each number to build variety.
- Large numeral badge overlaid on the card for instant recognition.

---

## Operating modes

| Mode | Description |
|---|---|
| **Work** | Static, deterministic — no live LLM calls. The child always sees the same cards. |
| **Train** | Caregiver area uses the GitHub Copilot SDK to propose new card sets or extended activities. Proposals must be reviewed and applied before they appear in Work mode. |

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Fonts | Fredoka (display) · Nunito (body) — both dyslexia-friendly round fonts |
| Voice | Web Speech API (`SpeechSynthesis`) |
| AI proposals | `@github/copilot-sdk` (train mode only) |
| Persistence | Supabase (optional) · local `data/customizations.json` fallback |
| Tests | Vitest (Node environment) |

---

## Project structure

```
app/
  page.tsx                       Home screen (activity picker)
  layout.tsx                     Root layout + fonts
  globals.css                    All styles, including autism-friendly layer at bottom
  components/
    workbook-app.tsx             Home page client component
    activity-scenes.tsx          Card rendering (alphabet, count, choice, scene…)
    play-controls.tsx            🔊 Hear it button (Web Speech API)
    caregiver-studio.tsx         Train-mode caregiver UI
  activities/[activityId]/
    page.tsx                     Activity detail page
    play/page.tsx                Card-by-card play page
  caregiver/page.tsx             Caregiver area entry point
  api/
    catalog/route.ts             GET merged catalog
    train/route.ts               POST generate AI proposal
    apply/route.ts               POST apply proposal to customizations

lib/
  activity-meta.ts               Maps activity IDs → emoji + short label
  base-catalog.ts                Static base activity catalog (alphabet + counting)
  catalog-store.ts               Merge base + customizations; read/write storage
  play-config.ts                 Build play configs (card data, themes, modules)
  copilot.ts                     buildTrainingProposal + fallback generator
  schema.ts                      Zod schemas for training proposals + customizations
  types.ts                       Shared TypeScript types
  supabase-admin.ts              Supabase admin client helper

data/
  customizations.json            Local persistence for applied proposals

public/cards/alphabet/           26 CC-licensed real-photo card images
__tests__/lib/                   Vitest unit tests (117 tests, 100% pass rate)
```

---

## Running locally

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # run all unit tests
npm run typecheck # TypeScript type check
```

### Environment variables (optional)

| Variable | Purpose |
|---|---|
| `COPILOT_GITHUB_TOKEN` | Enables live Copilot SDK in train mode |
| `SUPABASE_URL` | Supabase project URL for cloud persistence |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key |

When these are absent the app runs fully offline using the local JSON file.

### Supabase setup (optional)

Run the SQL in `supabase/schema.sql` against your Supabase project.

---

## Card images

All 26 alphabet card images are sourced from [Openverse](https://openverse.org/) under Creative Commons licences. Attribution data lives in `public/cards/attribution.json`.

**Known image limitations** (noted for future replacement):
- `lily.jpg` is a cactus flower, not a lily — displayed as "Lily" / "Flower" depending on context.
- `tree.jpg` contains a complex background scene rather than an isolated tree.
- `quilt.jpg` shows a textile pattern that may not be immediately recognisable as a quilt.

Replacement with clearer, isolated-subject photos is recommended for future iterations. See `AGENT.md` for guidance.

---

## Documentation

| File | Purpose |
|---|---|
| `README.md` | This file — project overview, architecture, and run instructions |
| `AGENT.md` | Instructions for AI coding agents working on this repository |
| `CHANGELOG.md` | Record of every significant change made to the project |
