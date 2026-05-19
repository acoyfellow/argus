import { evidencePrompt, facetsPrompt, synthesisPrompt } from './prompts';
import type {
	ArgusOutput,
	EvidenceGraph,
	EvidencePiece,
	Facet,
	Gap,
	SearchReport,
	SourceReceipt
} from './types';

interface AiEnv {
	AI: Ai;
	ARGUS_MODEL?: string;
}

export const DEFAULT_MODEL = '@cf/moonshotai/kimi-k2.6';

export function configuredModel(env: Pick<AiEnv, 'ARGUS_MODEL'>): string {
	return env.ARGUS_MODEL || DEFAULT_MODEL;
}
const ARXIV_API = 'https://export.arxiv.org/api/query';

export async function buildFacets(question: string, env: AiEnv): Promise<Facet[]> {
	const fallback = fallbackFacets(question);
	const parsed = await safeJson<{ facets?: Array<Partial<Facet>> }>(env, facetsPrompt(question));
	const facets = parsed?.facets
		?.slice(0, 3)
		.map((facet, index) => ({
			id: `f${index + 1}`,
			label: clean(facet.label) || fallback[index]?.label || `Angle ${index + 1}`,
			query: clean(facet.query) || fallback[index]?.query || question,
			why: clean(facet.why) || fallback[index]?.why || 'Adds complementary evidence.'
		}));
	return facets?.length === 3 ? facets : fallback;
}

export async function searchFacet(
	question: string,
	facet: Facet,
	env: AiEnv,
	coverage: 'supported' | 'follow-up' = 'supported'
): Promise<SearchReport> {
	const sources = await fetchArxivSources(facet.query);
	const fallback = evidenceFromSources(facet, sources, coverage);
	const parsed = await safeJson<{
		claim?: string;
		summary?: string;
		confidence?: number;
		needsFollowUp?: boolean;
		gapReason?: string;
	}>(env, evidencePrompt(question, facet, sources));

	const evidence: EvidencePiece = {
		facetId: facet.id,
		facet: facet.label,
		claim: clean(parsed?.claim) || fallback.claim,
		summary: clean(parsed?.summary) || fallback.summary,
		confidence: clampConfidence(parsed?.confidence ?? fallback.confidence),
		coverage,
		sources
	};

	if (sources.length === 0) {
		evidence.claim = `${facet.label} has no source-backed claim yet.`;
		evidence.summary = 'The live source pass returned no parseable receipts. Argus keeps this as a visible gap instead of laundering model prose into evidence.';
		evidence.confidence = 0;
	}

	const lowCoverage = sources.length < 2 || evidence.confidence < 0.58 || parsed?.needsFollowUp === true;
	const gap = lowCoverage && coverage === 'supported'
		? {
				facetId: facet.id,
				facet: facet.label,
				reason:
					clean(parsed?.gapReason) ||
					(sources.length < 2 ? 'The first pass found too few distinct source receipts.' : 'The evidence wants a targeted confirmation pass.'),
				query: `${facet.query} recent evidence implementation evaluation`
			} satisfies Gap
		: undefined;

	return { facet, evidence, ...(gap ? { gap } : {}) };
}

export function assembleGraph(question: string, facets: Facet[], reports: SearchReport[]): EvidenceGraph {
	const evidence = reports.map((report) => report.evidence);
	const gaps = reports.flatMap((report) => (report.gap ? [report.gap] : []));
	return {
		question,
		facets,
		evidence,
		gaps,
		coverage: {
			supported: evidence.filter((piece) => piece.coverage === 'supported').length,
			followUps: evidence.filter((piece) => piece.coverage === 'follow-up').length,
			totalFacets: facets.length
		}
	};
}

export async function synthesize(graph: EvidenceGraph, env: AiEnv): Promise<string> {
	const raw = await safeText(env, synthesisPrompt(graph));
	return raw || fallbackAnswer(graph);
}

export function normalizeQuestion(value: unknown): string {
	const question = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
	if (question.length < 12) throw new Error('Ask a research question with at least 12 characters.');
	if (question.length > 360) throw new Error('Keep the research question under 360 characters.');
	return question;
}

export function finishOutput(
	question: string,
	answer: string,
	graph: EvidenceGraph,
	followUps: SearchReport[],
	trace: string[]
): ArgusOutput {
	return { question, answer, graph, followUps, trace, completedAt: new Date().toISOString() };
}

