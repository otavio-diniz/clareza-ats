<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This codebase originated in [Lovable](https://lovable.dev). This GitHub
> repository was imported independently; **automatic GitHub ↔ Lovable editor
> synchronization has not been verified**. A GitHub push by itself is **not**
> evidence of an updated Lovable deployment.
>
> Preserve public Git history: avoid force push, rebases or amendments of
> published commits. Work incrementally and validate the actual deployment
> before claiming synchronization.

## What Lovable manages

Platform-specific resources (database, connectors, gateway and secrets) must
be managed through legitimate Lovable controls when they are used. Ordinary
source maintenance in GitHub is separate from the Lovable deployment; changes
require their own tests and explicit deployment verification. With the
[Lovable MCP](https://mcp.lovable.dev) connected, `send_message` can request
agent changes when the workspace has sufficient credits.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->