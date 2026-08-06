---
name: composio
description: Use when the user mentions Composio, wants to add Composio to an agent or codebase, or wants an AI agent to act in real apps such as Gmail, Slack, GitHub, Notion, Calendar, or Linear.
---

# Composio

Composio gives AI agents authenticated access to 1000+ apps.

There are two products. They have different URLs, keys, and setup paths. Decide which one applies before doing anything else, and do not blend them.

| | Composio For You | Composio Platform |
|---|---|---|
| For | You want your agent to use your apps | You are building a product where your users connect their accounts |
| Surface | An MCP server attached to an AI client | An SDK integrated into a codebase |
| Key | `ck_...` consumer key | `COMPOSIO_API_KEY` project key |
| Dashboard | `dashboard.composio.dev` → For You | `dashboard.composio.dev` → Platform |

## First decide the product

Ask one question when the answer is not already clear:

> Are you setting Composio up for yourself so your coding agent can use your apps, or are you building a product where your own users connect their accounts?

Skip the question when context is sufficient:

- The user names an AI client and is not building code → For You.
- The user is inside a codebase or mentions users, tenants, `user_id`, an SDK, or an agent they are building → Platform.

Read exactly one product guide. Do not read both.

### 1. Composio For You

Read [Composio For You](references/for-you.md).

### 2. Composio Platform

Read [Composio Platform](references/platform.md).

### 3. Errors and provider failures

For provider- and toolkit-level failures shared by both products, read [Errors and provider gotchas](references/errors.md).

## Finish the work

Install the dependency, write the configuration, and run the command. Setup is not complete until one real tool call succeeds.

## Stable rules

1. Establish which product applies before setup.
2. Never invent a toolkit or tool slug. For Platform sessions, use `COMPOSIO_SEARCH_TOOLS`; for direct CLI work, use `composio search` and inspect with `composio execute --get-schema`.
3. Do not build an OAuth flow. Composio supplies a Connect Link when authentication is required.
4. Use sessions for new Platform integrations. Direct execution is a legacy migration path.
5. Keep credentials in environment variables and out of source control.
6. Get the log ID before diagnosing a failed tool call.

## Fresh information

When a detail is not covered by the selected guide, fetch the current markdown documentation and complete the work from it:

```text
https://docs.composio.dev/docs/<page>.md
https://docs.composio.dev/llms.txt
https://docs.composio.dev/toolkits/faq/<toolkit>.md
```

---

## Bundled references

### Composio For You

Use this path when someone wants their own coding agent or AI client to use their own connected apps. This is an MCP setup, not an SDK integration.

## MCP endpoint

```text
https://connect.composio.dev/mcp
```

Do not use the removed `mcp.composio.dev` endpoint or a Platform MCP URL.

## Authentication

Claude Desktop and ChatGPT use browser OAuth. Header-based clients use the consumer key from Dashboard → For You → Settings → Sessions & API Key:

```text
x-consumer-api-key: ck_...
```

The `ck_...` consumer key and Platform's `COMPOSIO_API_KEY` are not interchangeable.

## Terminal coding agents

Terminal agents can use the Composio CLI directly:

```bash
curl -fsSL https://composio.dev/install | bash
composio login
composio search "<what the user wants>"
composio link <toolkit>
composio execute <TOOL_SLUG> -d '{...}'
```

Use `composio login --no-wait | jq` when the agent cannot open a browser. Share the returned login URL, then complete login with the returned key.

## Client configuration

For any MCP-capable client, configure HTTP transport with the endpoint above and, when required, the `x-consumer-api-key` header. Fetch `https://docs.composio.dev/docs/composio-connect.md` for current client-specific steps.

## Connect apps naturally

Do not pre-connect every app. Start the real task. When an app is required, Composio returns an authorization link and the connection persists for future runs.

Setup is complete only after one real tool call succeeds.

### Composio Platform

Use this path when the developer is adding Composio to an agent, application, or backend where their users connect accounts.

The goal is not to complete a canned task. The goal is to make Composio the tool and authentication layer inside the developer's existing system, then prove the integration with one real tool call.

## 1. Inspect the codebase first

Before choosing packages or generating files, identify:

- The package manager and language.
- The existing agent or LLM framework.
- The current user or tenant identifier.
- Where environment variables are loaded.
- The smallest existing execution path where Composio tools belong.

Extend the existing architecture. Do not create a separate demo agent when the repository already has one.

## 2. Authenticate the project

Run from the project directory:

```bash
curl -fsSL https://composio.dev/install | bash
composio dev init
```

`composio dev init` logs in when needed, binds the directory to the selected Composio project, and provisions `COMPOSIO_API_KEY` in `.env.local`. If developer mode is off, run `composio dev --mode on` first. When the agent cannot open a browser, use `composio dev init --no-browser` and give the returned URL to the user.

Select the exact project the user named. Do not use `-y` when multiple projects exist unless the current CLI project context already matches it. There is no bare `composio init` command.

If the developer already has a key, store it as `COMPOSIO_API_KEY`. Never print it back, place it in a URL, or commit it.

Dashboard fallback: Platform → project → API Keys.

