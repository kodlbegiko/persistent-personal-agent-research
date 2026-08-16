
# Research Registry

`dashboard/state/registry/research-lineages.json` is the only repository watch source for Dashboard v2. It records owner/repo identity, track, role, watch state, admissibility, active refs, supersession, source of truth, and bilingual claim boundary.

Discovery is deliberately fail-closed. `npm run discover:lineages` may identify new repositories, `research/*` branches, `candidate-*` refs, or Draft PRs, but discovery emits `UNREGISTERED_RESEARCH_LINEAGE / PENDING_AUDIT`; it does not auto-admit or advance umbrella maturity.
