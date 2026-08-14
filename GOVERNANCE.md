# Research Governance

## Purpose

This repository is the program control plane. Its job is to prevent architecture drift, evidence inflation, benchmark leakage, unsafe integration, and misleading progress reporting across independent research tracks.

## Branch policy

- `main` contains stable program definitions, accepted status snapshots and governance.
- Experimental program changes should use `research/*` or `integration/*` branches.
- Scientific protocol changes should be reviewed in Draft PRs before protected evaluation.
- Do not force-push evidence-bearing branches after a frozen evaluation has begun.

## Source-repository independence

RT-01 and RT-02 retain independent repositories and commit histories.

The umbrella repository may:
- link to their evidence;
- summarize their authoritative status;
- define integration contracts;
- import immutable artifacts with explicit provenance if needed.

It must not:
- rewrite their history;
- reinterpret blocked gates as passed;
- broaden narrow claims;
- regenerate their frozen benchmark under a new identity to erase integrity history.

## Research change classes

### Class A — editorial

Examples: typo, formatting, clarification with no scientific meaning change.

May merge normally after basic review.

### Class B — architecture/control

Examples: interface schema, risk class, maturity model, integration dependency.

Requires:
- rationale;
- compatibility impact;
- affected tracks;
- migration plan if an accepted contract changes.

### Class C — scientific protocol

Examples: benchmark, metric, threshold, candidate-selection rule, baseline set, protected split.

Requires before evaluation:
- preregistration/freeze;
- immutable identity/hash where practical;
- explicit stop conditions;
- no result-dependent editing.

### Class D — high-risk capability

Examples: financial action, security-sensitive account change, identity-sensitive action, physical device actuation.

Requires separate safety/authorization review and may not be enabled merely because the model/tool supports it.

## Evidence rules

1. Preserve failed and negative results.
2. Preserve integrity deviations.
3. Record exact source/model/config where a claim depends on them.
4. Distinguish development, validation, protected, sealed-final and external evaluation surfaces.
5. Never use test-set observations to tune a candidate unless the protocol explicitly reclassifies the surface and invalidates the prior claim.
6. No benchmark may be weakened after observing candidate failure and still retain the original benchmark identity.
7. A successful workflow is engineering evidence, not automatically scientific evidence.
8. A README claim is not evidence.
9. A demo is not an acceptance test.
10. Independent reproduction is required for strong general claims.

## Progress reporting

Program status uses capability maturity states, not a global percent.

Every progress update should answer:

- What changed?
- What durable artifact/commit proves it?
- What test/evaluation was run?
- What claim became stronger, weaker, or unchanged?
- What blocker remains?
- Did any benchmark/protocol/model/source identity change?
- Was any negative result preserved?
- What is the highest-value next evidence action?

## Safety and authorization model

Conceptual action classes:

- `R0 OBSERVE` — read-only, low sensitivity.
- `R1 SUGGEST` — no external side effect.
- `R2 REVERSIBLE_ACT` — bounded, reversible side effect.
- `R3 SENSITIVE_ACT` — identity/privacy/financial/security significance.
- `R4 PHYSICAL_HIGH_CONSEQUENCE` — safety-critical physical impact.

Default program posture:
- R0/R1 may be autonomous subject to privacy policy.
- R2 requires explicit policy and verification.
- R3 requires strong user authorization and confirmation unless separately validated for a narrow bounded domain.
- R4 autonomous execution is out of scope for MVJ.

## Privacy principles

- Data minimization over ambient hoarding.
- Separate raw observations from durable state.
- Sensitive inferred attributes require stricter write policy.
- User correction/deletion must have a defined propagation strategy.
- Credentials/secrets must not enter benchmark artifacts or Git history.
- Cross-device sync must support device-local/private fields.

## Definition of done

A track is not done because code exists. A gate is done only when its acceptance conditions and evidence artifacts are satisfied and the claim registry is updated accordingly.
