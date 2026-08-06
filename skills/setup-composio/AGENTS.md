---
name: setup-composio
description: Set up Composio Platform inside an existing agent or application codebase and prove the integration with one real tool call. Use when a developer asks to add, install, wire, or try Composio in a repository, when dashboard onboarding supplies a Composio project name, or when an existing agent needs Composio tools and user connections.
---

# Set up Composio

Put Composio into the agent or application that already exists in the repository. Finish only after one real tool call succeeds from that codebase.

## Workflow

1. Inspect the repository before asking setup questions.
   - Identify the language, package manager, agent or model provider, environment-file convention, and smallest existing execution path.
   - Preserve the existing agent, model, framework, prompts, and request lifecycle.

2. Bind the repository to Composio Platform.
   - Check `composio --version`. If the CLI is unavailable, run `curl -fsSL https://composio.dev/install | sh`.
   - Run `composio dev init` from the repository root. When the user names a project, select that exact project.
   - If a browser cannot open, use `composio dev init --no-browser` and give the user the returned URL.
   - Keep `COMPOSIO_API_KEY` in the repository's local environment file. Never print, expose, or commit it.

3. Read [Platform integration patterns](references/platform.md), then implement the smallest native integration.
   - Install only the core SDK and provider adapter the existing codebase needs.
   - Use a Composio session for the application's current user and pass its tools into the existing agent.
   - Do not create a separate demo agent when a runnable agent path already exists.

4. Verify the integration from the repository.
   - Run the repository's relevant checks first.
   - Have the integrated agent discover and execute one safe, read-only web-search tool through Composio.
   - Never guess a toolkit or tool slug. Let the session's discovery tools select the real capability.
   - Repair setup or code errors and retry until the programmatic tool call succeeds.

5. Hand off a working result.
   - State which files changed, the command used to verify the integration, and what the real tool returned.
   - Point to Composio Logs for deeper inspection, then mention Toolkits, Users, and Auth Configs only as optional next steps.

## Guardrails

- Do not use Playground, a mock, a schema fetch, or SDK initialization as proof of success.
- Do not add another LLM or agent framework solely for setup.
- Do not build an OAuth flow; Composio returns a Connect Link when an app needs authorization.
- Do not stop at documentation, dependency installation, or compilation.
- When a user action is required, ask for only that action, then continue the workflow.

---

## Bundled references

### Platform integration patterns

Use Composio as the tools and authentication layer inside the existing product. Keep the first integration small; the developer can widen tool access after the first successful call.

## Choose the native path

Inspect the repository and reuse its language and provider. Install the minimum packages:

- TypeScript core: `@composio/core`
- Python core: `composio`
- Provider adapters only when the existing framework needs one, such as `@composio/vercel`, `@composio/openai-agents`, `@composio/mastra`, `@composio/anthropic`, `composio-openai-agents`, or `composio-langchain`

Do not replace the repository's model provider or introduce a second agent framework.

## Create a session

A session carries one user's identity, connections, tool scope, and remote execution context.

TypeScript:

```typescript
import { Composio } from "@composio/core";

const composio = new Composio();
const session = await composio.create(userId);
const tools = await session.tools();
```

Python:

```python
from composio import Composio

composio = Composio()
session = composio.sessions.create(user_id=user_id)
tools = session.tools()
```

Use a stable application user or tenant ID. Never share one default ID across multiple production users.

Pass the returned tools to the existing agent through its native tool interface. Sessions expose discovery, schema, execution, connection, and remote-workbench meta tools so the agent can find capabilities without loading every schema into context.

## Handle connections progressively

Do not require an app connection before the first read-only verification call. When the developer later chooses an app that needs authentication, keep connection management enabled. Composio will return a Connect Link; show it to the user, wait for authorization, and retry the original action.

Use managed authentication first. Create a custom Auth Config only when the product needs custom branding, scopes, provider quotas, or self-hosted requirements.

## Verify honestly

The first verification must execute through the codebase's integrated agent and create a successful Composio tool log.

1. Ask the agent for a safe, read-only web search.
2. Let Composio discovery identify the actual toolkit and tool.
3. Execute the tool from the existing agent path.
4. Confirm a real response and, when available, a successful log ID.

If the repository has no runnable agent loop, add the smallest entry point compatible with its existing model provider. Do not require a new hosted model solely for onboarding.

Current documentation index: `https://docs.composio.dev/llms.txt`.
