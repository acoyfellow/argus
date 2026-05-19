import { configuredModels } from '$lib/argus/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => ({
	models: configuredModels({
		ARGUS_MODEL: platform?.env.ARGUS_MODEL,
		ARGUS_FALLBACK_MODEL: platform?.env.ARGUS_FALLBACK_MODEL
	})
});
