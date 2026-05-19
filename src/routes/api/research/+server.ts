import { json } from '@sveltejs/kit';
import { normalizeQuestion } from '$lib/argus/server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const payload = (await request.json()) as { question?: unknown };
		const question = normalizeQuestion(payload.question);
		const workflow = platform?.env.ARGUS_RESEARCH;
		if (!workflow) return json({ error: 'ARGUS_RESEARCH workflow binding is unavailable.' }, { status: 503 });
		const instance = await workflow.create({ params: { question } });
		return json({ id: instance.id, status: 'queued' }, { status: 202 });
	} catch (error) {
		return json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
	}
};
