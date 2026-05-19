<script lang="ts">
	import SEO from '$lib/SEO.svelte';

	const title = 'Argus — docs';
	const description = 'How Argus runs: deploy it, run it locally, and read the gap-triggered follow-up loop.';
	const canonical = 'https://argus.coey.dev/docs';
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
		<iframe class="code-frame" title="Local commands" src="/docs/local.html"></iframe>
	</section>

	<section class="docs-section">
		<div class="docs-copy">
			<p class="eyebrow">02 · Deploy</p>
			<h2>Ship it to your account.</h2>
			<p>Deploy the site, API, and Workflow together. Use the button in the README, or run these commands.</p>
		</div>
		<iframe class="code-frame small" title="Deploy commands" src="/docs/deploy.html"></iframe>
	</section>

	<section id="loop" class="docs-section">
		<div class="docs-copy">
			<p class="eyebrow">03 · The loop</p>
			<h2>Gaps decide the next search.</h2>
			<p>This is the paper idea in code. Weak evidence creates the next search. The answer reads the board, not a pile of chat.</p>
		</div>
		<iframe class="code-frame tall" title="Gap-triggered workflow snippet" src="/docs/loop.html"></iframe>
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
	.code-frame {
		width: 100%;
		height: 238px;
		margin: 0;
		border: 2px solid #101010;
		border-radius: 18px;
		background: #24292e;
	}
	.code-frame.small { height: 138px; }
	.code-frame.tall { height: 304px; }
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
