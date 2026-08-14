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

Exit criterion for integration:
- source repo exposes a frozen/exportable contract whose semantics are backed by protected evidence for the claims being used.

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

Scope:
- explicit intervention specification;
- permission;
- information sufficiency;
- timing;
- need;
- side effect;
- risk;
- reversibility;
- temporal/counterfactual consistency;
- decision trace.

Umbrella dependency output:
- versioned `InterventionDecision` contract;
- policy version identity;
- matched-rule/prohibition trace;
- authorization requirement.

Exit criterion for integration:
- benchmark/oracle validity established for the policy claim being imported;
- no unsupported state may escalate into unsafe autonomous action.

## RT-03 — Action Verification

**Question:** Did the intended outcome actually occur?

Initial hypothesis:

> Agents fail partly because they conflate tool/API success with user-goal success. Explicit postcondition verification should reduce false completion and state corruption.

Required baselines:
- tool/API return only;
- single-observation confirmation;
- candidate multi-evidence verification policy.

Primary metrics:
- false completion rate;
- verified success precision/recall;
- inconclusive rate;
- duplicate/destructive side-effect rate;
- recovery success;
- additional latency/cost.

Dependencies:
- RT-02 risk/authorization classes;
- RT-01 state update semantics.

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

Primary failure classes:
- goal drift;
- stale assumptions;
- forgotten constraints;
- premature completion;
- duplicate action;
- missed dependency;
- failure to resume;
- failure to stop after supersession.

## RT-05 — Multimodal Context

**Question:** How can perception become useful evidence without becoming ungoverned durable truth?

Sources may include:
- text;
- voice;
- screen;
- vision;
- calendar/event streams;
- device state;
- location when explicitly permitted.

Required properties:
- source identity;
- time/freshness;
- confidence/uncertainty;
- privacy class;
- correction/deletion support;
- bounded durable-write rules.

## RT-06 — Cross-Device Continuity

**Question:** Can one personal agent preserve coherent state/control semantics across multiple endpoints?

Scope:
- shared state identity;
- sync/versioning;
- conflict resolution;
- offline operation;
- event deduplication;
- device-local/private fields;
- endpoint-specific permissions;
- auditability.

Initial MVJ target:
- two endpoints/interfaces, not an entire consumer device ecosystem.

## RT-07 — Physical-World Agency

**Question:** Under what conditions can the architecture safely extend from digital tools to physical devices?

This track is deliberately downstream.

Prerequisites:
- validated action verification;
- bounded recovery;
- explicit authorization;
- cross-device identity/control;
- physical risk taxonomy.

Initial permitted research scope:
- reversible, low-energy, low-risk devices in controlled environments.

Out of scope for autonomous MVJ:
- weapons;
- safety-critical vehicles;
- medical actuation;
- hazardous machinery;
- uncontrolled high-consequence robotics.

## Cross-track integration questions

1. How does uncertain or disputed state constrain PDA action mode?
2. Can PDA produce `ACT` when verification support is unavailable?
3. What state transitions occur after `INCONCLUSIVE` verification?
4. How does a new event invalidate a waiting plan?
5. Which multimodal observations are ephemeral vs eligible for durable state?
6. Which fields may sync across devices, and which must remain local?
7. How are policy/model/schema versions attached to every end-to-end trace?

## Priority order

Current priority:

```text
RT-01 + RT-02
      |
      v
Integration Contract v0.1
      |
      v
RT-03 Action Verification
      |
      v
Closed-loop MVP
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
