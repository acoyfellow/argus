import type { EvidenceGraph, EvidencePiece, Facet, SourceReceipt } from './types';

export function facetsPrompt(question: string): string {
	return `Turn this research question into exactly 3 non-overlapping evidence facets.\nQuestion: ${question}\nRespond as ONLY JSON: {"facets":[{"label":"...","query":"...","why":"..."}]}`;
}

export function evidencePrompt(question: string, facet: Facet, sources: SourceReceipt[]): string {
	return `You are a careful research searcher.\nQuestion: ${question}\nFacet: ${facet.label}\nWhy this facet: ${facet.why}\nSource snippets:\n${sources
		.map((source, index) => `${index + 1}. ${source.title}\nURL: ${source.url}\nExcerpt: ${source.excerpt}`)
		.join('\n\n')}\n\nReturn ONLY JSON: {"claim":"one grounded claim or the best provisional claim","summary":"two short sentences explaining the evidence","confidence":0.0,"needsFollowUp":false,"gapReason":"empty unless a targeted follow-up would improve this facet"}. Confidence must be 0 through 1.`;
}

export function synthesisPrompt(graph: EvidenceGraph): string {
	const evidence = graph.evidence
		.filter((piece: EvidencePiece) => piece.sources.length > 0)
		.map((piece: EvidencePiece, index: number) => {
			const urls = piece.sources.map((source) => source.url).join(', ');
			return `${index + 1}. [${piece.facet}] ${piece.claim} (${piece.coverage}, confidence ${piece.confidence}) Sources: ${urls}`;
		})
		.join('\n');

	return `Answer the question using only the source-backed evidence board. Never add numbers, claims, or conclusions that are not stated in a listed evidence item.\nQuestion: ${graph.question}\nEvidence board:\n${evidence || 'No source-backed evidence cards were assembled.'}\nGaps: ${graph.gaps.map((gap) => `${gap.facet}: ${gap.reason}`).join('; ') || 'none'}\nReturn a concise plain-English answer. If evidence is empty or thin, say so plainly. End with a sentence naming any remaining gap if one exists.`;
}
