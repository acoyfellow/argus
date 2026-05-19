# Argus architecture

## Executable boundary

- `/` is the public docs, demo, and dogfood site for `argus.coey.dev`.
- `src/worker.ts` is the deployable Argus Workflow harness.
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

Local multi-Worker dev runs through:

```bash
bun run dev
```

That command loads both `wrangler.jsonc` and `wrangler.workflow.jsonc`, so the external Workflow binding resolves locally while Workers AI stays a real remote binding.
