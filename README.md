# Argus

**An evidence-assembly research agent running on Cloudflare Workflows.**

`argus.coey.dev` is the public docs, demo, and dogfood surface for Argus. It remixes [*Argus: Evidence Assembly for Scalable Deep Research Agents*](https://arxiv.org/abs/2605.16217) into a real utility: ask a question, start a durable workflow, build facets, fetch current arXiv source receipts, let Workers AI assemble evidence cards, dynamically dispatch follow-up searches for thin coverage, and synthesize the compact evidence board.

## What runs

| Path | Purpose |
|---|---|
| `src/routes/+page.svelte` | Public demo UI and evidence-board renderer |
| `src/routes/api/research/` | Starts and polls Workflow instances |
| `src/worker.ts` | `ArgusResearchWorkflow`, the durable adaptive loop |
| `src/lib/argus/` | Prompts, evidence graph model, live source fetch, synthesis |
| `research/` | Paper notes and product reasoning receipts |

No placeholder harness directory: the harness is the executable Workflow and its API/UI loop.

## Cloudflare primitives

- **Workflows** — one durable research run; graph gaps create later follow-up steps.
- **Workers AI** — facet generation, evidence extraction, and final synthesis.
- **SvelteKit on Workers** — public docs/demo surface and Workflow API.
- **Live fetch** — arXiv API receipts are real sources, not fixtures.

## Run locally

Run the full local multi-Worker system through Wrangler so real local Workflows + remote Workers AI execute against your authenticated Cloudflare account.

```bash
bun run dev
```

Open `http://localhost:4173`, then click **Start Argus workflow**. If you only need rapid visual CSS/Svelte iteration without the Workflow API, `bun run dev:ui` starts plain Vite.

## Validate

```bash
bun run check
bun run build
```

`check` refreshes Wrangler types, clears generated build artifacts that confuse the scaffold's JS checking after a prior build, then runs Svelte type checking. `build` creates the SvelteKit Worker bundle and dry-runs the separate Workflow Worker deploy.

## Deploy shape

The deployable system is two Workers configured in-repo:

- `wrangler.workflow.jsonc` → `argus-workflow`, exporting `ArgusResearchWorkflow`
- `wrangler.jsonc` → the SvelteKit site/API, bound to that remote workflow via `script_name`

Deploy the workflow first, then the site:

```bash
wrangler deploy -c wrangler.workflow.jsonc
bun run build
wrangler deploy
```

The eventual Deploy to Cloudflare flow should automate those exact two deploys, not introduce another architecture.

## Thesis

> Deep research should be a dynamic workflow over a compact evidence graph, not a pile of parallel chat transcripts.
