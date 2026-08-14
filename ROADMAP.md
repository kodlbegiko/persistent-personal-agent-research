# Research Roadmap

This roadmap is dependency-driven. Calendar dates are secondary to evidence gates.

## Phase 0 — Program foundation

**Goal:** establish a falsifiable mission, architecture, evidence policy and tracking system.

Deliverables:
- mission and non-goals;
- system architecture and invariants;
- capability ladder and acceptance criteria;
- research-track ownership/dependencies;
- claim registry;
- current status ledger;
- frontier-monitoring protocol;
- issue-based execution backlog.

Exit gate:
- every active claim has an evidence state;
- every research track has a question, dependency and exit criterion;
- no single invented percent is used as program truth.

## Phase 1 — State + Proactivity contract

**Goal:** connect RT-01 and RT-02 conceptually without contaminating their independent experimental lineages.

Required work:
1. define a versioned `StateSnapshot` integration schema;
2. define a versioned `InterventionDecision` schema;
3. map PSE evidence/status fields into PDA inputs;
4. define unknown/stale/disputed state handling;
5. define permission/risk/reversibility fields that must not be inferred from weak memory alone;
6. build synthetic contract tests;
7. preserve source-repo provenance for every imported result.

Exit gate:
- deterministic contract validation passes;
- unsupported state cannot silently escalate to `ACT`;
- state supersession propagates into intervention decisions;
- no scientific claim from either source repo is broadened by integration.

## Phase 2 — RT-03 Action Verification

**Goal:** distinguish "tool returned success" from "user goal verified complete".

Research questions:
- What postconditions are necessary for common personal-agent actions?
- How should verification evidence be represented?
- When should a failed verification trigger retry, rollback, ASK, or abandonment?
- Can verification reduce false-completion claims without unacceptable cost/latency?

Minimum benchmark domains:
- email/message send;
- calendar create/update;
- file create/move/update;
- browser form/task;
- state-only/no-action control cases.

Exit gate:
- frozen benchmark;
- naive tool-success baseline;
- verification candidate;
- protected comparison;
- false-completion rate explicitly measured;
- destructive/duplicate side effects measured.

## Phase 3 — Closed-loop MVP

**Goal:** demonstrate the first full loop:

```text
state -> proactivity -> action -> verification -> state transition
```

Requirements:
- at least 3 task domains;
- event-driven triggers;
- WAIT/SUGGEST/NOTIFY/ASK/ACT policy paths;
- post-action verification;
- failure recovery;
- durable state update;
- full trace from input evidence to final state.

Exit gate:
- reproducible integration benchmark;
- no unsupported high-risk autonomous action;
- measurable reduction in stale-state and false-completion failures vs naive agent baseline.

## Phase 4 — RT-04 Long-Horizon Continuity

**Goal:** tasks survive time, waiting, dependencies and changed state.

Evaluation scenarios must include:
- delayed external response;
- changed deadline;
- superseded user preference;
- failed intermediate action;
- new conflicting event;
- restart/resume;
- partial completion across sessions.

Exit gate:
- frozen multi-session benchmark;
- state/plan consistency metrics;
- recovery and abandonment correctness;
- comparison against strong long-horizon agent baseline(s).

## Phase 5 — RT-05 Multimodal Context

**Goal:** ingest voice, screen, visual and event evidence without turning perception into unquestioned durable truth.

Required controls:
- source identity;
- freshness;
- confidence/uncertainty;
- privacy classification;
- user-visible correction/deletion path;
- no automatic durable write for sensitive inferred attributes without policy support.

Exit gate:
- multimodal evidence-to-state benchmark;
- false state-write rate;
- stale context rate;
- correction propagation tests.

## Phase 6 — RT-06 Cross-Device Continuity

**Goal:** maintain one coherent personal-agent state across at least two endpoints.

Required scenarios:
- concurrent edits;
- offline device;
- stale device state;
- privacy-local fields;
- device-specific permissions;
- event duplication;
- clock/order disagreement.

Exit gate:
- deterministic conflict semantics;
- no silent overwrite of higher-confidence/newer authoritative state;
- auditable sync history;
- recovery from partial synchronization failure.

## Phase 7 — Minimum Viable JARVIS (MVJ)

MVJ requires integration of RT-01 through RT-06 at validated or integration-qualified maturity.

Minimum user-level demonstrations must be backed by formal evaluation and include:
- remembering and correctly superseding a long-lived user state;
- detecting a relevant future/event-driven need;
- choosing an appropriate intervention mode;
- obtaining authorization where required;
- executing a multi-step task;
- verifying outcome;
- updating personal state;
- resuming a related task on another interface/device.

MVJ explicitly excludes unrestricted physical autonomy.

## Phase 8 — RT-07 Physical-world extension

Only begins after permission, verification, recovery and cross-device controls are independently validated.

Initial scope should be reversible, low-energy, low-risk device control. Safety-critical robotics, vehicles, weapons, medical actuation or other high-consequence domains are out of scope for autonomous control.

## Parallel frontier tracking

External technology may make a planned research track obsolete, easier, or require stronger baselines. The roadmap is therefore reviewed against frontier systems/benchmarks before each new experimental gate. A frontier result may change implementation priority, but it does not retroactively validate this program.
