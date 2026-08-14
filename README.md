# Persistent Personal Agent Research

> Research toward a persistent, stateful, proactive, multimodal, tool-using, self-verifying personal AI agent.

**Codename:** JARVIS (informal project codename only)

## Mission

This repository is the umbrella research-control layer for a long-term effort to build a personal AI agent that can:

1. know what is currently true about the user and environment;
2. preserve provenance and distinguish current state from stale history;
3. decide whether, when, and how to intervene;
4. plan and execute actions through tools and devices;
5. verify that actions actually succeeded;
6. update state from verified outcomes;
7. operate across devices while respecting permissions, privacy, reversibility, and human authorization.

The target is not a single super-model. The working hypothesis is that a reliable personal agent requires an operating architecture combining models, persistent state, event handling, policy-grounded proactivity, planning, action, verification, permissions, and interfaces.

## Core control loop

```text
Perception / Events
        |
        v
Personal + World State
        |
        v
Proactivity Decision
        |
        v
Planner / Agent
        |
        v
Tools / Devices
        |
        v
Verification
        |
        v
State Transition
        +------------------> back to State
```

## Research tracks

| Track | Question | Current status |
|---|---|---|
| RT-01 Personal State | What is true now? | ACTIVE — external research repo |
| RT-02 Proactivity Decision | Should the agent intervene now? | ACTIVE — external research repo |
| RT-03 Action Verification | Did the requested outcome actually happen? | PLANNED |
| RT-04 Long-Horizon Planning | Can work survive hours/days/weeks and changing conditions? | PLANNED |
| RT-05 Multimodal Context | Can voice, vision, screen and events form trustworthy world context? | PLANNED |
| RT-06 Cross-Device Continuity | Can one coherent agent persist across devices? | PLANNED |
| RT-07 Physical-World Agency | Can the architecture safely extend to wearables/robots/devices? | DEFERRED |

Existing research repos remain independent evidence lineages:

- [`kodlbegiko/personal-state-engine-research`](https://github.com/kodlbegiko/personal-state-engine-research) — RT-01
- [`kodlbegiko/Proactivity-Decision-Algorithm`](https://github.com/kodlbegiko/Proactivity-Decision-Algorithm) — RT-02

They are **not** merged into this repository because frozen benchmarks, commits, protocols, negative results, and integrity history must remain independently auditable.

## Capability ladder

This project tracks capability maturity rather than inventing a single misleading completion percentage.

- **L0 — Conversational Agent:** reasoning, dialogue, tool calls.
- **L1 — Persistent Assistant:** durable state, provenance, supersession, conflict handling.
- **L2 — Proactive Assistant:** event-driven intervention with explicit policy and permission boundaries.
- **L3 — Reliable Agent:** multi-step action, verification, recovery, rollback, long-horizon execution.
- **L4 — Ambient Personal Agent:** multimodal context and cross-device continuity.
- **L5 — JARVIS-class Personal Agent:** integrated persistent, proactive, multimodal, self-verifying, permission-aware personal agent with controlled physical-world extensions.

High-risk, irreversible, financial, security-sensitive, or physical actions remain human-authorized unless an independently validated policy explicitly permits otherwise.

## Evidence policy

This repository separates **vision**, **implementation**, and **scientific evidence**.

Claims must be recorded in `evidence/CLAIMS_REGISTRY.md` and classified as one of:

- `SUPPORTED`
- `BENCHMARK-SPECIFIC`
- `PARTIAL`
- `NOT TESTED`
- `NOT SUPPORTED`
- `REJECTED`

No SOTA, parity, superiority, production-readiness, or safety claim may be inferred from demos, README text, synthetic-only success, or an unvalidated internal benchmark.

## Repository map

- `MISSION.md` — objective, boundaries, success definition
- `ARCHITECTURE.md` — target system architecture and interfaces
- `ROADMAP.md` — staged research program and dependency order
- `ACCEPTANCE_CRITERIA.md` — measurable gates for capability maturity
- `RESEARCH_TRACKS.md` — track-level questions, dependencies, deliverables
- `STATUS.md` — current evidence-backed program status
- `GOVERNANCE.md` — research integrity, change control, safety rules
- `evidence/CLAIMS_REGISTRY.md` — auditable claim ledger
- `docs/FRONTIER_TRACKING.md` — how external frontier progress is monitored

## Current program posture

The umbrella program is in **FOUNDATION / ARCHITECTURE** stage. RT-01 and RT-02 already have independent active research repositories; the remaining tracks are not considered implemented merely because relevant frontier technologies exist.

See `STATUS.md` for the current evidence-backed state.
