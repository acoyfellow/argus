<script lang="ts">
	import SEO from '$lib/SEO.svelte';

	const title = 'Argus — docs';
	const description = 'How Argus runs: deploy it, run it locally, and read the gap-triggered follow-up loop.';
	const canonical = 'https://argus.coey.dev/docs';

	const localSnippet = `# Clone, install, and run locally.
git clone https://github.com/acoyfellow/argus
cd argus
bun install

# Full local run through Wrangler. Real Workflows + Workers AI.
bun run dev   # then open http://localhost:4173
`;

	const deploySnippet = `# Type-check, build, and deploy a single Worker.
bun run check
bun run build
wrangler deploy
`;

	const loopSnippet = `// src/workflow-runtime.ts — the gap-triggered follow-up loop.
// 1. Split the question into facets.
const facets = await generateFacets(question);

// 2. First-pass searches return bounded evidence traces.
const evidence = await Promise.all(
  facets.map((facet) => searchArxiv(facet))
);

// 3. The evidence board scores coverage and surfaces GAPS.
const board = buildEvidenceBoard(facets, evidence);
const gaps = board.facets.filter((facet) => facet.coverage === 'thin');

// 4. Gaps DECIDE the next step. Follow-up searches are dispatched
//    only for the facets that need more support.
for (const gap of gaps) {
  const followUp = await searchArxiv(gap.followUpQuery);
  board.attach(gap.id, followUp, { coverage: 'follow-up' });
}

// 5. Synthesis reads the evidence board, not the raw transcripts.
return synthesize(board);
`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonical} />
</svelte:head>

<main>
	<nav class="nav" aria-label="Primary">
		<a class="wordmark" href="/">ARGUS</a>
		<div class="nav-links">
			<a href="/">Demo</a>
			<a href="/docs" aria-current="page">Docs</a>
			<a href="https://github.com/acoyfellow/argus">GitHub</a>
			<a href="https://arxiv.org/abs/2605.16217">Paper</a>
		</div>
	</nav>

	<section class="hero">
		<p class="eyebrow">Docs · run Argus on your account</p>
		<h1>What Argus does. How to run it.</h1>
		<p class="lede">Argus researches one question. It searches live papers, follows weak spots, and returns an answer with sources. It runs as one Cloudflare Worker with one durable Workflow.</p>
		<div class="actions">
			<a class="primary" href="#run">Run it</a>
			<a class="secondary" href="#loop">Read the loop</a>
		</div>
	</section>

	<section class="thesis"><p><strong>The shape.</strong> One Worker. One Workflow. Workers AI. Live paper links.</p></section>

	<section id="run" class="docs-section">
		<div class="docs-copy">
			<p class="eyebrow">01 · Local</p>
			<h2>Run it on your machine.</h2>
			<p>This builds the Worker and runs it locally. Workers AI still calls the real binding in your Cloudflare account.</p>
		</div>
		<pre class="code"><code>{localSnippet}</code></pre>
	</section>

	<section class="docs-section">
		<div class="docs-copy">
			<p class="eyebrow">02 · Deploy</p>
			<h2>Ship it to your account.</h2>
			<p>Deploy the site, API, and Workflow together. Use the button in the README, or run these commands.</p>
		</div>
		<pre class="code"><code>{deploySnippet}</code></pre>
	</section>

	<section id="loop" class="docs-section">
		<div class="docs-copy">
			<p class="eyebrow">03 · The loop</p>
			<h2>Gaps decide the next search.</h2>
			<p>This is the paper idea in code. Weak evidence creates the next search. The answer reads the board, not a pile of chat.</p>
		</div>
		<pre class="code"><code>{loopSnippet}</code></pre>
	</section>

	<section class="diagram" aria-label="The Argus loop">
		<div class="diagram-copy">
			<p class="eyebrow">At a glance</p>
			<h2>One question, one durable run.</h2>
		</div>
		<div class="loop">
			<div class="loop-node"><span>01</span><strong>Facets</strong><p>Split the question into lines of inquiry.</p></div>
			<div class="loop-arrow">→</div>
			<div class="loop-node"><span>02</span><strong>Search</strong><p>Live arXiv receipts, bounded traces.</p></div>
			<div class="loop-arrow loop-turn">↺</div>
			<div class="loop-node loop-gap"><span>03</span><strong>Gap?</strong><p>Thin coverage triggers a follow-up search.</p></div>
			<div class="loop-arrow">→</div>
			<div class="loop-node"><span>04</span><strong>Synthesize</strong><p>Read the board. Return the answer with sources.</p></div>
		</div>
	</section>

	<section class="docs-section last">
		<div class="docs-copy">
			<p class="eyebrow">More</p>
			<h2>Where to read next.</h2>
			<p>The <a href="https://github.com/acoyfellow/argus">README</a> covers the single-Worker shape and the deploy button. <a href="https://github.com/acoyfellow/argus/blob/main/docs/architecture.md">docs/architecture.md</a> explains the executable boundary and the paper mechanism Argus remixes. The <a href="https://arxiv.org/abs/2605.16217">arXiv paper</a> is the source of the evidence-assembly idea.</p>
		</div>
		<div class="docs-aside">
			<a class="primary big" href="/">Try the live demo →</a>
		</div>
	</section>
</main>

<SEO />

<style>
	.docs-section {
		display: grid;
		grid-template-columns: minmax(220px, .55fr) minmax(0, 1.45fr);
		gap: clamp(18px, 4vw, 48px);
		padding: 28px 0;
		border-bottom: 1.5px solid #101010;
	}
	.docs-section.last { border-bottom: 3px solid #101010; }
	.docs-copy h2 { max-width: 360px; margin: 0 0 12px; }
	.docs-copy p { margin: 0; color: rgba(16,16,16,.8); line-height: 1.5; }
	.code code {
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
	}
	.code {
		margin: 0;
		padding: 18px;
		border: 2px solid #101010;
		border-radius: 18px;
		background: #101010;
		color: #f3efef;
		overflow-x: auto;
		font-size: .86rem;
		line-height: 1.55;
	}
	.code code { white-space: pre; }
	.docs-aside { display: grid; align-content: start; }
	.docs-aside .primary.big {
		display: inline-block;
		padding: 14px 22px;
		border: 2px solid #101010;
		border-radius: 999px;
		background: #101010;
		color: #f3efef;
		text-decoration: none;
		font-weight: 600;
	}
	.nav-links a[aria-current='page'] { background: #101010; color: #f3efef; }

	@media (max-width: 920px) {
		.docs-section { grid-template-columns: 1fr; }
	}
</style>
