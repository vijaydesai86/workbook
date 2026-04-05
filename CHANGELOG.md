# Changelog

All notable changes to BrightPath Play are documented here.
Entries are in reverse-chronological order (newest first).

---

## [Unreleased] — 2026-04-05

### Added — Pizza, Pizza! Game

#### New activity: `pizza-pizza`
- Colour-and-shape matching board game adapted from Orchard Toys "Pizza, Pizza!".
- Single-player, autism-friendly: calm pace, no timer, no social pressure.
- Core loop: spin → pick → place/bin → repeat → win.

#### Game logic (`lib/pizza-game.ts`)
- Pure state machine with deterministic seeded RNG (mulberry32) for reproducible work-mode sessions.
- 8-slice board from 16 possible colour×shape combos; 12-card deck (8 good + 4 yucky).
- State transitions: `doSpin`, `doReveal` (with reshuffle), `doContinue`.
- Each face-down card has a unique `backIcon` (food emoji) so cards look distinct.
- `getPickableCards` shows up to 6 cards for a meaningful spread.
- Cards reshuffle after every reveal to prevent stale card positions.

#### Visually distinct spinners
- **Colour spinner**: rounded square with rainbow gradient border, 2×2 colour swatch grid (idle) or single large swatch (result).
- **Shape spinner**: dark circle with white shape icons, 2×2 shape grid (idle) or single large shape (result).
- Heading emojis (🎨 Colour, ✏️ Shape) help kids distinguish spinners instantly.

#### Client component (`app/components/pizza-game.tsx`)
- SVG pizza board with colour-filled slices and shape emoji indicators.
- Animated dual spinners with `prefers-reduced-motion` support.
- Face-down topping cards show unique food emoji backs (🍅🧀🫒🌶️🍄🌽…).
- ≥ 64 px touch targets on all interactive elements.

#### Catalog & config
- `lib/base-catalog.ts` — new `pizza-pizza` activity with 2 items.
- `lib/activity-meta.ts` — `{ emoji: "🍕", shortLabel: "Pizza" }`.
- `lib/play-config.ts` — bespoke `pizzaConfig` with red theme.

#### Tests
- 59 tests in `__tests__/lib/pizza-game.test.ts` covering constants, RNG, board/deck generation, state transitions, matching logic, reshuffle behaviour, and full game flow.
- Updated `base-catalog.test.ts` for 3 activities.
- All 178 tests pass.

---

## [Unreleased] — 2026-04-02

### Added — Autism-Friendly UI Revamp

#### New utility
- `lib/activity-meta.ts` — maps activity IDs to emoji and short labels (`getActivityMeta`).
  - `alphabet-cards` → `{ emoji: "🔤", shortLabel: "Letters" }`
  - `counting-cards` → `{ emoji: "🔢", shortLabel: "Numbers" }`
  - Unknown IDs → `{ emoji: "🎮", shortLabel: "Game" }`

#### Tests
- `__tests__/lib/activity-meta.test.ts` — 12 unit tests covering known IDs, unknown IDs, empty string, field existence, and idempotency.
- Total test count raised from 105 → 117 (all passing).

#### CSS — autism-friendly accessibility layer (bottom of `globals.css`)
- Base font size bumped from 16 px (browser default) to **18 px** for better readability.
- `@keyframes bp-pulse` — soft pulsing glow on the home-screen Play button to draw attention without being overwhelming.
- `@media (prefers-reduced-motion: reduce)` — animation is suppressed for users with motion sensitivity.
- `:focus-visible` global rule — 4 px orange focus ring for keyboard and switch-access users.
- `.play-progress-track` — progress bar height increased to **26 px** for clearer progress perception.
- `.play-last-card-badge` — warm badge shown when the child reaches the final card.
- `.play-complete-banner` + `.play-complete-emoji` — full-width celebration panel on the last card.
- `.play-sound-button-speaking` — green visual state on the Hear button while speech is playing.
- `.kid-picker-card-emoji` — large emoji display in activity picker cards.
- `.kid-picker-card-copy strong` — picker card titles enlarged to 1.5 rem.
- All `.play-nav-button` and `.play-sound-button` minimum height enforced at **64 px**.

#### Home page (`workbook-app.tsx`)
- Play button label changed to `🎮 Play`.
- Open button label changed to `📖 Open`.
- Caregiver callout button changed to `⚙️ Open caregiver area`.
- Activity picker cards now show the activity emoji from `getActivityMeta` above the title.

#### Play page (`play/page.tsx`)
- Back navigation button: `← Back` with clear arrow.
- Home link: `🏠 All games`.
- Next card button: `Next →`.
- All done button (last card): `⭐ All done`.
- Restart link: `↺ Start over`.
- `isLastCard` flag: when true, shows `🎉 Last card!` badge in the status row.
- Completion celebration banner (`play-complete-banner`) with `🌟` emoji, "Amazing work!" heading, and contextual instruction shown above the secondary stack on the last card.

#### Play controls (`play-controls.tsx`)
- Button text changed from `"Hear card"` / `"Playing..."` to `"🔊 Hear it"` / `"🔊 Playing…"`.
- Button gains `play-sound-button-speaking` CSS class while speech synthesis is active.

#### Activity detail page (`activities/[activityId]/page.tsx`)
- Back button: `← All games`.
- All Play buttons: `🎮 Play`.
- Apple set chip: `🍎 Apple set`.
- Mixed set chip: `🎨 Mixed set`.

### Added — Documentation consolidation
- `README.md` fully rewritten: autism-friendly design principles, activity descriptions, project structure, run instructions, environment variables, image credits, and known image limitations.
- `AGENT.md` created: authoritative guide for AI coding agents — core principles, repo layout, testing requirements, feature checklist, image guidance, train mode guidance, style conventions, and documentation maintenance rules.
- `CHANGELOG.md` created (this file): reverse-chronological change log.
- `.github/copilot-instructions.md` updated to defer to `AGENT.md`.

---

## Prior to 2026-04-02

- Initial Next.js prototype with Work / Train operating modes.
- Alphabet Cards activity (26 letters, real photo cards, speech synthesis).
- Counting Cards activity (1–20, apple set and mixed set).
- Caregiver Studio for AI-assisted card proposals via GitHub Copilot SDK.
- Supabase + local JSON fallback persistence.
- 105 Vitest unit tests across `play-config`, `base-catalog`, `catalog-store`, `schema`, and `copilot` modules.
