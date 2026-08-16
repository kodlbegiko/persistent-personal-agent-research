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
// terminal/frozen/admissible events that have independently traceable repository evidence.
verifiedSnapshot.verifiedAt = '2026-08-16T10:05:57+08:00';

const phase1 = verifiedSnapshot.advancementTimeline?.phases?.find((phase) => phase.id === 'phase-1');
const phase2 = verifiedSnapshot.advancementTimeline?.phases?.find((phase) => phase.id === 'phase-2');

const appendOnce = (phase, node) => {
  if (!phase || phase.nodes.some((existing) => existing.id === node.id)) return;
  phase.nodes.push(node);
};

const pushUnique = (items, value) => {
  if (Array.isArray(items) && !items.includes(value)) items.push(value);
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

appendOnce(phase1, {
  id: 'pda-candidate-v5-integrity-invalid',
  track: 'RT-02',
  title: 'Candidate-v5 Integrity Terminal — INVALID',
  description: 'Historical protected individual rows were exposed by unintended connector overfetch before development; no Candidate-v5 corpus, candidate freeze, protected seed, dataset, or scoring was produced.',
  status: 'blocked',
  terminalAt: '2026-08-15T22:18:41+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PDA Candidate-v5 integrity terminal 0af794aa',
  evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/0af794aab29ff180bba3f3ec71aa3f25e2ef0ae9',
  dependsOn: ['Candidate-v4 lineage terminated', 'historical protected quarantine'],
  requiredForMvj: true,
  note: 'FRESH CONFIRMATORY INVALID — EVALUATION INTEGRITY FAILURE · current Candidate-v5 execution lineage preserved as invalidated evidence',
});

appendOnce(phase1, {
  id: 'pda-candidate-v6-development-fail',
  track: 'RT-02',
  title: 'Candidate-v6 Development — FAIL',
  description: 'Validation macro-F1 0.9972, but mandatory safety gates failed: DEV-OOD forbidden ACT=1 and counterfactual forbidden ACT=4. Protected evaluation was never created or run.',
  status: 'failed',
  terminalAt: '2026-08-15T22:39:32+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PDA Candidate-v6 terminal f7bb15ab',
  evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/f7bb15abacdc056820b81f6b2df715953b981788',
  dependsOn: ['Fresh clean execution context', 'Candidate-v5 invalid lineage preserved'],
  requiredForMvj: true,
  note: 'CANDIDATE_V6 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · freeze-manifest chronology deviation preserved · no protected progression authorized',
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

const pdaTrack = verifiedSnapshot.tracks?.find((track) => track.id === 'RT-02');
if (pdaTrack) {
  pdaTrack.status = 'RECOVERY_LINEAGES_FAILED_OR_INVALID';
  pdaTrack.detail = 'Gate B–E retain bounded evidence; Gate F protected/OOD failed. Candidate-v3 and Candidate-v4 fresh confirmatory lineages failed, Candidate-v5 was invalidated by an integrity overfetch before development, and Candidate-v6 failed mandatory development safety gates before any protected evaluation.';
}

const rt03Track = verifiedSnapshot.tracks?.find((track) => track.id === 'RT-03');
if (rt03Track) {
  rt03Track.status = 'PAAV_NOT_ESTABLISHED_PARE_RECOVERY_ADMITTED';
  rt03Track.detail = 'Independent PAAV Action Verification remains not scientifically established. PARE v0.3 benchmark-specific recovery/state-repair evidence is admitted at umbrella level but does not satisfy RT-03 verification.';
}

const pdaBlocker = verifiedSnapshot.blockers?.find((blocker) => blocker.title === 'PDA protected/OOD recovery');
if (pdaBlocker) {
  pdaBlocker.source = 'RT-02 Gate F / Candidate-v3–v6 lineages';
  pdaBlocker.text = 'Gate F、Candidate-v3 與 Candidate-v4 protected/fresh confirmatory 皆 terminal FAIL；Candidate-v5 因 protected overfetch 在 development 前失效；Candidate-v6 又因 DEV-OOD forbidden ACT=1、counterfactual forbidden ACT=4 在 development safety gate 終止。下一候選必須是全新 lineage，且不得救援、調參或重跑既有失敗 lineage 作 qualification。';
}

pushUnique(
  verifiedSnapshot.claims?.supported,
  'PDA Candidate-v5 execution lineage 因歷史 protected individual evidence 的 unintended connector overfetch，在 development 前 fail-closed 並永久保留為 invalidated integrity evidence。',
);
pushUnique(
  verifiedSnapshot.claims?.supported,
  'PDA Candidate-v6 在 development-safe synthetic validation 表現高，但因 DEV-OOD forbidden ACT=1 與 counterfactual forbidden ACT=4 未通過 mandatory safety gates，未取得 fresh protected evaluation 資格。',
);
pushUnique(
  verifiedSnapshot.claims?.supported,
  'PARE v0.3 的 benchmark-specific protected recovery evidence 已被 umbrella 採納；此採納不等於 RT-03 PAAV Action Verification 完成。',
);
pushUnique(
  verifiedSnapshot.claims?.notSupported,
  'Candidate-v5 or Candidate-v6 establishes fresh protected generalization, Gate G authorization, closed-loop readiness, or production safety.',
);

if (verifiedSnapshot.benchmarks?.pda) {
  verifiedSnapshot.benchmarks.pda.claim = 'Specification consistency and bounded Gate-E evidence remain supported. Gate-F protected/OOD generalization failed; later Candidate-v3/v4 confirmatory lineages failed, Candidate-v5 was integrity-invalid before development, and Candidate-v6 failed mandatory development safety gates before protected evaluation.';
}

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
    statusText: { zh: 'Recovery lineages 持續失敗／失效', en: 'RECOVERY LINEAGES FAILED / INVALID' },
    summary: {
      zh: 'Gate B–E 保留 bounded evidence；Gate F、Candidate-v3、Candidate-v4 都留下 terminal FAIL。Candidate-v5 因 integrity overfetch 在 development 前失效；Candidate-v6 又因 mandatory forbidden-ACT safety gates 在 development 階段終止，未進入 protected evaluation。',
      en: 'Gates B–E retain bounded evidence. Gate F and Candidate-v3/v4 ended in terminal FAIL. Candidate-v5 was invalidated by an integrity overfetch before development, and Candidate-v6 failed mandatory forbidden-ACT safety gates during development before any protected evaluation.',
    },
    current: {
      zh: 'Candidate-v6 terminated；下一個合法方向只能是全新的 Candidate-v7 lineage',
      en: 'Candidate-v6 terminated; the next legal direction is a fresh Candidate-v7 lineage',
      url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/20',
    },
    next: {
      zh: '若繼續，必須從全新 development lineage 開始；不得救援 Candidate-v5/v6，也不得以既有 protected 或 holdout 結果回頭調參後重新 qualification。',
      en: 'If research continues, start a fresh development lineage. Do not rescue Candidate-v5/v6 or tune on existing protected/holdout results and then reuse them for qualification.',
    },
    counts: { achieved: 4, failed: 5 },
    latestAt: '2026-08-15T22:39:32+08:00',
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
      {
        status: 'blocked',
        zh: 'Candidate-v5 — FRESH CONFIRMATORY INVALID / integrity failure',
        en: 'Candidate-v5 — FRESH CONFIRMATORY INVALID / integrity failure',
        at: '2026-08-15T22:18:41+08:00',
        precision: 'time',
        url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/0af794aab29ff180bba3f3ec71aa3f25e2ef0ae9',
      },
      {
        status: 'failed',
        zh: 'Candidate-v6 — DEVELOPMENT FAIL / NO CANDIDATE QUALIFIED',
        en: 'Candidate-v6 — DEVELOPMENT FAIL / NO CANDIDATE QUALIFIED',
        at: '2026-08-15T22:39:32+08:00',
        precision: 'time',
        url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/f7bb15abacdc056820b81f6b2df715953b981788',
      },
    ],
  },
  {
    id: 'pare-lineage',
    code: 'RECOVERY · PARE',
    accent: 'violet',
    title: { zh: 'Personal Agent Recovery Engine', en: 'Personal Agent Recovery Engine' },
    status: 'evidence',
    statusText: { zh: 'Umbrella 已採納 benchmark-specific recovery evidence', en: 'UMBRELLA-ADMITTED BENCHMARK-SPECIFIC RECOVERY EVIDENCE' },
    summary: {
      zh: 'PARE v0.3 的 fresh 72-case protected recovery evidence 已被 umbrella 以 benchmark-specific recovery/state-repair evidence 方式採納；duplicate side-effect 仍為 2.78%，且此結果不能直接升級 RT-03 Action Verification。',
      en: 'PARE v0.3 fresh 72-case protected recovery evidence is admitted by the umbrella as benchmark-specific recovery/state-repair evidence. Duplicate side effects remain 2.78%, and this result cannot promote RT-03 Action Verification.',
    },
    current: {
      zh: 'Evidence admitted；RT-03 / PAAV 仍 NOT YET SCIENTIFICALLY ESTABLISHED',
      en: 'Evidence admitted; RT-03 / PAAV remains NOT YET SCIENTIFICALLY ESTABLISHED',
      url: 'https://github.com/kodlbegiko/persistent-personal-agent-research/commit/269f68d29189b94b0fe1d032983ff6f521f54b63',
    },
    next: {
      zh: '維持 PARE claim boundary；下一個 RT-03 關鍵工作是獨立 PAAV protocol，而不是把 recovery correctness 當成 verification correctness。',
      en: 'Preserve the PARE claim boundary. The next RT-03 critical work is an independent PAAV protocol, not treating recovery correctness as verification correctness.',
    },
    counts: { achieved: 2, failed: 0 },
    latestAt: '2026-08-15T21:49:34+08:00',
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
        status: 'complete',
        zh: 'Umbrella 採納 benchmark-specific PARE recovery evidence',
        en: 'Umbrella admitted benchmark-specific PARE recovery evidence',
        at: '2026-08-15T21:49:34+08:00',
        precision: 'time',
        url: 'https://github.com/kodlbegiko/persistent-personal-agent-research/commit/269f68d29189b94b0fe1d032983ff6f521f54b63',
      },
      {
        status: 'current',
        zh: 'RT-03 PAAV Action Verification — NOT YET SCIENTIFICALLY ESTABLISHED',
        en: 'RT-03 PAAV Action Verification — NOT YET SCIENTIFICALLY ESTABLISHED',
        url: 'https://github.com/kodlbegiko/persistent-personal-agent-research/issues/2',
      },
    ],
  },
];
