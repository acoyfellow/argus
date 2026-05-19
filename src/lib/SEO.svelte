<script lang="ts">
	const title = 'Argus — research with receipts';
	const description = 'A sourced web research agent that gathers evidence, follows weak spots, and returns a clear report with links.';
	const canonical = 'https://argus.coey.dev/';
	const image = 'https://argus.coey.dev/og/argus.png';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content="web research agent, sourced research, evidence agent, Cloudflare Workflows, Workers AI" />
	<meta name="author" content="argus.coey.dev" />
	<link rel="canonical" href={canonical} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:alt" content="Argus — Research with receipts." />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
