// Wrangler deploys the built SvelteKit Worker from `.svelte-kit/cloudflare/_worker.js`.
// The Workflow export is attached there by `scripts/attach-workflow.mjs`, while the
// typed Workflow body lives in `src/workflow-runtime.ts` for readable source control.
export { runArgusResearch } from './workflow-runtime';
