import { verifiedSnapshot } from './researchState.js';

// Hourly independent evidence audit overlay.
// This file may only add terminal/frozen/admissible evidence; it must never
// mutate source evidence in the child research repositories.
verifiedSnapshot.verifiedAt = '2026-08-16T12:19:26+08:00';

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

appendOnce(phase1, {
  id: 'pda-candidate-v10-development-fail',
  track: 'RT-02',
  title: 'Candidate-v10 Development — FAIL',
  description: 'Candidate-v10 failed before candidate freeze because none of V10-A/B/C passed every preregistered architecture-qualification gate. All three failed lexical novelty, contradiction detection, and contradiction false-certainty requirements; V10-B also failed supersession and counterfactual directional/ACT-disable checks. H1-H15 and protected evaluation were NOT EXECUTED.',
  status: 'failed',
  terminalAt: '2026-08-16T11:56:25+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PDA Candidate-v10 terminal 0bed7520',
  evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/0bed752075356b94cf823a172ec86382f558fa17',
  dependsOn: ['Candidate-v9 terminal lineage preserved', 'Candidate-v10 preregistration'],
  requiredForMvj: true,
  note: 'CANDIDATE_V10 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · PRE_FREEZE_ARCHITECTURE_QUALIFICATION · no candidate freeze · protected_executed=false',
});

appendOnce(phase1, {
  id: 'pda-v7r-independent-requalification-fail',
  track: 'RT-02',
  title: 'Candidate-v7 Independent Requalification (V7R) — FAIL',
  description: 'Frozen V7A-01 completed 5/5 independently preregistered runs over 1,750 fresh protected examples with research integrity PASS, no candidate mutation, and no protected-example access. Fresh OOD macro-F1 was 0.615642 (worst run 0.585701), ACT recall 0.38, lexical macro-F1 0.082051, scope 0.060109, and counterfactual exact-pair 0.291429. This is a valid scientific qualification failure, not infrastructure invalidity.',
  status: 'failed',
  terminalAt: '2026-08-16T12:05:18+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PDA V7R terminal a247c8b9',
  evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/a247c8b9685a48984d7ca9063ba7576d771edb54',
  dependsOn: ['Frozen V7A-01 immutable candidate', 'Independent V7R preregistration'],
  requiredForMvj: true,
  note: 'V7R REQUALIFICATION FAIL — CANDIDATE_V7_QUALIFICATION_LINEAGE_TERMINATED · fresh_confirmatory=NOT_AUTHORIZED · Gate G NOT_EXECUTED',
});

const pdaTrack = verifiedSnapshot.tracks?.find((track) => track.id === 'RT-02');
if (pdaTrack) {
  pdaTrack.status = 'RECOVERY_AND_REQUALIFICATION_LINEAGES_FAILED';
  pdaTrack.detail = 'Gate B–E retain bounded evidence; Gate F protected/OOD failed. Candidate-v3/v4 confirmatory lineages failed, Candidate-v5 was integrity-invalid, Candidate-v6/v7/v8/v9/v10 did not establish protected qualification, and independent V7R validly failed fresh multi-run requalification. No candidate currently establishes protected/OOD generalization or Gate G authorization.';
}

const pdaBlocker = verifiedSnapshot.blockers?.find((blocker) => blocker.title === 'PDA protected/OOD recovery');
if (pdaBlocker) {
  pdaBlocker.source = 'RT-02 Gate F / Candidate-v3–v10 / V7R';
  pdaBlocker.text = 'Gate F、Candidate-v3/v4 confirmatory 皆 terminal FAIL；Candidate-v5 integrity-invalid；Candidate-v6/v7/v8/v9/v10 均未取得 protected qualification。V7R 對 frozen V7A-01 的 5-run fresh independent requalification 也形成有效 scientific FAIL。任何後續研究都必須是新的合法 lineage，不得修補後重用已觀測的 holdout/protected evidence 作 qualification。';
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
  verifiedSnapshot.claims?.supported,
  'PDA Candidate-v10 在 pre-freeze architecture qualification 即 terminal FAIL；V10-A/B/C 均未通過全部 preregistered semantic-generalization checks，因此沒有 candidate freeze、H1-H15 或 protected evaluation。',
);
pushUnique(
  verifiedSnapshot.claims?.supported,
  'PDA V7R 對 frozen V7A-01 的 5-run fresh independent requalification 為有效 scientific FAIL：fresh OOD macro-F1 0.615642、ACT recall 0.38、forbidden ACT 0，且 research integrity PASS。',
);
pushUnique(
  verifiedSnapshot.claims?.notSupported,
  'Candidate-v7, Candidate-v8, Candidate-v10, or V7R establishes protected/OOD generalization, Gate G authorization, closed-loop readiness, or production safety.',
);

