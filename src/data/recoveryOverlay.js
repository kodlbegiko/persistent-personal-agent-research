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
verifiedSnapshot.verifiedAt = '2026-08-15T22:22:00+08:00';

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

// Research-line progress is intentionally separate from RT maturity. A lineage may
// have strong internal evidence without yet satisfying the umbrella track contract.
verifiedSnapshot.researchLines = [
  {
    id: 'program-integration',
    code: 'PROGRAM',
    accent: 'green',
    title: { zh: '總體整合線', en: 'Umbrella Integration' },
    status: 'current',
    statusText: { zh: '目前關鍵路徑', en: 'CURRENT CRITICAL PATH' },
    summary: {
      zh: '總研究治理與 North Star 已建立；目前真正的整合瓶頸仍是 PSE → PDA Contract v0.1。',
      en: 'Program governance and the North Star are established. The active integration bottleneck remains PSE → PDA Contract v0.1.',
    },
    current: {
      zh: 'Issue #1 — Freeze PSE → PDA Integration Contract v0.1',
      en: 'Issue #1 — Freeze PSE → PDA Integration Contract v0.1',
      url: 'https://github.com/kodlbegiko/persistent-personal-agent-research/issues/1',
    },
    next: {
      zh: '凍結 StateSnapshot、InterventionDecision、ActionAttempt、VerificationRecord 與 fail-closed semantics。',
      en: 'Freeze StateSnapshot, InterventionDecision, ActionAttempt, VerificationRecord, and fail-closed semantics.',
    },
    counts: { achieved: 1, failed: 0 },
    latestAt: '2026-08-14T18:04:32+08:00',
    latestPrecision: 'time',
    history: [
      {
        status: 'complete',
        zh: 'Persistent Personal Agent Research Mission 建立',
        en: 'Persistent Personal Agent Research Mission established',
        at: '2026-08-14T18:04:32+08:00',
        precision: 'time',
        url: 'https://github.com/kodlbegiko/persistent-personal-agent-research/commit/824eb647fa85c7151b72d0b96b09353b76aeb474',
      },
      {
        status: 'current',
        zh: 'Integration Contract v0.1',
        en: 'Integration Contract v0.1',
        url: 'https://github.com/kodlbegiko/persistent-personal-agent-research/issues/1',
      },
    ],
  },
  {
    id: 'pse-lineage',
    code: 'RT-01 · PSE',
    accent: 'blue',
    title: { zh: 'Personal State Engine', en: 'Personal State Engine' },
    status: 'blocked',
    statusText: { zh: '科學完成／形式阻塞', en: 'SCIENTIFIC COMPLETE / FORMAL BLOCKED' },
    summary: {
      zh: 'Candidate-v6 scientific Gate E 已完成；formal Gate E 因完整性條件維持 fail-closed，現有 lineage 的 Gate F 不可採納。',
      en: 'Candidate-v6 scientific Gate E is complete; formal Gate E remains integrity fail-closed, and Gate F is not admissible in the current lineage.',
    },
    current: {
      zh: 'Gate E formal — FAIL CLOSED',
      en: 'Gate E formal — FAIL CLOSED',
      url: 'https://github.com/kodlbegiko/personal-state-engine-research/pull/2',
    },
    next: {
      zh: '建立事前宣告並凍結的 clean-integrity lineage，再進行任何新的 protected/sealed evaluation。',
      en: 'Create a preregistered, frozen clean-integrity lineage before any new protected/sealed evaluation.',
    },
    counts: { achieved: 1, failed: 0 },
    latestAt: '2026-08-13',
    latestPrecision: 'date',
    history: [
      {
        status: 'complete',
        zh: 'Candidate-v6 scientific Gate E 完成',
        en: 'Candidate-v6 scientific Gate E complete',
        at: '2026-08-13',
        precision: 'date',
        url: 'https://github.com/kodlbegiko/personal-state-engine-research/pull/2',
      },
      {
        status: 'blocked',
        zh: 'Formal Gate E — integrity fail-closed',
        en: 'Formal Gate E — integrity fail-closed',
        url: 'https://github.com/kodlbegiko/personal-state-engine-research/pull/2',
      },
      {
        status: 'blocked',
        zh: 'Gate F — PROHIBITED in current lineage',
        en: 'Gate F — PROHIBITED in current lineage',
        url: 'https://github.com/kodlbegiko/personal-state-engine-research/pull/2',
      },
    ],
  },
  {
    id: 'pda-lineage',
    code: 'RT-02 · PDA',
    accent: 'purple',
    title: { zh: 'Proactivity Decision Algorithm', en: 'Proactivity Decision Algorithm' },
    status: 'failed',
    statusText: { zh: 'Protected 泛化仍失敗', en: 'PROTECTED GENERALIZATION FAILED' },
    summary: {
      zh: 'Gate B–E 已建立 bounded evidence；Gate F 以及 Candidate-v3、Candidate-v4 的 fresh confirmatory 都留下 terminal FAIL。',
      en: 'Gates B–E established bounded evidence; Gate F and the Candidate-v3 / Candidate-v4 fresh confirmatory evaluations all ended in terminal FAIL.',
    },
    current: {
      zh: '新的 development / candidate recovery lineage',
      en: 'New development / candidate recovery lineage',
      url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm',
    },
    next: {
      zh: '只能在新的 development distribution 上建立候選者；候選者 freeze 後才能產生新的 protected confirmatory set。',
      en: 'Develop the next candidate only on a fresh development distribution; create a new protected confirmatory set only after the candidate is frozen.',
    },
    counts: { achieved: 4, failed: 3 },
    latestAt: '2026-08-15T21:51:25+08:00',
    latestPrecision: 'time',
    history: [
      {
        status: 'complete',
        zh: 'Gate E — bounded validation PASS',
        en: 'Gate E — bounded validation PASS',
        at: '2026-08-15T18:37:58+08:00',
        precision: 'time',
        url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/12',
      },
      {
        status: 'failed',
        zh: 'Gate F — protected/OOD FAIL',
        en: 'Gate F — protected/OOD FAIL',
        at: '2026-08-15T19:10:09+08:00',
        precision: 'time',
        url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/14',
      },
      {
        status: 'failed',
        zh: 'Candidate-v3 fresh confirmatory FAIL',
        en: 'Candidate-v3 fresh confirmatory FAIL',
        at: '2026-08-15T20:21:35+08:00',
        precision: 'time',
        url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/2a9e2f0841ef145a5b27ddd2ed8a866dba7ec4f4',
      },
      {
        status: 'failed',
        zh: 'Candidate-v4 fresh confirmatory FAIL',
        en: 'Candidate-v4 fresh confirmatory FAIL',
        at: '2026-08-15T21:51:25+08:00',
        precision: 'time',
        url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/370aac305c14c4ddc2fa2f782cbb3f0fdde4f630',
      },
    ],
  },
  {
    id: 'pare-lineage',
    code: 'RT-03 · PARE',
    accent: 'violet',
    title: { zh: 'Personal Agent Recovery Engine', en: 'Personal Agent Recovery Engine' },
    status: 'evidence',
    statusText: { zh: 'Protected evidence／待 Umbrella 採納審核', en: 'PROTECTED EVIDENCE / UMBRELLA AUDIT PENDING' },
    summary: {
      zh: 'PARE v0.3 已取得 fresh 72-case protected recovery evidence；這是獨立 recovery lineage 的結果，尚不能直接把 RT-03 Action Verification 標成完成。',
      en: 'PARE v0.3 has fresh 72-case protected recovery evidence. This belongs to an independent recovery lineage and does not yet complete umbrella RT-03 Action Verification.',
    },
    current: {
      zh: 'Umbrella admissibility audit + Issue #2 mapping',
      en: 'Umbrella admissibility audit + Issue #2 mapping',
      url: 'https://github.com/kodlbegiko/personal-agent-recovery-engine/pull/1',
    },
    next: {
      zh: '交叉核對 Candidate-v2 freeze、protected seed 時序、raw results、invalidated v0.2、safety metrics、CI，再決定哪些 evidence 可正式推進 RT-03。',
      en: 'Cross-check the Candidate-v2 freeze, protected-seed timing, raw results, invalidated v0.2 history, safety metrics, and CI before promoting any RT-03 maturity.',
    },
    counts: { achieved: 1, failed: 0 },
    latestAt: '2026-08-15T20:41:38+08:00',
    latestPrecision: 'time',
    history: [
      {
        status: 'complete',
        zh: 'PARE v0.3 protected recovery evidence',
        en: 'PARE v0.3 protected recovery evidence',
        at: '2026-08-15T20:41:38+08:00',
        precision: 'time',
        url: 'https://github.com/kodlbegiko/personal-agent-recovery-engine/commit/cfa1a4b2a71b6128cf8abe1cfab8c515c5246862',
      },
      {
        status: 'current',
        zh: 'READY_FOR_UMBRELLA_INTEGRATION claim 正在做 admissibility audit',
        en: 'READY_FOR_UMBRELLA_INTEGRATION claim is under admissibility audit',
        url: 'https://github.com/kodlbegiko/personal-agent-recovery-engine/pull/1',
      },
    ],
  },
];
