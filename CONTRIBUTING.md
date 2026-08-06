# Contributing to Composio Skills

Keep the skill concise, current, and verifiable.

## Adding guidance

1. Add focused guidance to the relevant file in `skills/composio/references/`.
2. Keep `SKILL.md` as the short product router; do not duplicate reference content there.
3. Link any new reference directly from `SKILL.md` so `npm run build:agents` bundles it.
4. Run `npm run build` and the skill validator before opening a pull request.

## Reference structure

```markdown
# Product or domain

State when this guide applies and what successful completion means.

## Workflow

1. Give the smallest safe action.
2. Use current commands and real code.
3. End with a verifiable outcome.

## Fresh sources

- [Relevant docs](https://docs.composio.dev)
```

## Guidelines

- Keep one concern per section.
- Use real examples, not pseudocode.
- Keep TypeScript and Python aligned where both apply.
- Put detail in references so the router stays small.
- Do not claim setup is complete before one real tool call succeeds.
