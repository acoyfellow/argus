import { configuredModel } from '$lib/argus/server';
import type { ArgusOutput } from '$lib/argus/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, platform }) => {
	const example = await fetch('/examples/example-report.json').then((response) => response.json() as Promise<ArgusOutput>);
	return {
		model: configuredModel({ ARGUS_MODEL: platform?.env.ARGUS_MODEL }),
		example
	};
};
