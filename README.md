# Social Workbook Prototype

A small Next.js prototype inspired by `socialdiverse.com`, with two operating modes:

- `work`: use the current activity catalog as a static tool
- `train`: use GitHub Copilot SDK to suggest structured additions to the catalog

## Environment Variables

- `COPILOT_GITHUB_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase Setup

Run the SQL in [`supabase/schema.sql`](/home/vijdes01/play/workbook/supabase/schema.sql).

## Run

```bash
npm install
npm run dev
```
