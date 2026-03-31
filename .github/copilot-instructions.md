# Repository guidance

- Keep the app focused on structured communication-support activities.
- `work` mode must stay deterministic and must not make live LLM calls.
- `train` mode may propose new items or one new aligned activity, but avoid open-ended feature invention.
- Prefer extending existing activities such as `alphabet-cards` and `counting-cards`.
- Store approved catalog changes through the local customization layer instead of mutating the base catalog.
