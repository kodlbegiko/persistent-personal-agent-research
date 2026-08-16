# Dashboard v2 Baseline

- Captured: 2026-08-16 11:55 Asia/Taipei
- Umbrella `main`: `08ea68eb417216a56398c12c67c3a281f8b9bee4`
- Vercel project: `jarvis-research-dashboard` (`prj_pmEnHIAkJM4XNm9QLM9cwuWDVkAL`)
- Production deployment: `dpl_CzUYLfAKP437jADX3TuPXCvSBjuf` — READY
- Production domain: `jarvis-research-dashboard.vercel.app`
- Last pre-v2 verified overlay timestamp: `2026-08-16T11:09:26+08:00`
- Canonical pre-v2 state path: `src/data/researchState.js` plus `recoveryOverlay.js` and `hourlyEvidenceOverlay.js` browser import side effects.
- Existing Live Pulse: 60-second cross-tab public GitHub event polling plus build fallback; watched repositories were hard-coded in the component.
- Existing CI: build-only dashboard workflow.
- Active umbrella monitoring automation at capture: `JARVIS Research Watch` (`6a7ee962a5cc8191a91b98f966fea361`), enabled hourly as a condition watch. Its pre-v2 prompt contained a hard-coded repository watch set and therefore required post-merge binding to the repository-owned watch-policy version/hash and lineage registry.

## Research scope at freeze

The baseline preserved RT-01 formal fail-closed history, RT-02 Gate-F and Candidate-v3–v8 negative terminal evidence, PARE v0.3 benchmark-specific evidence, all blockers/claims/timeline nodes, and the existing North Star UI. No child research evidence was edited for this migration.

## Newly audited but not baseline-promoted

`personal-state-engine-clean-integrity` Draft PR #1 is `NATURALISTIC_EXTERNAL_VALIDITY_INFRASTRUCTURE_BLOCKED`; EV-B and EV-C were not executed and integrity PASS is not a performance PASS. It enters v2 as WATCHED/PENDING only.

PDA Candidate-v9 Draft PR #23 is a terminal development FAIL. The exact terminal artifact at `gate_recovery_v9/development_terminal.json` records H1 DEV-OOD macro-F1 0.577159, ACT recall 0.236667, fail-fast H2–H13 not executed, and protected evaluation not eligible/not executed.
