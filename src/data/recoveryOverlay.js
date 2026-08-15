import { verifiedSnapshot } from './researchState.js';

const recoveryRepo = {
  key: 'pare',
  owner: 'kodlbegiko',
  repo: 'personal-agent-recovery-engine',
  label: 'RT-03 Recovery Engine',
  accent: 'violet',
};

if (!verifiedSnapshot.repositories.some((repo) => repo.key === recoveryRepo.key)) {
  verifiedSnapshot.repositories.push(recoveryRepo);
}

// Evidence-watch overlay: preserve the base snapshot structure while adding only
// terminal/frozen events that have independently traceable repository evidence.
verifiedSnapshot.verifiedAt = '2026-08-15T22:09:00+08:00';

const phase1 = verifiedSnapshot.advancementTimeline?.phases?.find((phase) => phase.id === 'phase-1');
const phase2 = verifiedSnapshot.advancementTimeline?.phases?.find((phase) => phase.id === 'phase-2');

const appendOnce = (phase, node) => {
  if (!phase || phase.nodes.some((existing) => existing.id === node.id)) return;
  phase.nodes.push(node);
};

appendOnce(phase1, {
  id: 'pda-candidate-v3-confirmatory-fail',
  track: 'RT-02',
  title: 'Candidate-v3 Fresh Confirmatory — FAIL',
  description: '600 protected · macro-F1 0.0476 · WAIT=600/600 · counterfactual exact-pair 0/120',
  status: 'failed',
  terminalAt: '2026-08-15T20:21:35+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PDA Candidate-v3 terminal 2a9e2f08',
  evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/2a9e2f0841ef145a5b27ddd2ed8a866dba7ec4f4',
  dependsOn: ['Candidate-v3 frozen', 'historical Gate F FAIL preserved'],
  requiredForMvj: true,
  note: 'FRESH CONFIRMATORY FAIL — CANDIDATE_V3_LINEAGE_TERMINATED',
});

appendOnce(phase1, {
  id: 'pda-candidate-v4-confirmatory-fail',
  track: 'RT-02',
  title: 'Candidate-v4 Fresh Confirmatory — FAIL',
  description: '600 protected · macro-F1 0.0846 · WAIT=544 / SUGGEST=56 · counterfactual exact-pair 0.0',
  status: 'failed',
  terminalAt: '2026-08-15T21:51:25+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PDA Candidate-v4 terminal 370aac30',
  evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/370aac305c14c4ddc2fa2f782cbb3f0fdde4f630',
  dependsOn: ['Candidate-v4 development freeze ffb79eef', 'Candidate-v3 lineage terminated'],
  requiredForMvj: true,
  note: 'FRESH CONFIRMATORY FAIL — CANDIDATE V4 LINEAGE TERMINATED',
});

appendOnce(phase2, {
  id: 'pare-v03-protected-recovery',
  track: 'RT-03 / RECOVERY',
  title: 'PARE v0.3 Protected Recovery Evidence',
  description: '72 protected · Candidate-v2 86.11% vs B0 61.11% · Δ +25.00 pp · bootstrap 95% CI [+15.28, +34.72]',
  status: 'complete',
  achievedAt: '2026-08-15T20:41:38+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PARE v0.3 terminal cfa1a4b2',
  evidenceUrl: 'https://github.com/kodlbegiko/personal-agent-recovery-engine/commit/cfa1a4b2a71b6128cf8abe1cfab8c515c5246862',
  dependsOn: ['Independent PARE lineage'],
  requiredForMvj: false,
  note: 'BENCHMARK-SPECIFIC ONLY · duplicate side-effect 2.78% · PAAV / RT-03 Action Verification NOT ESTABLISHED',
});
