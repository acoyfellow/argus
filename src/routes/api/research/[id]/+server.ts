import { json } from '@sveltejs/kit';
import type { WorkflowSnapshot } from '$lib/argus/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const workflow = platform?.env.ARGUS_RESEARCH;
	if (!workflow) return json({ error: 'ARGUS_RESEARCH workflow binding is unavailable.' }, { status: 503 });
	try {
		const instance = await workflow.get(params.id);
		const status = await instance.status();
		const snapshot: WorkflowSnapshot = {
			id: params.id,
			status: status.status,
			...(status.output ? { output: status.output as WorkflowSnapshot['output'] } : {}),
			...(status.error ? { error: status.error } : {})
		};
		return json(snapshot);
	} catch (error) {
		return json({ error: error instanceof Error ? error.message : String(error) }, { status: 404 });
	}
};
