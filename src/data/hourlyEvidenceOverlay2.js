import { verifiedSnapshot } from './researchState.js';

// Independent hourly audit overlay for evidence verified after the 11:09 snapshot.
// Child-repository frozen evidence remains read-only. This overlay records only
// terminal/frozen evidence and explicitly separates lineage evidence from umbrella maturity.
verifiedSnapshot.verifiedAt = '2026-08-16T12:19:26+08:00';

const phase1 = verifiedSnapshot.advancementTimeline?.phases?.find((phase) => phase.id === 'phase-1');
const appendOnce = (phase, node) => {
  if (!phase || phase.nodes.some((existing) => existing.id === node.id)) return;
  phase.nodes.push(node);
};
const pushUnique = (items, value) => {
  if (Array.isArray(items) && !items.includes(value)) items.push(value);
};

const cleanPseRepo = {
  key: 'pse-clean-integrity',
  owner: 'kodlbegiko',
  repo: 'personal-state-engine-clean-integrity',
  label: 'RT-01 Clean Integrity Lineage',
  accent: 'blue',
};
if (!verifiedSnapshot.repositories?.some((repo) => repo.key === cleanPseRepo.key)) {
  verifiedSnapshot.repositories?.push(cleanPseRepo);
}

appendOnce(phase1, {
  id: 'pda-candidate-v9-development-fail',
  track: 'RT-02',
  title: 'Candidate-v9 Development — FAIL',
  description: 'Frozen V9-B preserved normative-valid states and ACT precision 1.0, but the first formal post-freeze H1 DEV-OOD holdout failed preregistered generalization thresholds: macro-F1 0.577159 and ACT recall 0.236667. H2-H13 and protected evaluation were NOT EXECUTED.',
  status: 'failed',
  terminalAt: '2026-08-16T11:34:36+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PDA Candidate-v9 terminal 8b814969',
  evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/8b8149698d7b04147b620c063887cebd901e2252',
  dependsOn: ['Candidate-v9 freeze e0445c93', 'Candidate-v8 terminal lineage preserved'],
  requiredForMvj: true,
  note: 'CANDIDATE_V9 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · protected_eligible=false · protected_executed=false',
});

appendOnce(phase1, {
  id: 'pse-candidate-v13-external-validity-infrastructure-blocked',
  track: 'RT-01 / CLEAN-INTEGRITY',
  title: 'Candidate-v13 Naturalistic External Validity — INFRASTRUCTURE BLOCKED',
  description: 'The clean-integrity Candidate-v13 lineage stopped before any formal external Candidate-v13 invocation. EV-B=0 and EV-C=0 remain unconsumed. Two pre-formal capacity audits found D6=212/468 and D7=243/468; continuing would require frozen parser/adapter/source-contract changes. Integrity PASS is not an external-validity performance PASS.',
  status: 'blocked',
  terminalAt: '2026-08-16T11:38:33+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PSE clean-integrity Candidate-v13 terminal bad307ac',
  evidenceUrl: 'https://github.com/kodlbegiko/personal-state-engine-clean-integrity/commit/bad307ac11e549437b4337f0459ccfd55625f826',
  dependsOn: ['Candidate-v13 external preregistration lock 7c429cdf', 'Clean-integrity lineage'],
  requiredForMvj: false,
  note: 'NATURALISTIC_EXTERNAL_VALIDITY_INFRASTRUCTURE_BLOCKED · EV-B NOT_EXECUTED · EV-C NOT_EXECUTED · research_integrity=PASS · umbrella admissibility pending',
});

appendOnce(phase1, {
  id: 'pda-candidate-v10-development-fail',
  track: 'RT-02',
  title: 'Candidate-v10 Development — FAIL',
  description: 'Candidate-v10 failed before candidate freeze: none of V10-A/B/C passed every preregistered architecture-qualification gate. All failed lexical novelty plus contradiction detection/false-certainty requirements; V10-B also failed supersession and counterfactual directional/ACT-disable checks. H1-H15 and protected evaluation were NOT EXECUTED.',
  status: 'failed',
  terminalAt: '2026-08-16T11:56:25+08:00',
  datePrecision: 'time',
  evidenceLabel: 'PDA Candidate-v10 terminal 0bed7520',
  evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/0bed752075356b94cf823a172ec86382f558fa17',
  dependsOn: ['Candidate-v9 terminal 8b814969', 'Candidate-v10 preregistration'],
  requiredForMvj: true,
  note: 'CANDIDATE_V10 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · PRE_FREEZE_ARCHITECTURE_QUALIFICATION · selected_architecture=null · protected_executed=false',
});