if (verifiedSnapshot.benchmarks?.pda) {
  verifiedSnapshot.benchmarks.pda.claim = 'Specification consistency and bounded Gate-E evidence remain supported. Gate-F protected/OOD generalization failed; Candidate-v3/v4 confirmatory lineages failed, Candidate-v5 was integrity-invalid, Candidate-v6-v10 did not establish protected qualification, and independent V7R validly failed fresh multi-run requalification. Protected/OOD generalization remains unestablished.';
}

const pdaLine = verifiedSnapshot.researchLines?.find((line) => line.id === 'pda-lineage');
if (pdaLine) {
  pdaLine.status = 'failed';
  pdaLine.statusText = {
    zh: 'Candidate-v3–v10 與 V7R 皆未建立 protected generalization',
    en: 'CANDIDATE-V3–V10 AND V7R HAVE NOT ESTABLISHED PROTECTED GENERALIZATION',
  };
  pdaLine.summary = {
    zh: 'Gate B–E 保留 bounded evidence；Gate F 與後續 FAIL / INVALID 永久保留。Candidate-v10 在 candidate freeze 前即 qualification FAIL；V7R 對 frozen V7A-01 的獨立 fresh requalification 也是有效 scientific FAIL。',
    en: 'Gates B–E retain bounded evidence; Gate F and all later FAIL / INVALID outcomes remain preserved. Candidate-v10 failed qualification before candidate freeze, and independent fresh V7R requalification of frozen V7A-01 is also a valid scientific FAIL.',
  };
  pdaLine.current = {
    zh: 'Candidate-v10 terminal FAIL；V7R independent requalification 亦 terminal FAIL；目前沒有合法 protected PASS',
    en: 'Candidate-v10 is terminal FAIL; independent V7R requalification also terminally failed; no admissible protected PASS exists',
    url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/25',
  };
  pdaLine.next = {
    zh: '任何後續 recovery 必須是新的 post-v10 lineage；不得重用 Candidate-v9/v10 holdout 或 V7R fresh protected evidence 救援既有 candidate。',
    en: 'Any continuation must use a fresh post-v10 lineage; Candidate-v9/v10 holdout evidence and V7R fresh protected evidence cannot be reused to rescue an existing candidate.',
  };
  pdaLine.counts = { achieved: 4, failed: 10 };
  pdaLine.latestAt = '2026-08-16T12:05:18+08:00';
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
  if (!pdaLine.history.some((item) => item.zh?.includes('Candidate-v10'))) {
    pdaLine.history.push({
      status: 'failed',
      zh: 'Candidate-v10 — DEVELOPMENT FAIL / pre-freeze architecture qualification',
      en: 'Candidate-v10 — DEVELOPMENT FAIL / pre-freeze architecture qualification',
      at: '2026-08-16T11:56:25+08:00',
      precision: 'time',
      url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/0bed752075356b94cf823a172ec86382f558fa17',
    });
  }
  if (!pdaLine.history.some((item) => item.zh?.includes('V7R'))) {
    pdaLine.history.push({
      status: 'failed',
      zh: 'V7R — INDEPENDENT REQUALIFICATION FAIL / valid scientific failure',
      en: 'V7R — INDEPENDENT REQUALIFICATION FAIL / valid scientific failure',
      at: '2026-08-16T12:05:18+08:00',
      precision: 'time',
      url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/a247c8b9685a48984d7ca9063ba7576d771edb54',
    });
  }
}

// Add the clean-integrity PSE lineage here with exact terminal time so the v2
// compiler does not fall back to date-only precision.
if (!verifiedSnapshot.researchLines?.some((line) => line.id === 'pse-clean-lineage')) {
  verifiedSnapshot.researchLines?.push({
    id: 'pse-clean-lineage',
    code: 'RT-01 · PSE CLEAN',
    accent: 'cyan',
    title: { zh: 'PSE Clean Integrity', en: 'PSE Clean Integrity' },
    status: 'blocked',
    statusText: { zh: 'WATCHED · PENDING ADMISSIBILITY', en: 'WATCHED · PENDING ADMISSIBILITY' },
    summary: {
      zh: 'Candidate-v13 naturalistic external-validity lineage 在 formal execution 前 infrastructure blocked；EV-B / EV-C 未執行。Integrity PASS 只證明停止方式守住研究完整性，不是 external-validity performance PASS 或 FAIL。',
      en: 'Candidate-v13 naturalistic external validity ended infrastructure-blocked before formal execution; EV-B / EV-C were not executed. Integrity PASS validates the closeout discipline, not an external-validity performance PASS or FAIL.',
    },
    current: { zh: 'NATURALISTIC_EXTERNAL_VALIDITY_INFRASTRUCTURE_BLOCKED', en: 'NATURALISTIC_EXTERNAL_VALIDITY_INFRASTRUCTURE_BLOCKED', url: 'https://github.com/kodlbegiko/personal-state-engine-clean-integrity/pull/1' },
    next: { zh: '等待 umbrella admissibility audit；不得在 terminal lineage 內修補 frozen infrastructure 後宣稱 external-validity 結果。', en: 'Await umbrella admissibility audit; do not repair frozen infrastructure inside the terminal lineage and then claim external-validity performance.' },
    counts: { achieved: 0, failed: 0 },
    latestAt: '2026-08-16T11:38:33+08:00',
    latestPrecision: 'time',
    history: [{ status: 'blocked', zh: 'Candidate-v13 external validity — INFRASTRUCTURE BLOCKED / EV-B EV-C NOT EXECUTED', en: 'Candidate-v13 external validity — INFRASTRUCTURE BLOCKED / EV-B EV-C NOT EXECUTED', at: '2026-08-16T11:38:33+08:00', precision: 'time', url: 'https://github.com/kodlbegiko/personal-state-engine-clean-integrity/commit/bad307ac11e549437b4337f0459ccfd55625f826' }],
  });
}

