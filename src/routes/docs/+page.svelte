<script lang="ts">
	import SEO from '$lib/SEO.svelte';
</script>

<svelte:head>
	<title>Argus — docs</title>
	<meta name="description" content="Run Argus locally, deploy it to Cloudflare, and see the evidence-gap loop in code." />
	<link rel="canonical" href="https://argus.coey.dev/docs" />
</svelte:head>

<SEO />

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

	<section class="hero docs-hero">
		<p class="eyebrow">Docs</p>
		<h1>Run Argus. Read the loop. Change the model.</h1>
		<p class="lede">Argus is one Worker with one durable Workflow. It gathers sources, follows weak spots, and returns a report with links.</p>
		<div class="actions">
			<a class="primary" href="#run">Run locally</a>
			<a class="secondary" href="#loop">See the code</a>
		</div>
	</section>

	<section class="docs-stack">
		<article id="run" class="docs-card">
			<div>
				<p class="eyebrow">01 · Local</p>
				<h2>Run it on your machine.</h2>
				<p>This builds the Worker and runs it locally. Workers AI still calls the real binding in your Cloudflare account.</p>
			</div>
			<iframe class="code-frame" title="Local commands" src="/docs/local.html"></iframe>
		</article>

		<article class="docs-card">
			<div>
				<p class="eyebrow">02 · Deploy</p>
				<h2>Ship it to your account.</h2>
				<p>Use the Deploy to Cloudflare button in the README, or run the same steps yourself.</p>
			</div>
			<iframe class="code-frame small" title="Deploy commands" src="/docs/deploy.html"></iframe>
		</article>

		<article id="loop" class="docs-card">
			<div>
				<p class="eyebrow">03 · The loop</p>
				<h2>Weak evidence creates the next search.</h2>
				<p>This is the core idea. Find thin spots, search again on purpose, then write the report from the board.</p>
			</div>
			<iframe class="code-frame tall" title="Gap-triggered workflow snippet" src="/docs/loop.html"></iframe>
		</article>

		<article class="docs-card model-card">
			<div>
				<p class="eyebrow">04 · Model</p>
				<h2>Set one Workers AI model.</h2>
				<p><code>ARGUS_MODEL</code> controls the model used for source analysis and synthesis. The default is <code>@cf/moonshotai/kimi-k2.6</code>.</p>
			</div>
			<pre class="plain-code"><code>{`"vars": {
  "ARGUS_MODEL": "@cf/moonshotai/kimi-k2.6"
}`}</code></pre>
		</article>
	</section>

	<section class="docs-footer">
		<a class="primary docs-cta" href="/">Try the live demo</a>
		<a href="https://github.com/acoyfellow/argus/blob/main/docs/architecture.md">Read the architecture note</a>
	</section>
</main>

<style>
	.nav-links a[aria-current='page'] { background:#17191d; color:#fffdf9; }
	.docs-hero { border-bottom:2px solid #17191d; }
	.docs-stack { display:grid; gap:22px; padding:42px 0; }
	.docs-card { display:grid; gap:24px; padding:30px; border:1px solid #d8d1c6; border-radius:28px; background:#fffdf9; box-shadow:0 18px 48px rgba(23,25,29,.06); }
	.docs-card h2 { margin-bottom:12px; }
	.docs-card p { max-width:820px; margin-bottom:0; color:#3f434b; }
	.code-frame { width:100%; height:238px; margin:0; border:2px solid #17191d; border-radius:20px; background:#24292e; }
	.code-frame.small { height:138px; }
	.code-frame.tall { height:304px; }
	.plain-code { margin:0; padding:22px; overflow-x:auto; border:2px solid #17191d; border-radius:20px; background:#24292e; color:#fffdf9; font-size:.95rem; line-height:1.6; }
	.plain-code code, .model-card code { font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
	.model-card p code { padding:2px 6px; border-radius:8px; background:#eef3ff; color:#1746b8; }
	.docs-footer { display:flex; flex-wrap:wrap; align-items:center; gap:18px; padding:4px 0 24px; }
	.docs-footer a { color:#1746b8; font-weight:700; text-underline-offset:4px; }
	.docs-footer .docs-cta { display:inline-flex; min-height:52px; align-items:center; padding:12px 20px; border:2px solid #17191d; border-radius:999px; background:#17191d; color:#fffdf9; text-decoration:none; }
	@media (max-width:680px) { .docs-card { padding:22px; border-radius:22px; } }
</style>
