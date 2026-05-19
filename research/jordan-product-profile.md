# Jordan product profile — working research note

Date: 2026-05-19  
Scope: observations useful for shaping `argus`, grounded in `.context/JORDAN.md`, the active conversation, and nearby portfolio notes. This is not a psychological diagnosis. It is a product/collaboration model to test against future work.

## Short thesis

Jordan is building **small, public, high-signal artifacts that turn Cloudflare infrastructure into agent-native product vocabulary**. He does not want demos that merely prove APIs work. He wants repositories that make a mechanism legible, desirable, deployable, and personally authored within seven minutes.

Argus fits because it can be simultaneously:

- a current research distillation;
- a useful standalone agent harness;
- a Cloudflare-native dynamic workflow story;
- a visual/docs artifact that earns sharing;
- a dogfood loop rather than a detached explainer.

## Strong preferences exposed here

### 1. Mechanism over reproduction

Jordan did not ask to reproduce the paper benchmark. He selected:

> extract mech => remix into utility

This recurs elsewhere in his context: code/prompts/models/harnesses are disposable; the spec, verification loop, and auth invariant matter. For Argus, the paper is raw material. The durable output is an installable harness with a crisp mechanism.

### 2. Public DevRel, but not empty DevRel

He explicitly chose “public devrelish,” then immediately tightened it into:

- bleeding-edge new work;
- a real utility, not a toy;
- dogfooding Cloudflare primitives;
- a standalone repo/site that can teach itself.

He wants public narrative surfaces to be *technical artifacts*, not campaign pages.

### 3. Frontend taste is a delivery constraint

Jordan interrupted the initial `remote` scaffold plan because a poor frontend substrate would trap the project, referencing dissatisfaction with `my-ax` and delight in `capa` docs plus Svelte. This is important: visual/documentary quality is not polish-after. It controls whether he will keep iterating.

A good Argus architecture therefore separates:

- a fast, crafted Svelte docs/demo surface at root;
- an isolated harness that remains deployable and boringly testable.

This preserves both taste and product integrity.

### 4. Boundary clarity creates freedom

His phrasing was sharp:

> ARGUS = A HARNESS. it's an agent. we want to build it in isolation

He dislikes a demo site becoming an accidental host app. The site can be expressive; the product boundary must be clean. One-click deploy is not a later convenience — it is a forcing function against coupling.

### 5. Minimal does not mean plain

“Minimal is the goal” here means:

- few concepts;
- legible architecture;
- fast local feedback;
- strong artifact shape;
- no decorative infrastructure.

It does **not** mean generic styling or under-described ideas. Jordan likes repos whose first page makes the thesis obvious.

## Behavioral signatures

### Compression by naming

Jordan frequently turns direction into compact phrases:

- “7min or less repos”
- “dogfooding cloudflare primitives”
- “dynamic workflows, or dynamic workers, or facets”
- “standalone in root, away from the source”

These phrases are not loose vibes. They are decision filters. Good collaboration expands them into implementation constraints, then returns to the compact phrase when choices drift.

### Fast course correction before sunk cost

He first gave a starter instruction (`remote`), then questioned it before scaffold momentum hardened. That is a constructive pattern: Jordan tolerates changing direction early to avoid living with a bad substrate. Agents should not defend the first plan when a deeper preference becomes visible.

### Wants to be accurately modeled, not merely obeyed

He reacted positively when the assistant inferred why `remote` might be wrong. The current stop gate — produce research about *him* — confirms that “understand my taste and operating system” is itself part of the task. Helpful agents should surface the model they are using and make it falsifiable.

### Portfolio coherence matters

`.context` notes frame Jordan's portfolio as a Cloudflare infrastructure funnel and explicitly allow projects to collapse, merge, or die. Argus should not be a novelty shard. It should harmonize with:

- `capa`: evidence-bearing capability surfaces;
- `lab` / traces: shareable proof loops;
- `unsurf`: browser/evidence workflows;
- Cloudflare primitives as the medium of explanation.

## Product implications for Argus

### The page should say one thing immediately

> Deep research should be a dynamic workflow over a compact evidence graph, not a pile of parallel chat transcripts.

Every diagram and demo should reinforce that sentence.

### The first live dogfood should visibly show the loop

Not a blank prompt box. Show:

1. the question;
2. generated facets;
3. evidence cards / claims;
4. a gap or contradiction;
5. the follow-up dispatch that gap creates;
6. source-traced synthesis.

Jordan values “7-minute traces.” Argus's demo should be a traceable performance of the mechanism.

### The harness readme must be install-forward

Future readers should understand:

- what gets deployed;
- what account resources are created;
- what secret/provider setup is required;
- how to ask one research question;
- how to inspect the evidence board.

If the explanation depends on the hosted site, the boundary failed.

### Primitive selection must be earned

Workflows are central because Argus dynamically creates later work from graph gaps. Storage, AI provider wiring, Browser Rendering, Vectorize, etc. should appear only when they make the mechanism clearer or the utility real. Jordan dislikes ornamental primitive soup.

## Collaboration advice for agents working with Jordan

- Offer a strong recommendation, not a buffet, once the constraints are known.
- Treat “go” as continuation, not re-consent.
- Prefer artifact-producing loops over long speculative plans.
- Keep local iteration fast; a beautiful product that is miserable to run will rot.
- Mention when a substrate threatens long-term taste or maintainability.
- Keep deployability/security invariants visible early.
- Ask only when the decision truly changes direction; standing approvals are broad.
- When Jordan supplies a vivid phrase, turn it into acceptance criteria.

## Open hypotheses to test

1. Jordan will prefer Argus's root website to feel authored and editorial, closer to `capa`'s clarity than a dashboard SaaS shell.
2. He will trade modest initial implementation speed for a scaffold that keeps frontend delight high.
3. He will reject unnecessary infrastructure even when it could make the Cloudflare primitive count look more impressive.
4. The eventual winning Argus demo will be a polished, replayable evidence trace rather than a fully general chat-first UI.
5. He will want the harness to become a clean independent unit other repos could call, deploy, or benchmark without `argus.coey.dev`.

## What this profile changed in the repo today

It drove the decision away from the `remote` starter and toward:

- SvelteKit root site with fast local dev;
- `.npmrc` public registry guardrail;
- a deliberately isolated `harness/` directory;
- docs/research notes close to the artifact;
- an opening landing page centered on the mechanism, not scaffold boilerplate.
