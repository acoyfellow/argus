# Argus architecture

## Executable boundary

- `/` is the public docs, demo, and dogfood site for `argus.coey.dev`.
- `src/workflow-runtime.ts` is the typed Argus Workflow harness body.
- `scripts/attach-workflow.mjs` attaches the Workflow export to the generated SvelteKit Worker entrypoint so one Worker deploy contains site + harness.
- `src/routes/api/research/` is the site-facing public contract: create a Workflow instance, poll its status, render its output.
- The page never fakes research results; it renders Workflow output.

## Paper mechanism, remixed

Argus takes the useful mechanism from *Argus: Evidence Assembly for Scalable Deep Research Agents* rather than reproducing its training stack:

- **facets** split a question into lines of inquiry;
- **searchers** return bounded evidence traces;
- **the evidence board** stores claims, sources, support, contradictions, and missing coverage;
- **a navigator** dispatches follow-up research against gaps;
- **synthesis** reads the evidence board, not the raw wandering transcripts.

This fits dynamic Cloudflare workflows because the evidence state decides what work should exist next.

## Cloudflare shape proven locally

- Workflows orchestrate adaptive facet → search → gap → follow-up → synthesize loops.
- Workers AI performs facet generation, evidence extraction from fetched source receipts, and synthesis.
- The SvelteKit Worker starts and polls Workflow instances.
- arXiv fetches are live receipts, not fixtures.

Full local dev runs through:

```bash
bun run dev
```

That command builds the single deployable Worker, attaches the Workflow export, and runs Wrangler locally while Workers AI stays a real remote binding. The same one-config shape is what the Deploy to Cloudflare button consumes.
