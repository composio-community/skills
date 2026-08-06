# Composio agent skill

Install the Composio skill in a project so a coding agent can add Composio to an existing codebase, configure authentication safely, and continue until one real tool call succeeds.

## Install

Auto-detect the coding agent:

```bash
npx skills add composiohq/skills --skill composio -y
```

Or choose one explicitly:

```bash
npx skills add composiohq/skills --skill composio -a codex -y
npx skills add composiohq/skills --skill composio -a claude-code -y
npx skills add composiohq/skills --skill composio -a cursor -y
```

Project-local installation is the default. Add `--global` only when the skill should apply across every repository.

## What it handles

- Separates Composio For You from Composio Platform before setup.
- Inspects an existing codebase before choosing SDK or framework packages.
- Uses `composio dev init` for Platform project authentication.
- Integrates sessions into the developer's existing agent instead of creating a canned demo.
- Discovers toolkits and tools instead of guessing slugs.
- Treats one successful programmatic tool call as completion.

## Structure

```text
skills/composio/
├── SKILL.md
├── AGENTS.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── errors.md
│   ├── for-you.md
│   └── platform.md
```

`SKILL.md` routes the agent to one product guide. `AGENTS.md` is generated as a consolidated fallback:

```bash
npm run build:agents
```

## Source material

The refreshed skill incorporates the evaluated product split and Platform setup guidance from `composio-temp/composio-skill`, plus the tool-version and toolkit-discovery fixes from the 97-agent documentation evaluation.

## Links

- [Composio documentation](https://docs.composio.dev)
- [Composio dashboard](https://dashboard.composio.dev)
- [Skills CLI](https://github.com/vercel-labs/skills)

## License

MIT
