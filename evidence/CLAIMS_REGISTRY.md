# Claims Registry

This is the program-level claim ledger. It intentionally does not overwrite source-repository verdicts.

## Claim states

- `SUPPORTED` — supported within the explicitly stated scope.
- `BENCHMARK-SPECIFIC` — supported only on the named benchmark/protocol.
- `PARTIAL` — some evidence exists, but required validation is incomplete.
- `NOT TESTED` — no qualifying evidence.
- `NOT SUPPORTED` — current evidence does not justify the claim.
- `REJECTED` — evidence contradicts the claim under the tested protocol.

## Active claims

| ID | Claim | State | Evidence boundary | Source |
|---|---|---|---|---|
| C-001 | Candidate-v6 can match exact A-MEM on answerable retrieval MRR on frozen adversarial-v7 | `BENCHMARK-SPECIFIC` | 60 answerable cases; MRR 1.0 vs 1.0 | RT-01 Draft PR #2 |
| C-002 | Candidate-v6 reduces no-evidence false retrieval vs exact A-MEM on frozen adversarial-v7 | `BENCHMARK-SPECIFIC` | 0/30 vs 30/30 false retrieval | RT-01 Draft PR #2 |
| C-003 | PSE universally outperforms A-MEM | `NOT SUPPORTED` | No broad external SOTA validation / independent reproduction | RT-01 |
| C-004 | PSE is state of the art in agent memory | `NOT SUPPORTED` | Contemporary cross-benchmark superiority not established | RT-01 |
| C-005 | PDA-SPEC-v2 is deterministic and internally consistent over its bounded audited state space | `SUPPORTED` | Source-repo bounded-state audit; scope must not be broadened | RT-02 |
| C-006 | PDA-SPEC-v2 improves human satisfaction or preference alignment | `NOT TESTED` | Human preference not established by current scientific evidence | RT-02 |
| C-007 | PDA-SPEC-v2 beats contemporary proactive-agent SOTA | `NOT TESTED` | No qualifying broad superiority evidence | RT-02 |
| C-008 | PARE Candidate-v2 establishes benchmark-specific recovery capability on PARE-Bench protocol v0.3 | `BENCHMARK-SPECIFIC` | 72 fresh protected cases; Recovery Success 86.11% vs B0 61.11%; paired delta +25.00 pp; bootstrap 95% CI [+15.28,+34.72]; mandatory safety gates passed; duplicate side effects 2.78% remain | PARE merged PR #1 / protected report |
| C-009 | PARE proves RT-03 Action Verification correctness | `NOT SUPPORTED` | Recovery operates downstream of VerificationRecord; PARE protected cases do not validate goal/postcondition verification | Umbrella / PARE boundary |
| C-010 | RT-03 PAAV Action Verification is scientifically established | `NOT TESTED` | Independent PAAV protected evaluation not yet completed | Umbrella |
| C-011 | The integrated state → proactivity → action → verification → recovery → state loop improves personal-agent reliability | `NOT TESTED` | Closed-loop integration benchmark not yet eligible/completed | Umbrella |
| C-012 | The program has achieved Minimum Viable JARVIS | `NOT SUPPORTED` | RT-03 verification, RT-04 through RT-06, and closed-loop evidence incomplete | Umbrella |
| C-013 | A single completion percentage accurately represents the program | `REJECTED` | Tracks use incomparable gates and maturity dimensions | Umbrella governance |

## Rules for adding claims

Every new claim must include:
1. exact wording narrow enough to falsify;
2. claim state;
3. benchmark/protocol identity;
4. source code/model/config identity where applicable;
5. sample size and evaluation split;
6. baseline identity;
7. uncertainty/statistical evidence where applicable;
8. known limitations;
9. link to durable evidence;
10. date last verified.

## Strong-claim quarantine

The following words require explicit review before being used in public-facing summaries:
- SOTA / state of the art
- superior / best
- parity / equivalent
- solved
- safe
- reliable
- production-ready
- human-aligned
- autonomous

When evidence is narrower, use wording such as:

> On frozen benchmark X under protocol Y, candidate A showed Z relative to baseline B. This does not establish general superiority.

## Historical evidence

Negative results, rejected candidates, blocked gates, integrity deviations and superseded protocols must remain discoverable. New evidence may supersede an interpretation but must not erase the historical record.
