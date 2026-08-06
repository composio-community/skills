# Platform integration patterns

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
