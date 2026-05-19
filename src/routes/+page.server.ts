import { configuredModel } from '$lib/argus/server';
import { exampleReport } from '$lib/example-report';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => ({
	model: configuredModel({ ARGUS_MODEL: platform?.env.ARGUS_MODEL }),
	example: exampleReport
});
