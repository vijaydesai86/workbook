# Social Workbook Prototype

A small Next.js prototype inspired by `socialdiverse.com`, with two operating modes:

- `work`: use the current activity catalog as a static tool
- `train`: use GitHub Copilot SDK to suggest structured additions to the catalog

The repository is intentionally narrow: train mode can add new activity items or a new aligned activity, but it does not generate arbitrary product features.

## What is included

- activity hub with seeded activities such as typing practice, speech training, and social scenes
- `work` mode with a fixed, browseable activity experience
- `train` mode with an AI console that proposes catalog changes
- file-backed persistence so accepted train-mode proposals show up in work mode
- fallback proposal generation when Copilot CLI is not installed yet

## Requirements

- Node.js 18+
- GitHub Copilot CLI installed and authenticated if you want live Copilot-backed train mode

GitHub documents the current SDK flow around the `@github/copilot-sdk` package and `copilot` CLI authentication:

- install `@github/copilot-sdk`
- verify `copilot --version`
- create a session with `CopilotClient`

If Copilot CLI is missing, the app still runs and train mode falls back to a deterministic demo proposer.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Train mode behavior

Train mode is constrained to:

- add items to an existing activity
- add one new activity aligned with the current catalog
- keep changes focused on communication, routine practice, typing, and speech support

Accepted proposals are stored in [`data/customizations.json`](/home/vijdes01/play/workbook/data/customizations.json).

## Main files

- [`app/page.tsx`](/home/vijdes01/play/workbook/app/page.tsx)
- [`app/components/workbook-app.tsx`](/home/vijdes01/play/workbook/app/components/workbook-app.tsx)
- [`app/api/train/route.ts`](/home/vijdes01/play/workbook/app/api/train/route.ts)
- [`app/api/apply/route.ts`](/home/vijdes01/play/workbook/app/api/apply/route.ts)
- [`lib/copilot.ts`](/home/vijdes01/play/workbook/lib/copilot.ts)
- [`lib/catalog-store.ts`](/home/vijdes01/play/workbook/lib/catalog-store.ts)

## Notes

- This is a local prototype, so the catalog persistence writes to the repo filesystem.
- For production deployment, the persistence layer should move to a database or object store.
