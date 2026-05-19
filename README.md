# Argus

**A sourced web research agent running on Cloudflare Workflows.**

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/acoyfellow/argus)

- **Demo:** [argus.coey.dev](https://argus.coey.dev)
- **Paper:** [*Argus: Evidence Assembly for Scalable Deep Research Agents*](https://arxiv.org/abs/2605.16217)

`argus.coey.dev` is the public docs, demo, and dogfood surface for Argus. Ask a question. Argus gathers evidence, checks weak spots, follows up where needed, and returns a report with links. The evidence-loop idea is inspired by the May 2026 Argus paper; the product is source-agnostic web research.

## What runs

| Path | Purpose |
|---|---|
| `src/routes/+page.svelte` | Public demo UI and evidence-board renderer |
| `src/routes/api/research/` | Starts and polls Workflow instances |
| `src/workflow-runtime.ts` | `ArgusResearchWorkflow`, the durable adaptive loop |
| `src/lib/argus/` | Prompts, evidence report model, source fetch, synthesis |
| `research/` | Paper notes and product reasoning receipts |

## Cloudflare primitives

- **Workflows** — one durable research run; graph gaps create later follow-up steps.
- **Workers AI** — facet generation, evidence extraction, and final synthesis.
- **SvelteKit on Workers** — public docs/demo surface and Workflow API.
- **Live sources** — the search layer gathers source receipts; the example report shows mixed public web sources.

## Run locally

Run the app through Wrangler so local Workflows + remote Workers AI execute against your authenticated Cloudflare account.

```bash
bun run dev
```

Open `http://localhost:4173`, then click **Start research**. If you only need rapid visual CSS/Svelte iteration without the Workflow API, `bun run dev:ui` starts plain Vite.

## Validate

```bash
bun run check
bun run build
```

`check` runs Svelte type checking. `build` creates the deployable Worker bundle, generates docs/code assets, and dry-runs Wrangler deploy.

## Deploy

Click the **Deploy to Cloudflare** button above to clone and deploy a single Worker into your own account. The Worker includes:

- the SvelteKit docs/demo/API surface;
- the `ArgusResearchWorkflow` binding;
- the Workers AI binding Argus uses for facets, evidence extraction, and synthesis.

The repository build runs `vite build`, attaches the Workflow export to the generated SvelteKit Worker entrypoint, refreshes Wrangler types, and dry-runs `wrangler deploy`. That same single-worker configuration is verified locally by `bun run preview` and deploys with:

```bash
bun run build
wrangler deploy
```

## Thesis

> Research should show its work.
