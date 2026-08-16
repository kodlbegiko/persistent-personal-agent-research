
# Dashboard v2 Data Model

The browser reads exactly one compiled verified snapshot: `dashboard/state/verified/current.json`. The build/audit compiler reconstructs it deterministically from the frozen migration baseline, admitted terminal events, the lineage registry, and the versioned watch policy. Browser imports never mutate canonical research state.

Snapshot identity includes `schemaVersion`, `snapshotId`, `verifiedAt`, `auditId`, `auditPolicyVersion`, `auditPolicyHash`, `sourceUmbrellaSHA`, `sourceRepositories`, `previousSnapshotId`, and reproducible `contentHash`.

Completed and failed roadmap nodes carry `evidenceRefs` with repository/ref/path/hash metadata where available. Historical URL-only evidence is normalized as a traceable reference without inventing unavailable artifact hashes.
