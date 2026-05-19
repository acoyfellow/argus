<script lang="ts">
	import SEO from '$lib/SEO.svelte';
	import type { PageData } from './$types';
	import type { WorkflowSnapshot } from '$lib/argus/types';

	let { data }: { data: PageData } = $props();

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

	const report = $derived(snapshot?.output);
	const firstPass = $derived(report?.graph.evidence.filter((piece) => piece.coverage !== 'follow-up') ?? []);
	const followUpCards = $derived(report?.graph.evidence.filter((piece) => piece.coverage === 'follow-up') ?? []);
	const sources = $derived(Array.from(new Map((report?.graph.evidence.flatMap((piece) => piece.sources) ?? []).map((source) => [source.url, source])).values()));

	function reportMarkdown() {
		if (!report) return '';
		const checked = firstPass.map((piece) => `- **${piece.facet}:** ${piece.claim}`).join('\n');
		const followUps = followUpCards.length ? followUpCards.map((piece) => `- **${piece.facet}:** ${piece.claim}`).join('\n') : '- None.';
		const sourceList = sources.map((source, index) => `${index + 1}. [${source.title}](${source.url})`).join('\n');
		return `# Argus report\n\n## Question\n${report.question}\n\n## Answer\n${report.answer}\n\n## What Argus checked\n${checked}\n\n## Follow-ups\n${followUps}\n\n## Sources\n${sourceList}\n`;
	}

	async function copyAnswer() {
		if (!report) return;
		await navigator.clipboard.writeText(report.answer);
		notice = 'Answer copied.';
	}

	function downloadReport() {
		if (!report) return;
		const blob = new Blob([reportMarkdown()], { type: 'text/markdown;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'argus-report.md';
		link.click();
		URL.revokeObjectURL(url);
		notice = 'Report downloaded.';
	}
</script>

<SEO />

<main>
	<nav class="nav" aria-label="Primary">
		<a class="wordmark" href="/">ARGUS</a>
		<div class="nav-links">
			<a href="#demo">Live demo</a>
			<a href="#mechanism">Mechanism</a>
			<a href="/docs">Docs</a>
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

	<section id="mechanism" class="diagram" aria-label="How Argus works">
		<div class="diagram-copy">
			<p class="eyebrow">How it works</p>
			<h2>The gaps decide the next search.</h2>
		</div>
		<div class="loop">
			<div class="loop-node"><span>01</span><strong>Question</strong><p>Start with one ask.</p></div>
			<div class="loop-arrow">→</div>
			<div class="loop-node"><span>02</span><strong>Search</strong><p>Collect source cards.</p></div>
			<div class="loop-arrow loop-turn">↺</div>
			<div class="loop-node loop-gap"><span>03</span><strong>Gap?</strong><p>Thin evidence gets a follow-up search.</p></div>
			<div class="loop-arrow">→</div>
			<div class="loop-node"><span>04</span><strong>Report</strong><p>Answer with receipts.</p></div>
		</div>
	</section>

	<section id="demo" class="demo-shell">
		<div class="composer">
			<p class="eyebrow">Try it</p>
			<h2>Ask a question.</h2>
			<p class="model-note">Workers AI: {data.models[0]}{#if data.models[1]} · fallback: {data.models[1]}{/if}</p>
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

		<div class="result report">
			<p class="eyebrow">Evidence report</p>
			{#if report}
				<header class="report-head">
					<div>
						<h2>{report.answer}</h2>
						<p>{report.graph.evidence.length} source cards · {report.followUps.length} follow-up searches</p>
					</div>
					<div class="report-actions">
						<button type="button" onclick={copyAnswer}>Copy answer</button>
						<button type="button" onclick={downloadReport}>Download .md</button>
					</div>
				</header>
				<section class="report-section">
					<h3>What Argus checked</h3>
					<div class="cards">
						{#each firstPass as piece}
							<article class="card">
								<header><strong>{piece.facet}</strong></header>
								<p>{piece.claim}</p>
							</article>
						{/each}
					</div>
				</section>
				<section class="report-section">
					<h3>Follow-ups</h3>
					{#if followUpCards.length}
						<div class="cards compact">{#each followUpCards as piece}<article class="card follow-up"><header><strong>{piece.facet}</strong></header><p>{piece.claim}</p></article>{/each}</div>
					{:else}<p>No follow-up search was needed.</p>{/if}
				</section>
				<section class="report-section sources">
					<h3>Sources</h3>
					<ol>{#each sources as source}<li><a href={source.url}>{source.title}</a></li>{/each}</ol>
				</section>
				<details class="run-details"><summary>Run trace</summary><div class="trace">{#each report.trace as item}<span>{item}</span>{/each}</div></details>
			{:else}
				<div class="empty-board">
					<strong>The empty state is honest.</strong>
					<p>Run Argus to see the answer, the source cards, and any follow-up searches it needed.</p>
				</div>
			{/if}
		</div>
	</section>

</main>