appendOnce(phase1, {
  id: 'pda-candidate-v7-independent-requalification-fail',
  track: 'RT-02',
  title: 'Candidate-v7 Independent Requalification (V7R) — FAIL',
  description: 'Frozen V7A-01 completed 5/5 independently preregistered qualification runs over 1,750 fresh protected examples with research integrity PASS and no protected-example access. Fresh OOD macro-F1 was 0.615642 (worst run 0.585701), ACT recall 0.38, lexical macro-F1 0.082051, scope 0.060109, and counterfactual exact-pair 0.291429. This is a valid scientific qualification FAIL, not infrastructure invalidity.',
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
  pdaTrack.detail = 'Gate B–E retain bounded evidence; Gate F protected/OOD failed. Candidate-v3/v4 confirmatory lineages failed, Candidate-v5 was integrity-invalid, Candidate-v6/v7/v8/v9/v10 did not establish protected qualification, and the independent V7R requalification validly failed on fresh multi-run evidence. No candidate currently establishes protected/OOD generalization or Gate G authorization.';
}

const pdaBlocker = verifiedSnapshot.blockers?.find((blocker) => blocker.title === 'PDA protected/OOD recovery');
if (pdaBlocker) {
  pdaBlocker.source = 'RT-02 Gate F / Candidate-v3–v10 / V7R';
  pdaBlocker.text = 'Gate F、Candidate-v3/v4 confirmatory 皆 terminal FAIL；Candidate-v5 integrity-invalid；Candidate-v6/v7/v8/v9/v10 均未取得 protected qualification。另 V7R 對 frozen V7A-01 的 5-run fresh independent requalification 也形成有效 scientific FAIL。任何後續研究都必須是新的合法 lineage，不得修補後重用已觀測的 holdout/protected evidence 作 qualification。';
}

if (!verifiedSnapshot.blockers?.some((blocker) => blocker.title === 'PSE clean-integrity external-validity infrastructure')) {
  verifiedSnapshot.blockers?.push({
    level: 'high',
    title: 'PSE clean-integrity external-validity infrastructure',
    source: 'personal-state-engine-clean-integrity / Candidate-v13',
    text: 'Candidate-v13 naturalistic external-validity lineage 在 formal execution 前因 D6/D7 capacity shortfall 與 locked gap source materialization failure 終止。EV-B/EV-C 均未執行；integrity PASS 不得解讀為 external-validity PASS。此新 repo 已納入監督，但 umbrella admissibility 與 RT-01 maturity 皆未自動提升。',
  });
}

pushUnique(
  verifiedSnapshot.claims?.supported,
  'PDA Candidate-v9 的 frozen V9-B 在第一個 formal H1 DEV-OOD 僅取得 macro-F1 0.577159、ACT recall 0.236667；H2-H13 與 protected evaluation 未執行。',
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
  verifiedSnapshot.claims?.supported,
  'PSE clean-integrity Candidate-v13 的 naturalistic external-validity lineage 因 pre-formal infrastructure capacity/materialization block 終止；EV-B/EV-C 未執行，research integrity PASS 只支持完整性 closeout，不支持 external-validity performance PASS。',
);
pushUnique(
  verifiedSnapshot.claims?.notSupported,
  'Candidate-v9, Candidate-v10, or V7R establishes protected/OOD generalization, Gate G authorization, closed-loop readiness, or production safety.',
);
pushUnique(
  verifiedSnapshot.claims?.notSupported,
  'PSE Candidate-v13 has passed or failed naturalistic external validity; no formal EV-B/EV-C performance result exists in the audited clean-integrity lineage.',
);

if (verifiedSnapshot.benchmarks?.pda) {
  verifiedSnapshot.benchmarks.pda.claim = 'Specification consistency and bounded Gate-E evidence remain supported. Gate-F protected/OOD generalization failed; Candidate-v3/v4 confirmatory lineages failed, Candidate-v5 was integrity-invalid, Candidate-v6-v10 did not qualify for protected evaluation, and independent V7R validly failed fresh multi-run requalification. Protected/OOD generalization remains unestablished.';
}

const pdaLine = verifiedSnapshot.researchLines?.find((line) => line.id === 'pda-lineage');
if (pdaLine) {
  pdaLine.status = 'failed';
  pdaLine.statusText = {
    zh: 'Candidate-v3–v10 與 V7R 皆未建立 protected generalization',
    en: 'CANDIDATE-V3–V10 AND V7R DID NOT ESTABLISH PROTECTED GENERALIZATION',
  };
  pdaLine.summary = {
    zh: 'Gate B–E 保留 bounded evidence，但 Gate F、Candidate-v3/v4 confirmatory、Candidate-v6–v10 development qualification 與 V7R independent requalification 都沒有建立 protected/OOD generalization；Candidate-v5 則因 integrity overfetch 失效。V7R 是有效 scientific FAIL，不是 infrastructure invalid。',
    en: 'Gates B–E retain bounded evidence, but Gate F, Candidate-v3/v4 confirmatory evaluation, Candidate-v6–v10 development qualification, and the independent V7R requalification all failed to establish protected/OOD generalization; Candidate-v5 was integrity-invalid. V7R is a valid scientific failure, not infrastructure invalidity.',
  };
  pdaLine.current = {
    zh: 'Candidate-v10 terminal FAIL；V7R independent requalification 亦 terminal FAIL；目前沒有合格 protected candidate',
    en: 'Candidate-v10 is terminal FAIL; independent V7R requalification also terminally failed; no candidate is qualified for protected evaluation',
    url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/25',
  };
  pdaLine.next = {
    zh: '若繼續，只能建立新的 post-v10 development lineage；不得修補或重用 Candidate-v9/v10 holdout 或 V7R fresh protected evidence 重新 qualification。',
    en: 'If research continues, start a fresh post-v10 development lineage. Do not repair or reuse Candidate-v9/v10 holdout evidence or V7R fresh protected evidence for requalification.',
  };
  pdaLine.counts = { achieved: 4, failed: 10 };
  pdaLine.latestAt = '2026-08-16T12:05:18+08:00';
  pdaLine.latestPrecision = 'time';
  const history = pdaLine.history || [];
  const addHistory = (needle, item) => {
    if (!history.some((existing) => existing.zh?.includes(needle))) history.push(item);
  };
  addHistory('Candidate-v9', {
    status: 'failed',
    zh: 'Candidate-v9 — DEVELOPMENT FAIL / H1 DEV-OOD generalization thresholds failed',
    en: 'Candidate-v9 — DEVELOPMENT FAIL / H1 DEV-OOD generalization thresholds failed',
    at: '2026-08-16T11:34:36+08:00',
    precision: 'time',
    url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/8b8149698d7b04147b620c063887cebd901e2252',
  });
  addHistory('Candidate-v10', {
    status: 'failed',
    zh: 'Candidate-v10 — DEVELOPMENT FAIL / pre-freeze architecture qualification',
    en: 'Candidate-v10 — DEVELOPMENT FAIL / pre-freeze architecture qualification',
    at: '2026-08-16T11:56:25+08:00',
    precision: 'time',
    url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/0bed752075356b94cf823a172ec86382f558fa17',
  });
  addHistory('V7R', {
    status: 'failed',
    zh: 'V7R — INDEPENDENT REQUALIFICATION FAIL / valid scientific failure',
    en: 'V7R — INDEPENDENT REQUALIFICATION FAIL / valid scientific failure',
    at: '2026-08-16T12:05:18+08:00',
    precision: 'time',
    url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/commit/a247c8b9685a48984d7ca9063ba7576d771edb54',
  });
  pdaLine.history = history;
}

if (!verifiedSnapshot.researchLines?.some((line) => line.id === 'pse-clean-integrity-lineage')) {
  verifiedSnapshot.researchLines?.push({
    id: 'pse-clean-integrity-lineage',
    code: 'RT-01 · PSE CLEAN',
    accent: 'blue',
    title: { zh: 'Personal State Engine — Clean Integrity Lineage', en: 'Personal State Engine — Clean Integrity Lineage' },
    status: 'blocked',
    statusText: { zh: '外部效度基礎設施阻塞／ADMISSIBILITY PENDING', en: 'EXTERNAL-VALIDITY INFRASTRUCTURE BLOCKED / ADMISSIBILITY PENDING' },
    summary: {
      zh: 'Candidate-v13 clean-integrity lineage 在 formal naturalistic external-validity execution 前停止。EV-B/EV-C bullets 均未消耗；D6/D7 capacity shortfall 與 locked source materialization failure 使後續必須修改 frozen infrastructure 才能繼續，因此依規則終止。Integrity PASS 不等於 external-validity PASS。',
      en: 'The Candidate-v13 clean-integrity lineage stopped before formal naturalistic external-validity execution. EV-B/EV-C bullets remain unconsumed; D6/D7 capacity shortfall and locked-source materialization failure would require changing frozen infrastructure to continue. Integrity PASS is not an external-validity PASS.',
    },
    current: {
      zh: 'Candidate-v13 — NATURALISTIC_EXTERNAL_VALIDITY_INFRASTRUCTURE_BLOCKED',
      en: 'Candidate-v13 — NATURALISTIC_EXTERNAL_VALIDITY_INFRASTRUCTURE_BLOCKED',
      url: 'https://github.com/kodlbegiko/personal-state-engine-clean-integrity/pull/1',
    },
    next: {
      zh: '維持 EV-B/EV-C 未執行與 frozen evidence；任何新的 external-validity 嘗試都必須先經 umbrella admissibility audit 並建立合法的新 infrastructure/lineage，而不是在此 terminal lineage 內修補。',
      en: 'Preserve EV-B/EV-C as unexecuted and retain frozen evidence. Any future external-validity attempt requires umbrella admissibility review and a legal new infrastructure/lineage, not repair inside this terminal lineage.',
    },
    counts: { achieved: 0, failed: 0 },
    latestAt: '2026-08-16T11:38:33+08:00',
    latestPrecision: 'time',
    history: [
      {
        status: 'blocked',
        zh: 'Candidate-v13 — naturalistic external validity infrastructure blocked before formal execution',
        en: 'Candidate-v13 — naturalistic external validity infrastructure blocked before formal execution',
        at: '2026-08-16T11:38:33+08:00',
        precision: 'time',
        url: 'https://github.com/kodlbegiko/personal-state-engine-clean-integrity/commit/bad307ac11e549437b4337f0459ccfd55625f826',
      },
    ],
  });
}
