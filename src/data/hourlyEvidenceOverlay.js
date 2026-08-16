import { verifiedSnapshot } from './researchState.js';

// Hourly independent evidence audit overlay.
// This file may only add terminal/frozen/admissible evidence; it must never
// mutate source evidence in the child research repositories.
verifiedSnapshot.verifiedAt = '2026-08-16T11:09:26+08:00';

const phase1 = verifiedSnapshot.advancementTimeline?.phases?.find((phase) => phase.id === 'phase-1');
const appendOnce = (phase, node) => {
  if (!phase || phase.nodes.some((existing) => existing.id === node.id)) return;
  phase.nodes.push(node);
};
const pushUnique = (items, value) => {
  if (Array.isArray(items) && !items.includes(value)) items.push(value);
};

appendOnce(phase1, {
  id: 'pda-candidate-v7-development-fail',
  track: 'RT-02',
  title: 'Candidate-v7 Development — FAIL',
  description: 'Frozen V7-B passed preregistered validation at macro-F1 1.0 with ACT recall 1.0 and forbidden ACT=0, but multiple post-freeze development holdouts failed. DEV-OOD ACT recall fell to 0.07; counterfactual exact-pair was 0.10; protected evaluation was NOT EXECUTED.',
  status: 'failed',
  terminalAt: '2026-08-16T10:25:58+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PDA Candidate-v7 terminal 83e41d91',
  evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/83e41d91d264dd7074ea31d61571f14eaa6b09e3',
  dependsOn: ['Candidate-v7 freeze 545af659', 'Candidate-v6 terminal lineage preserved'],
  requiredForMvj: true,
  note: 'CANDIDATE_V7 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · candidate frozen before first holdout · no protected evaluation',
});

appendOnce(phase1, {
  id: 'pda-candidate-v8-development-fail',
  track: 'RT-02',
  title: 'Candidate-v8 Development — FAIL',
  description: 'Frozen V8-C qualified on validation (macro-F1 0.9917; ACT recall/precision 1.0/1.0; forbidden/false ACT=0/0), then the first formal H1 DEV-OOD holdout terminated on an invalid structured state emitted by the frozen parser. No repair, rerun, or protected evaluation was authorized.',
  status: 'failed',
  terminalAt: '2026-08-16T10:58:17+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PDA Candidate-v8 terminal 887903e8',
  evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/887903e840b5f65990a90f39d3c6675863b1fa77',
  dependsOn: ['Candidate-v8 freeze d4077860', 'Candidate-v7 immutable terminal lineage'],
  requiredForMvj: true,
  note: 'CANDIDATE_V8 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · FROZEN_CANDIDATE_SEMANTIC_FAILURE_NOT_INFRASTRUCTURE_ONLY · protected_executed=false',
});

const pdaTrack = verifiedSnapshot.tracks?.find((track) => track.id === 'RT-02');
if (pdaTrack) {
  pdaTrack.status = 'RECOVERY_LINEAGES_FAILED_OR_INVALID';
  pdaTrack.detail = 'Gate B–E retain bounded evidence; Gate F protected/OOD failed. Candidate-v3/v4 fresh confirmatory lineages failed, Candidate-v5 was integrity-invalid before development, Candidate-v6/v7 failed mandatory development qualification, and Candidate-v8 failed on the first formal post-freeze DEV-OOD holdout due to a frozen-candidate semantic parser failure. No later lineage has qualified for protected evaluation.';
}

const pdaBlocker = verifiedSnapshot.blockers?.find((blocker) => blocker.title === 'PDA protected/OOD recovery');
if (pdaBlocker) {
  pdaBlocker.source = 'RT-02 Gate F / Candidate-v3–v8 lineages';
  pdaBlocker.text = 'Gate F、Candidate-v3/v4 protected/fresh confirmatory 皆 terminal FAIL；Candidate-v5 因 protected overfetch 在 development 前 invalid；Candidate-v6/v7 均在 development qualification 終止；Candidate-v8 雖通過 validation，但 frozen parser 在第一個 formal DEV-OOD holdout 產生 invalid structured state，因此依事前規則 fail closed。Candidate-v8 不得修補或重跑；若繼續，只能建立全新的 Candidate-v9 lineage。';
}