## 3. Install only what the codebase needs

TypeScript:

```bash
npm install @composio/core
```

Python:

```bash
pip install composio
```

Add a provider package only when the repository's framework requires one, for example `@composio/vercel`, `@composio/openai-agents`, `@composio/mastra`, `@composio/anthropic`, `composio-openai-agents`, or `composio-langchain`.

Do not introduce a second LLM framework solely for onboarding.

## 4. Create a session for the current user

A session is the runtime context for one user. It carries identity, connections, tool scope, and the remote sandbox.

TypeScript:

```typescript
import { Composio } from "@composio/core";

const composio = new Composio();
const session = await composio.create("user_123");
const tools = await session.tools();
```

Python:

```python
from composio import Composio

composio = Composio()
session = composio.sessions.create(user_id="user_123")
tools = session.tools()
```

Use the application's stable database ID in production. Never use a shared `default` identity for multiple users.

## 5. Put Composio into the existing agent

Pass the session tools to the repository's existing agent or model provider using its native tool integration. Preserve the current prompt, model, streaming, and request lifecycle unless a change is required for tools to execute.

Sessions expose a small set of meta tools by default. The agent discovers the right integration and tool at runtime rather than loading thousands of schemas into context:

- `COMPOSIO_SEARCH_TOOLS`
- `COMPOSIO_GET_TOOL_SCHEMAS`
- `COMPOSIO_MULTI_EXECUTE_TOOL`
- `COMPOSIO_MANAGE_CONNECTIONS`
- `COMPOSIO_WAIT_FOR_CONNECTIONS`
- `COMPOSIO_REMOTE_WORKBENCH`
- `COMPOSIO_REMOTE_BASH_TOOL`

Keep connection management enabled for interactive agents. It is what returns a Connect Link when a user needs to authenticate an app.

## 6. Prove it with a real call

Setup is incomplete until a programmatic tool call succeeds from the developer's repository.

For onboarding:

1. Use the installed Composio skill and the existing agent path.
2. Ask the agent to find a read-only web-search capability.
3. Let it discover the actual toolkit and tool slug; never hard-code or guess one.
4. Run the tool through the project selected during `composio dev init`.
5. Capture the real result and log ID.

The smoke test must hit Composio. A mocked response, Playground call, schema fetch, or SDK initialization does not count.

If the repository has no runnable agent loop, add the smallest test entrypoint compatible with its existing LLM provider. Do not require a new hosted model solely for onboarding.

## 7. Authentication happens when needed

Do not build OAuth. If a selected app is not connected, `COMPOSIO_MANAGE_CONNECTIONS` returns a Connect Link, the user authorizes in the browser, and the agent retries.

Start with managed auth. A custom auth config is needed only for custom branding, additional scopes, dedicated provider quotas, or self-hosted/regional requirements.

## 8. Hand off the useful next steps

After the first call succeeds, show the developer where to continue:

- Logs for the exact request, response, duration, and log ID.
- Toolkits to discover integrations.
- Users for stable per-user identities and connections.
- Auth Configs when the product needs custom authentication behavior.

## Do not

- Do not stop after linking documentation.
- Do not use a fixed GitHub starring task as the onboarding concept.
- Do not create an auth config as a prerequisite.
- Do not guess tool or toolkit slugs.
- Do not use direct execution for a new agent integration.
- Do not claim success before a real programmatic tool call appears in logs.

Current documentation index: `https://docs.composio.dev/llms.txt`.

### Errors and provider gotchas

These rules apply to both Composio products.

## Start with the log ID

Get the Composio log ID or request ID before diagnosing a failure. Framework wrappers often hide the underlying error.

```bash
composio dev logs tools
composio dev logs triggers
composio connections list
```

The dashboard Logs page provides the same execution trail.

## Tool does not exist

Never guess the slug. In a Platform session, discover it through `COMPOSIO_SEARCH_TOOLS`. In a direct CLI workflow, use `composio search`, then inspect the result with `composio execute <slug> --get-schema`.

For manual legacy v3 execution, a missing tool is often a toolkit-version problem. Use a verified version or the v3.1 path that defaults to the current version. New session integrations should use runtime discovery instead of manually executing a guessed slug.

## Authentication failures

A 401 generally means the provider token was revoked, expired, or invalidated by a password, 2FA, or administrator-policy change. Reconnect the account and retry.

If an authorization link expired, request a new one. Do not reuse it.

## Provider constraints

- Google "App is blocked": remove unnecessary scopes or use a verified custom OAuth app.
- Slack 429s: managed apps share a provider quota; use a custom Slack app for a dedicated rate-limit bucket.
- Microsoft 403s: the tenant may require administrator consent.
- GitHub Apps: OAuth credentials and repository installation are separate steps.
- Session Restriction errors for payment tools are policy restrictions, not plan or connection failures.

## Production

Managed auth is intended to make initial development easy. Before launch, use custom OAuth apps for integrations that need the developer's branding, scopes, or dedicated quotas.

For toolkit-specific details, fetch:

```text
https://docs.composio.dev/toolkits/faq/<toolkit>.md
```
