# Target Architecture

## System view

```text
                         External World
                              |
          +-------------------+-------------------+
          |                   |                   |
       Events              Perception          User Input
   mail/calendar/etc.   voice/vision/screen     text/voice
          |                   |                   |
          +-------------------+-------------------+
                              v
                    +-------------------+
                    | Context Ingestion |
                    +---------+---------+
                              |
                              v
          +---------------------------------------+
          |     Personal + World State Layer      |
          | evidence / provenance / freshness     |
          | conflict / supersession / uncertainty |
          +-------------------+-------------------+
                              |
                              v
          +---------------------------------------+
          |     Proactivity / Permission Layer    |
          | IGNORE WAIT SUGGEST NOTIFY ASK ACT    |
          | risk / reversibility / authorization  |
          +-------------------+-------------------+
                              |
                              v
                    +-------------------+
                    | Planner / Runtime |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    | Tools / Devices   |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |   Verification    |
                    +---------+---------+
                              |
              +---------------+---------------+
              |                               |
              v                               v
         Success evidence                 Failure evidence
              |                               |
              v                               v
         State transition               Recovery / Escalate
              |                               |
              +---------------+---------------+
                              |
                              +-----> State Layer
```

## Architectural invariants

### A1 — History is not current state

Raw memory/history may inform state, but no historical record becomes current truth without a state transition rule and provenance.

### A2 — Retrieval is not evidence of truth

Similarity/retrieval confidence cannot substitute for evidence validity, freshness, temporal applicability, or entity correctness.

### A3 — Tool completion is not outcome completion

A successful API/tool return does not automatically prove the user's goal was achieved.

### A4 — Proactivity is policy-constrained

A model may propose an intervention, but final intervention mode must pass the active proactivity/permission policy.

### A5 — High-risk autonomy is fail-closed

Unclear authorization, irreversible effects, security-sensitive operations, financial transactions, or physical-risk actions default to ASK / WAIT / DENY according to policy.

### A6 — State mutation is auditable

Important durable state transitions require source/evidence identity, time, transition type, confidence/validity metadata where applicable, and a reversible or inspectable history.

### A7 — Verification can invalidate prior assumptions

Post-action observations may update or reject the planner's assumed state. The architecture must permit recovery rather than forcing a success narrative.

## Core data objects

### State assertion

Minimum conceptual fields:

```text
assertion_id
subject
predicate
value
valid_from
valid_until (optional)
status: current | superseded | disputed | unknown
source_refs[]
confidence / validity metadata
supersedes[]
created_at
updated_at
```

### Intervention decision

```text
decision_id
state_snapshot_ref
event_ref
mode: IGNORE | WAIT | SUGGEST | NOTIFY | ASK | ACT
policy_version
matched_rules[]
prohibitions[]
risk_class
reversibility_class
authorization_requirement
reason_trace
```

### Action attempt

```text
action_id
plan_ref
tool
tool_request
authorization_ref
started_at
finished_at
execution_result
side_effects_observed[]
```

### Verification record

```text
verification_id
action_id
success_criteria[]
observations[]
verdict: VERIFIED_SUCCESS | VERIFIED_FAILURE | INCONCLUSIVE
recovery_required
state_updates[]
```

## Component boundaries

### RT-01 Personal State Engine

Owns state representation, retrieval-to-state distinction, evidence objects, supersession, stale-state handling, conflicts, uncertainty and durable state-write governance.

### RT-02 Proactivity Decision Algorithm

Owns intervention modes, permission/risk/reversibility constraints, temporal consistency, policy traces and decision compliance.

### RT-03 Action Verification

Owns success criteria, postcondition observation, mismatch detection, idempotency awareness, rollback/retry/escalation policy hooks and verified completion.

### RT-04 Long-Horizon Planning

Owns goals, subgoals, dependencies, waiting states, resumability, replanning triggers and task lifecycle.

### RT-05 Multimodal Context

Owns perception/event normalization, source identity, confidence/freshness, privacy boundaries and transformation into candidate state evidence.

### RT-06 Cross-Device Continuity

Owns shared identity/state contracts, synchronization semantics, conflict handling, device-local privacy and offline/online consistency.

### RT-07 Physical-World Agency

Owns later-stage embodied/device actions. It is downstream of validated permission, verification and recovery controls.

## Integration contract

The umbrella program should not depend on implementation-specific internals of RT-01 or RT-02. Integration occurs through versioned schemas/contracts. Each research repo may evolve independently as long as it can export/import the declared contract version.

## Model-provider boundary

Foundation-model calls belong behind adapters. Evaluation must record model identity/version, prompt/configuration and tool/runtime dependencies. Model substitution must not silently change benchmark ground truth or policy definitions.

## Dashboard Research Control Plane v2

Canonical path: registry + watch policy + admitted evidence → deterministic compiler → immutable snapshot/history/diff → read-only React surfaces. The near-live GitHub pulse is a separate transport layer and cannot mutate verified scientific state. Invalid terminal-to-PASS transitions fail validation unless a new lineage or explicit supersession evidence is present.