// Each new formal lineage gets an independent research-line surface. Umbrella RT-02 maturity remains unchanged.
if (!verifiedSnapshot.researchLines?.some((line) => line.id === 'pda-candidate-v10-lineage')) {
  verifiedSnapshot.researchLines?.push({
    id: 'pda-candidate-v10-lineage',
    code: 'RT-02 · CANDIDATE-V10',
    accent: 'purple',
    title: { zh: 'Candidate-v10 Semantic Evidence Generalization', en: 'Candidate-v10 Semantic Evidence Generalization' },
    status: 'failed',
    statusText: { zh: 'PRE-FREEZE QUALIFICATION FAIL', en: 'PRE-FREEZE QUALIFICATION FAIL' },
    summary: { zh: 'V10-A/B/C 均未通過全部 preregistered architecture gates，因此沒有 candidate freeze，也沒有執行 H1-H15 或 protected evaluation。', en: 'V10-A/B/C failed one or more preregistered architecture gates, so no candidate freeze was created and H1-H15/protected evaluation were not executed.' },
    current: { zh: 'CANDIDATE_V10 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED', en: 'CANDIDATE_V10 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED', url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/24' },
    next: { zh: '若繼續，只能建立新的 post-v10 lineage；Candidate-v10 不得救援或重跑 qualification。', en: 'If research continues, start a fresh post-v10 lineage; Candidate-v10 must not be rescued or requalified.' },
    counts: { achieved: 0, failed: 1 },
    latestAt: '2026-08-16T11:56:25+08:00',
    latestPrecision: 'time',
    history: [{ status: 'failed', zh: 'Candidate-v10 — pre-freeze architecture qualification FAIL', en: 'Candidate-v10 — pre-freeze architecture qualification FAIL', at: '2026-08-16T11:56:25+08:00', precision: 'time', url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/0bed752075356b94cf823a172ec86382f558fa17' }],
  });
}

if (!verifiedSnapshot.researchLines?.some((line) => line.id === 'pda-v7r-lineage')) {
  verifiedSnapshot.researchLines?.push({
    id: 'pda-v7r-lineage',
    code: 'RT-02 · V7R',
    accent: 'purple',
    title: { zh: 'Candidate-v7 Independent Requalification (V7R)', en: 'Candidate-v7 Independent Requalification (V7R)' },
    status: 'failed',
    statusText: { zh: 'VALID SCIENTIFIC REQUALIFICATION FAIL', en: 'VALID SCIENTIFIC REQUALIFICATION FAIL' },
    summary: { zh: 'Frozen V7A-01 在 5-run、1,750 fresh protected examples 的獨立 requalification 中未達多項 preregistered generalization criteria；research integrity PASS、protected-example access NONE，因此這是有效 scientific FAIL，不是 infrastructure invalidity。', en: 'Frozen V7A-01 failed multiple preregistered generalization criteria in an independent 5-run requalification over 1,750 fresh protected examples. Research integrity passed and protected-example access was NONE, so this is a valid scientific FAIL rather than infrastructure invalidity.' },
    current: { zh: 'V7R REQUALIFICATION FAIL — CANDIDATE_V7_QUALIFICATION_LINEAGE_TERMINATED', en: 'V7R REQUALIFICATION FAIL — CANDIDATE_V7_QUALIFICATION_LINEAGE_TERMINATED', url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/25' },
    next: { zh: 'Fresh Confirmatory 與 Gate G 均未授權；V7R evidence 必須保持 frozen，不得用來回頭調參 V7A-01。', en: 'Fresh Confirmatory and Gate G remain unauthorized; V7R evidence must stay frozen and cannot be used to tune V7A-01.' },
    counts: { achieved: 0, failed: 1 },
    latestAt: '2026-08-16T12:05:18+08:00',
    latestPrecision: 'time',
    history: [{ status: 'failed', zh: 'V7R — independent fresh requalification scientific FAIL', en: 'V7R — independent fresh requalification scientific FAIL', at: '2026-08-16T12:05:18+08:00', precision: 'time', url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/a247c8b9685a48984d7ca9063ba7576d771edb54' }],
  });
}
