export type CoverageState = 'supported' | 'gap' | 'follow-up';

export interface ResearchRequest {
	question: string;
}

export interface Facet {
	id: string;
	label: string;
	query: string;
	why: string;
}

export interface SourceReceipt {
	title: string;
	url: string;
	excerpt: string;
}

export interface EvidencePiece {
	facetId: string;
	facet: string;
	claim: string;
	summary: string;
	confidence: number;
	coverage: CoverageState;
	sources: SourceReceipt[];
}

export interface Gap {
	facetId: string;
	facet: string;
	reason: string;
	query: string;
}

export interface SearchReport {
	facet: Facet;
	evidence: EvidencePiece;
	gap?: Gap;
}

export interface EvidenceGraph {
	question: string;
	facets: Facet[];
	evidence: EvidencePiece[];
	gaps: Gap[];
	coverage: {
		supported: number;
		followUps: number;
		totalFacets: number;
	};
}

export interface ArgusOutput {
	question: string;
	answer: string;
	graph: EvidenceGraph;
	followUps: SearchReport[];
	trace: string[];
	completedAt: string;
}

export interface WorkflowSnapshot {
	id: string;
	status: string;
	output?: ArgusOutput;
	error?: { name: string; message: string };
}
