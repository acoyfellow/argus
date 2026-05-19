<script lang="ts">
	import SEO from '$lib/SEO.svelte';
	import type { WorkflowSnapshot } from '$lib/argus/types';

	const questionExamples = [
		'How are evidence-assembly agents changing deep research systems?',
		'What makes explore-before-act useful for real web agents?',
		'Which new agent papers are actually useful to builders?'
	];

	let question = $state(questionExamples[0]);
	let snapshot = $state<WorkflowSnapshot | null>(null);
	let busy = $state(false);
	let notice = $state('');

	async function runArgus() {
		busy = true;
		notice = 'Starting Argus…';
		snapshot = null;
		try {
			const response = await fetch('/api/research', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ question })
			});
			const body = (await response.json()) as { id?: string; error?: string };
			if (!response.ok || !body.id) throw new Error(body.error || 'Argus did not start.');
			await poll(body.id);
		} catch (error) {
			notice = error instanceof Error ? error.message : String(error);
			busy = false;
		}
	}

	async function poll(id: string) {
		for (let attempt = 0; attempt < 90; attempt += 1) {
			const response = await fetch(`/api/research/${id}`);
			const body = (await response.json()) as WorkflowSnapshot & { error?: { message?: string } | string };
			if (!response.ok) throw new Error(typeof body.error === 'string' ? body.error : body.error?.message || 'Could not read workflow status.');
			snapshot = body;
			notice = `Workflow ${body.status}.`;
			if (body.status === 'complete' || body.status === 'errored' || body.status === 'terminated') {
				busy = false;
				return;
			}
			await new Promise((resolve) => setTimeout(resolve, 1250));
		}
		busy = false;
		notice = 'Argus is still working. Check back in a moment.';
	}
</script>

<SEO />

<main>
	<nav class="nav" aria-label="Primary">
		<a class="wordmark" href="/">ARGUS</a>
		<div class="nav-links">
			<a href="#demo">Live demo</a>
			<a href="#mechanism">Mechanism</a>
			<a href="https://arxiv.org/abs/2605.16217">Paper</a>
		</div>
	</nav>

	<section class="hero">
		<p class="eyebrow">argus.coey.dev · Cloudflare Workflows + Workers AI + live sources</p>
		<h1>Research with receipts.</h1>
		<p class="lede">Ask a question. Argus searches, notices what is missing, follows up, and shows the sources behind its answer.</p>
		<div class="actions">
			<a class="primary" href="#demo">Run Argus</a>
			<a class="secondary" href="https://github.com/acoyfellow/argus">GitHub</a>
		</div>
	</section>

	<section class="thesis"><p><strong>The idea.</strong> Research should show its work.</p></section>

	<section id="demo" class="demo-shell">
		<div class="composer">
			<p class="eyebrow">Try it</p>
			<h2>Ask a question.</h2>
			<label for="question">Research question</label>
			<textarea id="question" bind:value={question} rows="4"></textarea>
			<div class="chips">
				{#each questionExamples as example}
					<button type="button" onclick={() => (question = example)}>{example}</button>
				{/each}
			</div>
			<button class="run" type="button" onclick={runArgus} disabled={busy}>{busy ? 'Researching…' : 'Run Argus'}</button>
			{#if notice}<p class="notice">{notice}</p>{/if}
		</div>

		<div class="result">
			<p class="eyebrow">Evidence board</p>
			{#if snapshot?.output}
				<h2>{snapshot.output.answer}</h2>
				<div class="metrics">
					<span>{snapshot.output.graph.coverage.totalFacets} facets</span>
					<span>{snapshot.output.graph.evidence.length} evidence cards</span>
					<span>{snapshot.output.followUps.length} dynamic follow-ups</span>
				</div>
				<div class="trace">
					{#each snapshot.output.trace as item}<span>{item}</span>{/each}
				</div>
				<div class="cards">
					{#each snapshot.output.graph.evidence as piece}
						<article class={`card ${piece.coverage}`}>
							<header><strong>{piece.facet}</strong><span>{piece.coverage} · {Math.round(piece.confidence * 100)}%</span></header>
							<h3>{piece.claim}</h3>
							<p>{piece.summary}</p>
							<ul>{#each piece.sources.slice(0, 2) as source}<li><a href={source.url}>{source.title}</a></li>{/each}</ul>
						</article>
					{/each}
				</div>
			{:else}
				<div class="empty-board">
					<strong>The empty state is honest.</strong>
					<p>Run Argus to see the answer, the source cards, and any follow-up searches it needed.</p>
				</div>
			{/if}
		</div>
	</section>

	<section id="mechanism" class="mechanism">
		<article><p class="eyebrow">01</p><h2>Split</h2><p>Break the question into a few useful angles.</p></article>
		<article><p class="eyebrow">02</p><h2>Search</h2><p>Find live papers and keep the links.</p></article>
		<article><p class="eyebrow">03</p><h2>Follow up</h2><p>If the evidence is thin, search again on purpose.</p></article>
		<article><p class="eyebrow">04</p><h2>Answer</h2><p>Write from the source cards, not from a blob of chat.</p></article>
	</section>
</main>
