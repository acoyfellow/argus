import { configuredModel } from '$lib/argus/server';
import type { ArgusOutput } from '$lib/argus/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, platform, url }) => {
	const exampleUrl = new URL('/examples/example-report.json', url);
	const example = await fetch(exampleUrl).then((response) => {
		if (!response.ok) throw new Error(`Example report fetch failed: ${response.status}`);
		return response.json() as Promise<ArgusOutput>;
	});
	return {
		model: configuredModel({ ARGUS_MODEL: platform?.env.ARGUS_MODEL }),
		example
	};
};
