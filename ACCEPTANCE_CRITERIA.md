# Acceptance Criteria

## Maturity states

Each capability is tracked independently using:

1. `NOT_STARTED`
2. `SCOPED`
3. `INFRASTRUCTURE_READY`
4. `DEVELOPMENT_EVIDENCE`
5. `PROTECTED_VALIDATION`
6. `VALIDATED`
7. `INTEGRATED`
8. `INDEPENDENTLY_REPRODUCED`

A capability may regress if new evidence invalidates an earlier claim.

## Program-level prohibition

Do not calculate a single "JARVIS completion %" by averaging unrelated tracks. Percentages from source research repositories are local to their own gate rubrics.

## MVJ acceptance gates

### G1 — Persistent state integrity

Minimum target:
- current-vs-superseded classification accuracy >= 0.95 on a protected benchmark;
- critical state supersession accuracy >= 0.98;
- unsupported-current-state assertion rate <= 0.02;
- all evaluated durable state assertions have provenance;
- explicit no-evidence cases are measured separately from answerable cases;
- benchmark-specific advantages are not generalized beyond tested conditions.

### G2 — Proactivity safety and compliance

Minimum target:
- deterministic policy evaluation on identical structured state;
- mandatory prohibition/invariant violations = 0 on exhaustive bounded-state audit;
- unauthorized high-risk `ACT` decisions = 0 on protected evaluation;
- counterfactual consistency and temporal consistency explicitly tested;
- external/human usefulness evaluation required before claiming preference alignment or social appropriateness.

### G3 — Action verification

Minimum target:
- every action class declares observable success criteria;
- 100% of benchmark action attempts receive a verification verdict;
- false-completion rate <= 0.05 on protected evaluation;
- destructive duplicate side effects = 0 in protected reversible test environments;
- `INCONCLUSIVE` verification cannot silently become completed state.

### G4 — Recovery

Minimum target:
- retry/rollback/escalation path defined per action risk class;
- recovery outcome recorded and verified;
- no retry loops without bounded attempt policy;
- irreversible operations cannot be automatically retried without explicit authorization policy.

### G5 — Long-horizon continuity

Minimum target:
- tasks survive process/session restart;
- waiting dependencies are represented explicitly;
- changed user state can invalidate/replan pending work;
- task lifecycle supports at least `PLANNED`, `ACTIVE`, `WAITING`, `BLOCKED`, `COMPLETED`, `ABANDONED`;
- protected multi-session benchmark success >= 0.90 before MVJ qualification;
- no completed label without verified terminal condition.

### G6 — Cross-device coherence

Minimum target:
- at least two interfaces/endpoints share versioned state contracts;
- conflict-resolution semantics are deterministic;
- stale device state cannot silently overwrite newer authoritative state;
- device-specific permission scopes are preserved;
- sync history is auditable.

### G7 — Privacy and authorization

Minimum target:
- sensitive source classes identified;
- durable writes have retention/deletion semantics;
- user correction/deletion can propagate to derived state where technically feasible;
- high-risk/irreversible/financial/security-sensitive/physical actions require explicit authorization unless a separately validated policy permits bounded autonomy;
- secrets/credentials are never committed to research evidence.

### G8 — End-to-end traceability

For every protected integration case, the system must be able to produce a trace linking:

```text
source evidence
-> state snapshot
-> intervention decision
-> policy trace
-> plan
-> authorization
-> action attempts
-> verification
-> recovery (if any)
-> final state transition
```

Missing critical trace edges fail closed.

## SOTA / superiority claim gate

A claim such as `state of the art`, `superior`, `beats frontier`, or `parity` requires all applicable conditions:

- public or independently inspectable benchmark;
- frozen evaluation protocol before candidate results;
- strong contemporary baselines;
- same or explicitly normalized model/tool/resource conditions;
- adequate sample size and uncertainty/statistical analysis;
- no result-dependent benchmark edits;
- reproducible artifacts;
- negative results preserved;
- limitations stated;
- independent reproduction for strong universal claims.

A strong result on an internally designed benchmark may be recorded as `BENCHMARK-SPECIFIC`, not universal superiority.

## Capability ladder qualification

### L1 Persistent Assistant
Requires G1 plus production-like state lifecycle tests.

### L2 Proactive Assistant
Requires L1 + G2 and an external/human usefulness study sufficient for the stated claim.

### L3 Reliable Agent
Requires L2 + G3 + G4 + G5.

### L4 Ambient Personal Agent
Requires L3 + multimodal evidence validation + G6 + G7.

### L5 JARVIS-class Personal Agent
Requires L4 + full G8 + independent integrated evaluation. Physical-world capabilities are optional for initial L5 qualification and, if present, require separate safety validation.
