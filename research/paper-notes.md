# Paper notes

## Primary source: Argus

*Argus: Evidence Assembly for Scalable Deep Research Agents* (arXiv:2605.16217, 2026-05-15) argues that parallel research rollouts duplicate effort unless a navigator maintains shared evidence state. Its useful production mechanism is:

1. search distinct angles;
2. parse traces into evidence and claim nodes;
3. record support and contradiction edges;
4. identify under-supported claims, contradictions, and unanswered aspects;
5. dispatch targeted follow-ups;
6. synthesize from the compact graph with source-traced claims.

## Useful adjacent constraints

- *Look Before You Leap* suggests explicit coverage beats premature answering. Argus should expose facet/evidence gaps rather than hiding them.
- *Context, Reasoning, and Hierarchy* suggests structured state often beats expensive deliberation. Keep searchers simple; put strategy in graph state and navigator decisions.

This repo is a Cloudflare-native utility remix, not a benchmark reproduction.
