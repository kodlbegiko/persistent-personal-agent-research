# Research Roadmap

This roadmap is dependency-driven. Calendar dates are secondary to evidence gates.

## Phase 0 — Program foundation

**Goal:** establish a falsifiable mission, architecture, evidence policy and tracking system.

Status: substantially established at umbrella level; source-repo scientific claims remain independently governed.

## Phase 1 — State + Proactivity contracts

**Goal:** connect RT-01 and RT-02 conceptually without contaminating their independent experimental lineages.

Exit gate:
- deterministic contract validation passes;
- unsupported state cannot silently escalate to `ACT`;
- state supersession propagates into intervention decisions;
- no source-repo scientific claim is broadened by integration.

## Phase 2A — RT-03 PAAV Action Verification

**Goal:** distinguish `tool returned success` from `user goal verified complete`.

**Current status:** `NOT YET SCIENTIFICALLY ESTABLISHED`.

Required work:
1. establish an independent PAAV research lineage;
2. perform a current frontier review before protocol freeze;
3. freeze `UserGoal`, `ActionAttempt`, `EvidenceObservation`, `VerificationSpec`, and `VerificationRecord` contracts;
4. implement deterministic partially observable action simulation with oracle isolation;
5. cover messaging, calendar, files, tasks, browser/form, persistent state, and composite goals;
6. evaluate tool-return, immediate-readback, fixed-check, retry, multi-evidence, fail-closed, and strongest eligible contemporary baselines;
7. select a candidate using a frozen validation-only rule;
8. freeze candidate before fresh protected seed generation;
9. execute fresh protected evaluation;
10. retain negative/inconclusive evidence without threshold rescue.

Exit gate:
- frozen benchmark/protocol/metrics/selection rule;
- fresh protected evaluation;
- False Completion Rate explicitly measured;
- Goal Verification Accuracy and Unsafe Certainty measured;
- collateral damage and partial success measured;
- oracle leakage = 0;
- reproducibility passes.

## Phase 2B — Recovery / State Repair (PARE)

**Repository:** https://github.com/kodlbegiko/personal-agent-recovery-engine

**Status:**

`PROTECTED_EVALUATION_COMPLETED — BENCHMARK-SPECIFIC RECOVERY CAPABILITY ESTABLISHED`

PARE v0.3 has protected benchmark-specific evidence and is no longer `NOT_STARTED`. Its frozen Candidate-v2 and protected evidence remain immutable. This result does not complete Phase 2A Action Verification.

## Phase 3 — Closed-loop integration benchmark

**Eligibility gate:** do not start merely because PARE is complete.

Only eligible when all of the following have usable versioned contracts/evidence:
- RT-01 state contract;
- RT-02 proactivity contract;
- PAAV protected action-verification evidence;
- PARE protected recovery evidence;
- PAAV → PARE integration contract tests.

Target loop:

```text
StateSnapshot
  ↓
InterventionDecision
  ↓
ActionAttempt
  ↓
PAAV VerificationRecord
  ↓
PARE RecoveryDecision / RecoveryRecord
  ↓
StateSnapshot'
```

Exit gate:
- reproducible multi-domain integration benchmark;
- no unsupported high-risk autonomous action;
- no silent completion from `INCONCLUSIVE`;
- measurable false-completion and state-corruption behavior vs naive closed-loop baseline.

## Phase 4 — RT-04 Long-Horizon Continuity

**Goal:** tasks survive time, waiting, dependencies and changed state.

Required scenarios include delayed response, changed deadline, superseded preference, intermediate failure, conflicting event, restart/resume, and partial completion across sessions.

## Phase 5 — RT-05 Multimodal Context

**Goal:** ingest voice, screen, visual and event evidence without turning perception into unquestioned durable truth.

## Phase 6 — RT-06 Cross-Device Continuity

**Goal:** maintain one coherent personal-agent state across at least two endpoints.

## Phase 7 — Minimum Viable JARVIS (MVJ)

MVJ requires integration of RT-01 through RT-06 at validated or integration-qualified maturity. PARE protected evidence alone does not establish MVJ or L3 completion.

## Phase 8 — RT-07 Physical-world extension

Only begins after permission, verification, recovery and cross-device controls are independently validated.

## Parallel frontier tracking

External technology may make a planned research track obsolete, easier, or require stronger baselines. Frontier review occurs before each experimental protocol freeze. External progress may change implementation priority but never retroactively validates this program.