function fallbackFacets(question: string): Facet[] {
	return [
		{
			id: 'f1',
			label: 'Core mechanism',
			query: `${question} method mechanism`,
			why: 'Find the central technique instead of summarizing surface claims.'
		},
		{
			id: 'f2',
			label: 'Evidence and results',
			query: `${question} benchmark results evaluation`,
			why: 'Collect results or evaluations that support the mechanism.'
		},
		{
			id: 'f3',
			label: 'Implementation signal',
			query: `${question} system implementation agent workflow`,
			why: 'Look for utility-facing clues a builder can use.'
		}
	];
}

async function fetchArxivSources(query: string): Promise<SourceReceipt[]> {
	const tokens = query
		.replace(/[^\w\s-]/g, ' ')
		.trim()
		.split(/\s+/)
		.map((token) => token.toLowerCase())
		.filter((token) => token.length > 2 && !STOP_WORDS.has(token))
		.slice(0, 5);
	const search = encodeURIComponent(`all:${tokens.join(' OR ') || 'agent research'}`);
	const response = await fetch(`${ARXIV_API}?search_query=${search}&start=0&max_results=3&sortBy=submittedDate&sortOrder=descending`, {
		headers: { 'User-Agent': 'argus/0.0.1 (public Cloudflare research harness)' }
	});
	if (!response.ok) return [];
	const xml = await response.text();
	const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 3);
	return entries.map((entry) => {
		const block = entry[1] ?? '';
		const title = decodeXml(extract(block, /<title>([\s\S]*?)<\/title>/));
		const summary = decodeXml(extract(block, /<summary>([\s\S]*?)<\/summary>/));
		const url = decodeXml(extract(block, /<id>([\s\S]*?)<\/id>/));
		return { title: title || 'Untitled source', url, excerpt: summary.slice(0, 420) };
	}).filter((source) => source.url);
}

function evidenceFromSources(facet: Facet, sources: SourceReceipt[], coverage: 'supported' | 'follow-up'): EvidencePiece {
	const first = sources[0];
	return {
		facetId: facet.id,
		facet: facet.label,
		claim: first ? `${facet.label} is represented by ${first.title}.` : `${facet.label} still needs source receipts.`,
		summary: first?.excerpt || 'The search pass did not return a parseable arXiv source, so Argus keeps the gap visible.',
		confidence: sources.length >= 2 ? 0.62 : sources.length === 1 ? 0.44 : 0.18,
		coverage,
		sources
	};
}

function fallbackAnswer(graph: EvidenceGraph): string {
	const claims = graph.evidence.slice(0, 3).map((piece) => piece.claim).join(' ');
	return `${claims} Argus exposed ${graph.gaps.length} remaining evidence gap${graph.gaps.length === 1 ? '' : 's'} rather than hiding them.`;
}

async function safeJson<T>(env: AiEnv, prompt: string): Promise<T | null> {
	try {
		return await runJson<T>(env, prompt);
	} catch {
		return null;
	}
}

async function safeText(env: AiEnv, prompt: string): Promise<string> {
	try {
		return await runText(env, prompt);
	} catch {
		return '';
	}
}

async function runJson<T>(env: AiEnv, prompt: string): Promise<T | null> {
	const text = await runText(env, prompt);
	const match = text.match(/\{[\s\S]*\}/);
	if (!match) return null;
	try {
		return JSON.parse(match[0]) as T;
	} catch {
		return null;
	}
}

async function runText(env: AiEnv, prompt: string): Promise<string> {
	const raw = await env.AI.run(configuredModel(env), {
		messages: [{ role: 'user', content: prompt }],
		max_tokens: 700
	}) as { response?: unknown } | string;
	if (typeof raw === 'string') return raw.trim();
	return typeof raw.response === 'string' ? raw.response.trim() : JSON.stringify(raw.response ?? '').trim();
}

function clean(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

function clampConfidence(value: unknown): number {
	const number = typeof value === 'number' ? value : Number(value);
	return Math.round(Math.min(1, Math.max(0, Number.isFinite(number) ? number : 0.35)) * 100) / 100;
}

function extract(value: string, pattern: RegExp): string {
	return pattern.exec(value)?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
}

const STOP_WORDS = new Set(['the', 'and', 'for', 'are', 'how', 'what', 'with', 'from', 'into', 'their', 'that', 'this', 'changing', 'changes']);

function decodeXml(value: string): string {
	return value
		.replaceAll('&amp;', '&')
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&quot;', '"')
		.replaceAll('&apos;', "'");
}
