# Changelog

All notable changes to BrightPath Play are documented here.
Entries are in reverse-chronological order (newest first).

---

## [Unreleased] — 2026-04-02 (Image Override Feature)

### Added — Caregiver image override

Caregivers can now replace any card's photo directly from the Adult area. The new image persists to the same storage backend as all other customisations (local `data/customizations.json` or Supabase) and appears immediately the next time the child plays.

#### Data layer
- `lib/types.ts`: new `ImageOverride` type `{ cardId, imageSrc, imageAlt }`; `Customizations` now includes `imageOverrides: ImageOverride[]`
- `lib/schema.ts`: new `imageOverrideSchema`; `customizationsSchema` gains `imageOverrides: z.array(...).default([])` — fully backward-compatible with existing stored data
- `lib/catalog-store.ts`: exported `getImageOverrides()` and `saveImageOverride(override)` — both use the same local/Supabase read-write path as everything else

#### Play config
- `lib/play-config.ts`: exported pure function `applyImageOverrides(config, overrides)` — substitutes `imageSrc`/`imageAlt` on matching cards without mutating the original config

#### API
- `app/api/image-override/route.ts`: POST endpoint
  - Accepts multipart form: `cardId` (slug-validated), `imageAlt`, and either a `file` (JPEG/PNG/WebP only, ≤ 5 MB) or `imageUrl`
  - Saves uploaded file to `public/cards/custom/[cardId].[ext]` locally
  - If Supabase Storage `cards` bucket is configured, uploads there instead and returns the public CDN URL
  - Stores override via `saveImageOverride`

#### Play page
- `app/activities/[activityId]/play/page.tsx`: calls `getImageOverrides()` + `applyImageOverrides()` on every server-side render — child always sees the latest saved image

#### Caregiver UI
- `app/components/card-image-manager.tsx`: new "Card images" accordion section in the Adult area
  - One row per activity (expand/collapse)
  - Thumbnail + card name for every card in the activity
  - Inline "Change photo" form: file upload (clears URL field automatically) OR paste URL + alt-text input
  - Live preview on success; inline error message on failure
- `app/components/caregiver-studio.tsx`: `CardImageManager` integrated below the existing AI trainer section

#### Tests (117 → 131, all passing)
- `__tests__/lib/play-config.test.ts`: 8 new tests for `applyImageOverrides`
- `__tests__/lib/catalog-store.test.ts`: 6 new tests for `getImageOverrides` and `saveImageOverride`

---

## [Unreleased] — 2026-04-02 (UI Revamp)

### Changed — Autism-Friendly UI Revamp

#### New utility
- `lib/activity-meta.ts` — maps activity IDs to emoji and short labels (`getActivityMeta`).
  - `alphabet-cards` → `{ emoji: "🔤", shortLabel: "Letters" }`
  - `counting-cards` → `{ emoji: "🔢", shortLabel: "Numbers" }`
  - Unknown IDs → `{ emoji: "🎮", shortLabel: "Game" }`

#### Tests (105 → 117)
- `__tests__/lib/activity-meta.test.ts` — 12 unit tests.

#### CSS — autism-friendly accessibility layer (bottom of `globals.css`)
- Base font size bumped to **18 px**.
- `@keyframes bp-pulse` — soft pulsing glow on the home-screen Play button.
- `@media (prefers-reduced-motion: reduce)` — animation suppressed for motion-sensitive users.
- `:focus-visible` global rule — 4 px orange focus ring.
- `.play-progress-track` — progress bar height increased to **26 px**.
- `.play-last-card-badge`, `.play-complete-banner` — last-card and completion celebration UI.
- `.play-sound-button-speaking` — green visual state while speech plays.
- `.kid-picker-card-emoji` — large emoji in activity picker cards.
- All play nav / sound buttons: **64 px** minimum height.

#### Home page (`workbook-app.tsx`)
- Redesigned to a direct game-card grid; no intermediate selection step.
- Each game card: activity preview, emoji, title, description, chips, coloured Play button.

#### Play page (`play/page.tsx`)
- Full-height card photo zone on mobile.
- Sticky 3-button bottom nav bar (← Back | 🔊 Hear | Next →).
- Letter/number jump grids (CSS grid, no horizontal scroll).
- 🎉 last-card badge; 🌟 completion banner with "Play again" and "All games" actions.

#### Documentation consolidation
- `README.md`, `AGENT.md`, `CHANGELOG.md` created/rewritten.
- `.github/copilot-instructions.md` now points to `AGENT.md`.

---

## Prior to 2026-04-02

- Initial Next.js prototype with Work / Train operating modes.
- Alphabet Cards activity (26 letters, real photo cards, speech synthesis).
- Counting Cards activity (1–20, apple set and mixed set).
- Caregiver Studio for AI-assisted card proposals via GitHub Copilot SDK.
- Supabase + local JSON fallback persistence.
- 105 Vitest unit tests across `play-config`, `base-catalog`, `catalog-store`, `schema`, and `copilot` modules.


All notable changes to BrightPath Play are documented here.
Entries are in reverse-chronological order (newest first).

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
