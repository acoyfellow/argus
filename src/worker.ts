import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep
} from 'cloudflare:workers';
import {
	assembleGraph,
	buildFacets,
	finishOutput,
	normalizeQuestion,
	searchFacet,
	synthesize
} from '$lib/argus/server';
import type { ArgusOutput, ResearchRequest, SearchReport } from '$lib/argus/types';

interface Env {
	AI: Ai;
}

export default {
	fetch() {
		return Response.json({ name: 'argus-workflow', status: 'ready' });
	}
};

export class ArgusResearchWorkflow extends WorkflowEntrypoint<Env, ResearchRequest> {
	async run(event: WorkflowEvent<ResearchRequest>, step: WorkflowStep): Promise<ArgusOutput> {
		const question = normalizeQuestion(event.payload.question);
		const trace = [`accepted question: ${question}`];

		const facets = await step.do('facet-question', async () => buildFacets(question, this.env));
		trace.push(`generated ${facets.length} facets`);

		const firstPass: SearchReport[] = [];
		for (const facet of facets) {
			firstPass.push(await step.do(`search-${facet.id}`, async () => searchFacet(question, facet, this.env)));
		}
		trace.push(`assembled ${firstPass.length} first-pass search reports`);

		const followUps: SearchReport[] = [];
		for (const gap of firstPass.flatMap((report) => (report.gap ? [report.gap] : []))) {
			const facet = {
				id: `${gap.facetId}-follow-up`,
				label: `${gap.facet} follow-up`,
				query: gap.query,
				why: gap.reason
			};
			followUps.push(
				await step.do(`follow-up-${gap.facetId}`, async () => searchFacet(question, facet, this.env, 'follow-up'))
			);
		}
		trace.push(`dispatched ${followUps.length} graph-triggered follow-up searches`);

		const graph = assembleGraph(question, facets, [...firstPass, ...followUps]);
		const answer = await step.do('synthesize-evidence-board', async () => synthesize(graph, this.env));
		trace.push('synthesized answer from the evidence board');

		return finishOutput(question, answer, graph, followUps, trace);
	}
}
