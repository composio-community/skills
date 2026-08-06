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
