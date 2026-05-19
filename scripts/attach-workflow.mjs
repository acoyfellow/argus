import { readFile, writeFile } from 'node:fs/promises';

const workerPath = '.svelte-kit/cloudflare/_worker.js';
const worker = await readFile(workerPath, 'utf8');
if (worker.includes('class ArgusResearchWorkflow extends WorkflowEntrypoint')) {
	process.exit(0);
}

const imports = `\nimport { WorkflowEntrypoint } from "cloudflare:workers";\n`;
const workflow = `\n\nclass ArgusResearchWorkflow extends WorkflowEntrypoint {\n  async run(event, step) {\n    const mod = await import("../../src/workflow-runtime.ts");\n    return mod.runArgusResearch(event, step, this.env);\n  }\n}\n`;
const exportMarker = 'export {\n  worker_default as default';
const replacement = `${workflow}\nexport {\n  ArgusResearchWorkflow,\n  worker_default as default`;
if (!worker.includes(exportMarker)) throw new Error('Could not find SvelteKit Worker export marker.');
await writeFile(workerPath, `${imports}${worker.replace(exportMarker, replacement)}`);
