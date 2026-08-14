# Frontier Tracking Protocol

## Objective

Keep the program aligned with the strongest relevant public research without confusing external progress with internal validation.

## Domains to monitor

1. agent memory / personal memory / stateful agents;
2. stale-memory, conflict, supersession and memory-write governance;
3. proactive assistants and intervention-timing benchmarks;
4. long-horizon computer-use agents;
5. action verification / outcome verification / agent self-checking;
6. multimodal ambient assistants;
7. cross-device / wearable personal agents;
8. robotics and embodied agents;
9. agent safety, permissions, authorization and privacy;
10. evaluation methodology for persistent agents.

## What counts as a frontier-relevant development

A new work item becomes program-relevant when it changes at least one of:

- strongest baseline for an active research claim;
- benchmark coverage or validity;
- architecture assumptions;
- model/tool capability sufficient to remove a blocker;
- known failure taxonomy;
- safety/permission requirements;
- feasibility of an upcoming track.

Marketing announcements without reproducible technical implications are not automatically research-changing evidence.

## Review record

Each frontier review should record:

```text
Date
Source / paper / benchmark / system
Domain
What changed
Why it matters to this program
Affected RT(s)
Required action: NONE | READ | ADD_BASELINE | ADD_BENCHMARK | REDESIGN | RETEST
Urgency
Evidence quality
```

## Baseline refresh rule

Before beginning a new protected/confirmatory gate:

1. review contemporary strong baselines;
2. document why selected baselines are representative;
3. add newly dominant methods when feasible;
4. if a new baseline cannot be reproduced, record the blocker rather than silently substituting a weaker one;
5. do not change the baseline set after protected candidate results unless the protocol is formally reset.

## Benchmark refresh rule

An internal benchmark should be reconsidered when:

- a stronger public benchmark directly measures the same construct;
- internal cases no longer discriminate strong systems;
- benchmark artifacts leak into model training or candidate tuning in a way that invalidates the intended claim;
- external work exposes a missing failure class.

A benchmark may be extended or replaced, but prior results retain their original identity and scope.

## Competitive position labels

Use:

- `BEHIND_FRONTIER`
- `COMPARABLE_SCOPE_NOT_TESTED`
- `COMPETITIVE_ON_INTERNAL_BENCHMARK`
- `PARITY_SUPPORTED_ON_NAMED_BENCHMARK`
- `SUPERIOR_ON_NAMED_BENCHMARK`
- `BROAD_FRONTIER_CLAIM_NOT_SUPPORTED`

Never shorten a benchmark-specific result into a universal `SOTA` label.

## Current known comparison posture

### RT-01

A-MEM is an executed strong baseline in the source research lineage. Current PSE evidence includes benchmark-specific no-evidence/abstention advantage, but broad frontier superiority remains unsupported. Before any broad claim, contemporary memory-agent baselines and external benchmarks must be refreshed.

### RT-02

Current Protocol-v2 evidence validates bounded specification consistency, not proactive-agent task performance. Contemporary proactive-assistant benchmarks/systems must enter the comparison plan before any SOTA claim.

### Integrated agent

No integrated frontier comparison exists yet. The future closed-loop benchmark should compare against at least:

- a strong model/tool agent without durable state;
- a memory-enabled agent without explicit proactivity policy;
- an agent with tool execution but naive completion semantics;
- the integrated candidate.

This ablation ladder is required to identify whether gains come from state, policy, verification, or simply a stronger model.
