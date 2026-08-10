# @composiohq/skills (retired)

The Composio skill in this repository is retired. It mixed legacy Tool Router guidance, current SDK integration, and CLI operation, so keeping it discoverable would conflict with the maintained first-party skills.

Install the canonical public product and integration skill instead:

```bash
npx skills add ComposioHQ/composio --skill composio --global --yes
```

The public `composio` skill lives at [`ComposioHQ/composio/skills/composio`](https://github.com/ComposioHQ/composio/tree/next/skills/composio). The separate `composio-cli` skill ships with matching Composio CLI releases and owns current command usage.

The rule files left in this repository are historical reference only. Do not install or copy them into an agent skill directory; use the [current Composio documentation](https://docs.composio.dev) for product behavior and APIs.

## License

MIT