pushUnique(
  verifiedSnapshot.claims?.supported,
  'PDA Candidate-v7 的 frozen V7-B 在 validation 為 1.0 macro-F1，但 post-freeze development holdouts 未通過：DEV-OOD ACT recall 0.07、counterfactual exact-pair 0.10；protected evaluation 未執行。',
);
pushUnique(
  verifiedSnapshot.claims?.supported,
  'PDA Candidate-v8 的 V8-C validation macro-F1 0.9917、ACT recall/precision 1.0/1.0、forbidden/false ACT 0/0；但第一個 formal post-freeze DEV-OOD holdout 因 frozen parser 產生 invalid structured state 而 terminal FAIL，protected evaluation 未執行。',
);
pushUnique(
  verifiedSnapshot.claims?.notSupported,
  'Candidate-v7 or Candidate-v8 establishes protected generalization, Gate G authorization, closed-loop readiness, or production safety.',
);

if (verifiedSnapshot.benchmarks?.pda) {
  verifiedSnapshot.benchmarks.pda.claim = 'Specification consistency and bounded Gate-E evidence remain supported. Gate-F protected/OOD generalization failed; Candidate-v3/v4 confirmatory lineages failed, Candidate-v5 was integrity-invalid, Candidate-v6/v7 failed development qualification, and Candidate-v8 terminally failed on its first formal post-freeze DEV-OOD holdout before protected evaluation.';
}

const pdaLine = verifiedSnapshot.researchLines?.find((line) => line.id === 'pda-lineage');
if (pdaLine) {
  pdaLine.status = 'failed';
  pdaLine.statusText = {
    zh: 'Candidate-v3–v8 皆未取得 protected qualification',
    en: 'CANDIDATE-V3–V8 DID NOT QUALIFY FOR PROTECTED EVALUATION',
  };
  pdaLine.summary = {
    zh: 'Gate B–E 保留 bounded evidence；Gate F 與 Candidate-v3/v4 留下 terminal protected/fresh-confirmatory FAIL，Candidate-v5 integrity-invalid，Candidate-v6/v7 development FAIL。Candidate-v8 雖在 validation 取得高分，但 frozen parser 在第一個 formal DEV-OOD holdout 產生 invalid structured state，因此依規則 terminal FAIL，未進 protected evaluation。',
    en: 'Gates B–E retain bounded evidence. Gate F and Candidate-v3/v4 preserve terminal protected/fresh-confirmatory FAILs; Candidate-v5 is integrity-invalid; Candidate-v6/v7 failed development qualification. Candidate-v8 scored highly on validation but terminally failed when its frozen parser emitted an invalid structured state on the first formal DEV-OOD holdout, before protected evaluation.',
  };
  pdaLine.current = {
    zh: 'Candidate-v8 TERMINATED；目前沒有合格 protected candidate',
    en: 'Candidate-v8 TERMINATED; no candidate is qualified for protected evaluation',
    url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/22',
  };
  pdaLine.next = {
    zh: '若繼續，只能建立全新的 Candidate-v9 lineage；不得修補、重跑或以 Candidate-v7/v8 holdout 結果回頭調參後重新 qualification。',
    en: 'If research continues, it must start a fresh Candidate-v9 lineage. Do not repair, rerun, or tune Candidate-v7/v8 using observed holdout outcomes and then reuse them for qualification.',
  };
  pdaLine.counts = { achieved: 4, failed: 7 };
  pdaLine.latestAt = '2026-08-16T10:58:17+08:00';
  pdaLine.latestPrecision = 'time';
  if (!pdaLine.history.some((item) => item.zh?.includes('Candidate-v7'))) {
    pdaLine.history.push({
      status: 'failed',
      zh: 'Candidate-v7 — DEVELOPMENT FAIL / NO CANDIDATE QUALIFIED',
      en: 'Candidate-v7 — DEVELOPMENT FAIL / NO CANDIDATE QUALIFIED',
      at: '2026-08-16T10:25:58+08:00',
      precision: 'time',
      url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/83e41d91d264dd7074ea31d61571f14eaa6b09e3',
    });
  }
  if (!pdaLine.history.some((item) => item.zh?.includes('Candidate-v8'))) {
    pdaLine.history.push({
      status: 'failed',
      zh: 'Candidate-v8 — DEVELOPMENT FAIL / frozen parser semantic failure',
      en: 'Candidate-v8 — DEVELOPMENT FAIL / frozen parser semantic failure',
      at: '2026-08-16T10:58:17+08:00',
      precision: 'time',
      url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/887903e840b5f65990a90f39d3c6675863b1fa77',
    });
  }
}
