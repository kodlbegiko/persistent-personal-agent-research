# Mission

## North-star objective

Build and scientifically validate a **persistent personal agent architecture** that can maintain trustworthy user/world state, decide when intervention is justified, execute bounded actions, verify outcomes, and update state across time and devices.

The long-term user experience target is comparable in *functional qualities* to fictional always-available assistants such as JARVIS/FRIDAY/Karen/EDITH, while explicitly rejecting fictional unsafe permission models.

## What success means

A successful system is not merely conversational. It must demonstrate all of the following:

1. **Persistence** — important state survives sessions and device boundaries.
2. **State correctness** — current truth is separated from stale, conflicting, superseded, or unsupported history.
3. **Provenance** — important state and actions are traceable to evidence.
4. **Proactivity** — intervention timing and mode are governed by explicit policy rather than unconstrained model preference.
5. **Agency** — the system can use tools to produce real outcomes.
6. **Verification** — tool execution is not equated with task success.
7. **Recovery** — failures can be detected, retried, rolled back, escalated, or safely abandoned.
8. **Long-horizon continuity** — plans survive waiting, new information, dependencies, and state changes.
9. **Multimodal context** — voice, vision, screen, events and device signals can contribute without silently becoming unquestioned truth.
10. **Cross-device continuity** — one coherent state/control architecture can span multiple endpoints.
11. **Safety and permission control** — risk, reversibility, privacy and authorization constrain action.
12. **Scientific auditability** — benchmark, protocol, source, model, configuration and result lineage remain inspectable.

## Working architecture hypothesis

```text
Persistent Personal Agent =
    Foundation Models
  + Personal State
  + World State
  + Event System
  + Proactivity Policy
  + Planning
  + Tool / Device Execution
  + Verification
  + Recovery
  + Permission / Safety Control
  + Cross-Device Interfaces
```

No single component is sufficient.

## Non-goals

This program does **not** currently aim to:

- train a frontier foundation model from scratch;
- compete with frontier labs on raw language-model scale;
- build weapons, offensive surveillance, or autonomous high-risk physical control;
- claim AGI;
- claim universal human-preference alignment from specification compliance;
- replace scientific evidence with demonstrations;
- merge independent research lineages merely for repository convenience.

## Research principles

### Evidence before claims

A capability is not `VALIDATED` because a demo works. Claims require an explicit protocol, baseline, frozen evaluation surface where appropriate, results, limitations and reproducibility evidence.

### Fail closed

When evidence, permission, provenance, state validity, or execution success is uncertain, the system should prefer abstention, clarification, safe waiting or escalation over unsupported autonomous action.

### Models are replaceable

Foundation models are treated as interchangeable intelligence providers wherever practical. The durable research contribution should live in architecture, state, policy, verification, evaluation, integration and safety contracts.

### Human authority scales with risk

High-risk, irreversible, financial, legal, security-sensitive, identity-sensitive, privacy-sensitive or physical actions require stronger authorization and verification than reversible low-risk actions.

## Program-level research questions

1. Can a personal agent maintain an evidence-grounded current-state model over long periods without stale-memory contamination?
2. Can intervention mode and timing be controlled by auditable specifications while retaining useful assistance?
3. Can an agent reliably distinguish action execution from verified task completion?
4. Can the state → decision → action → verification → state loop remain coherent over long horizons?
5. Can multimodal and cross-device context be incorporated without creating uncontrolled surveillance or state corruption?
6. Can the architecture outperform strong component baselines on integrated tasks, not only isolated modules?
7. What minimum capability set is sufficient for a credible Minimum Viable JARVIS (MVJ)?

## Minimum Viable JARVIS (MVJ)

MVJ is the first program target. It intentionally excludes robotics and unrestricted ambient sensing.

MVJ must include:

- persistent personal state;
- state provenance, supersession and abstention;
- event-driven proactivity;
- explicit intervention policy;
- multi-step tool use;
- outcome verification;
- failure recovery/escalation;
- long-horizon task continuity;
- permission-aware action;
- at least two device/interface contexts sharing coherent state;
- reproducible integration evaluation.

Physical-world autonomy, always-on camera ingestion, and high-risk autonomous action are **post-MVJ** research topics.
