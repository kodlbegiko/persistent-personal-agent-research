# Research Tracks

## RT-01 — Personal State Engine

**Question:** What is true now?

**Repository:** https://github.com/kodlbegiko/personal-state-engine-research

Scope:
- state representation;
- evidence/provenance;
- current vs historical memory;
- supersession;
- conflict/dispute handling;
- stale-state detection;
- abstention/no-evidence behavior;
- state-write governance.

Umbrella dependency output:
- versioned `StateSnapshot` contract;
- state confidence/validity semantics;
- provenance references;
- supersession/dispute markers.

## RT-02 — Specification-Grounded Proactivity Decision

**Question:** Should the agent intervene now, and in what mode?

**Repository:** https://github.com/kodlbegiko/Proactivity-Decision-Algorithm

Modes:
- `IGNORE`
- `WAIT`
- `SUGGEST`
- `NOTIFY`
- `ASK`
- `ACT`

Umbrella dependency output:
- versioned `InterventionDecision` contract;
- policy version identity;
- matched-rule/prohibition trace;
- authorization requirement.

## RT-03 — Action Verification (PAAV)

**Question:** Did the intended user goal/postcondition actually occur?

**Status:** `NOT YET SCIENTIFICALLY ESTABLISHED`

**Independent research lineage:** `Personal Agent Action Verification (PAAV)`

Initial hypothesis:

> Agents fail partly because they conflate tool/API success with user-goal success. Explicit goal/postcondition-aware verification using legal observable evidence should reduce false completion while preserving uncertainty as `INCONCLUSIVE` when evidence is insufficient.

Required baselines:
- tool/API return only;
- immediate readback;
- fixed postcondition check;
- bounded retry observation;
- multi-evidence verification;
- conservative fail-closed;
- strongest eligible contemporary zero-cost reproducible baseline.

Primary metrics:
- False Completion Rate;
- Goal Verification Accuracy;
- Unsafe Certainty Rate;
- Verified Success Precision;
- INCONCLUSIVE Rate;
- collateral-damage detection;
- verification actions/cost/latency.

Required evidence boundary:
- PAAV must not read or tune on PARE protected labels/cases;
- PARE recovery correctness is not evidence of PAAV verification correctness;
- protected PAAV candidate must be frozen before fresh protected seed generation.

## Independent Recovery / State Repair — PARE

**Repository:** https://github.com/kodlbegiko/personal-agent-recovery-engine

**Current umbrella status:**

`PROTECTED_EVALUATION_COMPLETED — BENCHMARK-SPECIFIC RECOVERY CAPABILITY ESTABLISHED`

PARE sits downstream of verification:

```text
UserGoal
  ↓
ActionAttempt
  ↓
PAAV VerificationRecord
  ↓
PARE RecoveryDecision
  ↓
RecoveryRecord
  ↓
StateSnapshot'
```

PARE protected evidence must not be reinterpreted as completion of RT-03 Action Verification.

## RT-04 — Long-Horizon Planning

**Question:** Can a personal agent maintain coherent goals and dependencies over hours, days and weeks?

Scope:
- task lifecycle;
- subgoals/dependencies;
- explicit waiting;
- deadlines;
- resumability;
- replanning triggers;
- changed-state invalidation;
- partial completion;
- abandonment.

## RT-05 — Multimodal Context

**Question:** How can perception become useful evidence without becoming ungoverned durable truth?

## RT-06 — Cross-Device Continuity

**Question:** Can one personal agent preserve coherent state/control semantics across multiple endpoints?

## RT-07 — Physical-World Agency

**Question:** Under what conditions can the architecture safely extend from digital tools to physical devices?

This track is deliberately downstream.

## Cross-track integration questions

1. How does uncertain or disputed state constrain PDA action mode?
2. Can PDA produce `ACT` when verification support is unavailable?
3. What state transitions occur after PAAV `INCONCLUSIVE`?
4. When does PARE recover versus preserve uncertainty?
5. How does a new event invalidate a waiting plan?
6. Which multimodal observations are ephemeral vs eligible for durable state?
7. Which fields may sync across devices, and which must remain local?
8. How are policy/model/schema versions attached to every end-to-end trace?

## Priority order

```text
RT-01 + RT-02
      |
      v
Integration Contracts
      |
      v
RT-03 PAAV Action Verification
      |
      v
PARE Recovery / State Repair
      |
      v
Closed-loop Integration Benchmark
      |
      v
RT-04
      |
   +--+--+
   v     v
 RT-05 RT-06
   +--+--+
      v
     MVJ
      |
      v
    RT-07
```
