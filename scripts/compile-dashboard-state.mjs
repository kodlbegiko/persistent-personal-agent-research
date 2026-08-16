
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { sha256 } from '../dashboard/state/lib/state-tools.mjs';

const root = resolve('.');
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const registry = await readJson('dashboard/state/registry/research-lineages.json');
const policyText = await readFile(resolve(root, 'governance/watch-policy.yaml'), 'utf8');
const policyVersion = policyText.match(/^version:\s*"?([^"\n]+)"?/m)?.[1]?.trim() || 'UNKNOWN';
const policyHash = sha256(policyText);

const migrationBase = pathToFileURL(resolve(root, 'dashboard/state/migration/researchState.js')).href;
const migrationRecovery = pathToFileURL(resolve(root, 'dashboard/state/migration/recoveryOverlay.js')).href;
const migrationHourly = pathToFileURL(resolve(root, 'dashboard/state/migration/hourlyEvidenceOverlay.js')).href;
const baseModule = await import(migrationBase);
await import(migrationRecovery);
await import(migrationHourly);
const snapshot = structuredClone(baseModule.verifiedSnapshot);

const sourceUmbrellaSHA = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || process.env.DASHBOARD_SOURCE_SHA || '08ea68eb417216a56398c12c67c3a281f8b9bee4';
const verifiedAt = process.env.DASHBOARD_VERIFIED_AT || '2026-08-16T11:55:00+08:00';
const auditId = process.env.DASHBOARD_AUDIT_ID || 'dashboard-v2-independent-audit-20260816T1155+0800';
const previousSnapshotId = 'baseline-08ea68eb4172';

const refUrl = (lineage, ref) => {
  if (ref?.type === 'pull_request') return 'https://github.com/' + lineage.owner + '/' + lineage.repo + '/pull/' + String(ref.name).replace('#', '');
  if (ref?.type === 'branch') return 'https://github.com/' + lineage.owner + '/' + lineage.repo + '/tree/' + encodeURIComponent(ref.name);
  return lineage.sourceOfTruth;
};

snapshot.schemaVersion = '2.0.0';
snapshot.verifiedAt = verifiedAt;
snapshot.auditId = auditId;
snapshot.auditPolicyVersion = policyVersion;
snapshot.auditPolicyHash = policyHash;
snapshot.sourceUmbrellaSHA = sourceUmbrellaSHA;
snapshot.previousSnapshotId = previousSnapshotId;
snapshot.sourceRepositories = registry.lineages.map((lineage) => {
  const active = lineage.activeRefs?.[0] || {};
  return { repo: lineage.owner + '/' + lineage.repo, ref: active.branch || active.name || lineage.defaultBranch, sha: active.sha || null, role: lineage.role, admissibility: lineage.admissibility };
});
snapshot.repositories = registry.lineages.filter((lineage) => lineage.watchState === 'WATCHED').map((lineage, index) => ({
  key: lineage.id,
  owner: lineage.owner,
  repo: lineage.repo,
  label: lineage.role,
  accent: ['green', 'blue', 'cyan', 'purple', 'violet'][index % 5],
  watchState: lineage.watchState,
  admissibility: lineage.admissibility,
}));

function evidenceFromUrl(url, label, claimScope = 'BOUNDARY_PRESERVED') {
  if (!url) return [];
  const match = String(url).match(/github\.com\/([^/]+)\/([^/]+)\/(commit|pull|tree)\/([^/?#]+)/);
  if (!match) return [{ repo: null, sha: null, path: null, artifactHash: null, evidenceType: 'traceable-url', label, admissibility: 'ADMITTED', claimScope, url }];
  const [, owner, repo, kind, ref] = match;
  return [{ repo: owner + '/' + repo, sha: kind === 'commit' ? ref : null, ref: kind !== 'commit' ? ref : null, path: null, artifactHash: null, evidenceType: kind === 'commit' ? 'commit' : kind, label, admissibility: 'ADMITTED', claimScope, url }];
}

const allNodes = snapshot.advancementTimeline?.phases?.flatMap((phase) => phase.nodes) || [];
for (const node of allNodes) {
  node.dependencyIds = node.dependencyIds || [];
  if (!node.evidenceRefs?.length && node.evidenceUrl) node.evidenceRefs = evidenceFromUrl(node.evidenceUrl, node.evidenceLabel || node.title, 'NODE_ONLY');
}

const gateEvidence = {
  'RT-02|Gate B': 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/7',
  'RT-02|Gate C': 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/8',
  'RT-02|Gate D': 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/10',
  'RT-02|Gate E': 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/12',
  'RT-02|Gate F': 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/14',
  'RT-01|Gate E (scientific)': 'https://github.com/kodlbegiko/personal-state-engine-research/pull/2',
  'RT-01|Gate E (formal)': 'https://github.com/kodlbegiko/personal-state-engine-research/pull/2',
  'RT-01|Gate F': 'https://github.com/kodlbegiko/personal-state-engine-research/pull/2',
};
for (const gate of snapshot.gates || []) {
  const url = gateEvidence[gate.track + '|' + gate.gate];
  if (url) gate.evidenceRefs = evidenceFromUrl(url, gate.track + ' ' + gate.gate, 'GATE_BOUNDARY');
}

const phase1 = snapshot.advancementTimeline?.phases?.find((phase) => phase.id === 'phase-1');
if (phase1 && !phase1.nodes.some((node) => node.id === 'pda-candidate-v9-development-fail')) {
  phase1.nodes.push({
    id: 'pda-candidate-v9-development-fail',
    track: 'RT-02',
    title: 'Candidate-v9 Development — FAIL',
    description: 'Frozen V9-B passed pre-freeze validation, then the first formal H1 DEV-OOD holdout failed preregistered generalization thresholds: macro-F1 0.5772 and ACT recall 0.2367. H2–H13 were not executed; protected evaluation was not eligible or executed.',
    status: 'failed',
    terminalAt: '2026-08-16T11:35:51+08:00',
    datePrecision: 'time',
    evidenceLabel: 'PDA Candidate-v9 terminal development evidence',
    evidenceUrl: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/blob/8b8149698d7b04147b620c063887cebd901e2252/gate_recovery_v9/development_terminal.json',
    evidenceRefs: [{
      repo: 'kodlbegiko/Proactivity-Decision-Algorithm',
      sha: '8b8149698d7b04147b620c063887cebd901e2252',
      path: 'gate_recovery_v9/development_terminal.json',
      artifactHash: 'git-blob:6bc301e1517aa3052f142f0d274922436b30460a',
      evidenceType: 'terminal-artifact',
      label: 'Candidate-v9 development terminal',
      admissibility: 'ADMITTED_NEGATIVE_TERMINAL',
      claimScope: 'DEVELOPMENT_FAIL_ONLY',
      url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/blob/8b8149698d7b04147b620c063887cebd901e2252/gate_recovery_v9/development_terminal.json'
    }],
    dependsOn: ['Candidate-v8 immutable terminal lineage'],
    dependencyIds: ['pda-candidate-v8-development-fail'],
    requiredForMvj: true,
    note: 'CANDIDATE_V9 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · protected NOT ELIGIBLE / NOT EXECUTED · no formal holdout rerun or semantic rescue.'
  });
}


const dependencyMap = {
  'mission-established': [],
  'pse-gate-e-scientific': ['mission-established'],
  'pse-integrity-lineage': ['pse-gate-e-scientific'],
  'pda-gate-b': ['mission-established'],
  'pda-gate-c': ['pda-gate-b'],
  'pda-gate-d': ['pda-gate-c'],
  'pda-gate-e': ['pda-gate-d'],
  'pda-gate-f': ['pda-gate-e'],
  'pda-recovery': ['pda-gate-f'],
  'pda-candidate-v3-confirmatory-fail': ['pda-recovery'],
  'pda-candidate-v4-confirmatory-fail': ['pda-candidate-v3-confirmatory-fail'],
  'pda-candidate-v5-integrity-invalid': ['pda-candidate-v4-confirmatory-fail'],
  'pda-candidate-v6-development-fail': ['pda-candidate-v5-integrity-invalid'],
  'pda-candidate-v7-development-fail': ['pda-candidate-v6-development-fail'],
  'pda-candidate-v8-development-fail': ['pda-candidate-v7-development-fail'],
  'pda-candidate-v9-development-fail': ['pda-candidate-v8-development-fail'],
  'integration-contract': ['pse-gate-e-scientific', 'pda-gate-e'],
  'action-verification': ['integration-contract'],
  'closed-loop-benchmark': ['integration-contract', 'action-verification', 'pda-recovery'],
  'pare-v03-protected-recovery': ['mission-established'],
  'long-horizon': ['closed-loop-benchmark'],
  'multimodal': ['closed-loop-benchmark'],
  'cross-device': ['closed-loop-benchmark'],
  'mvj': ['closed-loop-benchmark', 'long-horizon', 'multimodal', 'cross-device', 'pda-recovery'],
  'physical-world': ['mvj'],
  'north-star': ['mvj', 'physical-world'],
};
const compiledNodes = snapshot.advancementTimeline?.phases?.flatMap((phase) => phase.nodes) || [];
for (const node of compiledNodes) node.dependencyIds = dependencyMap[node.id] || node.dependencyIds || [];

const pdaLine = snapshot.researchLines?.find((line) => line.id === 'pda-lineage');
if (pdaLine) {
  pdaLine.status = 'failed';
  pdaLine.statusText = { zh: 'Candidate-v3–v9 皆未建立 protected generalization', en: 'CANDIDATE-V3–V9 HAVE NOT ESTABLISHED PROTECTED GENERALIZATION' };
  pdaLine.summary = {
    zh: 'Gate B–E 保留 bounded evidence；Gate F 與後續 recovery lineages 的 FAIL / INVALID 均保留。Candidate-v9 在第一個 formal H1 DEV-OOD holdout 未達門檻，protected evaluation 未執行。',
    en: 'Gates B–E retain bounded evidence; Gate F and later recovery FAIL/INVALID outcomes are preserved. Candidate-v9 missed thresholds on its first formal H1 DEV-OOD holdout and never executed protected evaluation.'
  };
  pdaLine.current = { zh: 'Candidate-v9 TERMINATED；目前沒有合法 protected PASS', en: 'Candidate-v9 TERMINATED; no admissible protected PASS exists', url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/23' };
  pdaLine.next = { zh: '任何後續 recovery 必須是新的 lineage；不得用 Candidate-v9 H1 結果救援後重跑 qualification。', en: 'Any continuation must use a new lineage; Candidate-v9 H1 outcomes cannot be used to rescue and requalify Candidate-v9.' };
  pdaLine.counts = { achieved: pdaLine.counts?.achieved || 4, failed: Math.max(pdaLine.counts?.failed || 0, 8) };
  pdaLine.latestAt = '2026-08-16T11:35:51+08:00';
  pdaLine.latestPrecision = 'time';
  if (!pdaLine.history?.some((item) => String(item.zh || '').includes('Candidate-v9'))) {
    pdaLine.history = [...(pdaLine.history || []), { status: 'failed', zh: 'Candidate-v9 — DEVELOPMENT FAIL / NO CANDIDATE QUALIFIED', en: 'Candidate-v9 — DEVELOPMENT FAIL / NO CANDIDATE QUALIFIED', at: '2026-08-16T11:35:51+08:00', precision: 'time', url: 'https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/23' }];
  }
}

if (!snapshot.researchLines?.some((line) => line.id === 'pse-clean-lineage')) {
  snapshot.researchLines = [...(snapshot.researchLines || []), {
    id: 'pse-clean-lineage',
    code: 'RT-01 · PSE CLEAN',
    accent: 'cyan',
    title: { zh: 'PSE Clean Integrity', en: 'PSE Clean Integrity' },
    status: 'blocked',
    statusText: { zh: 'WATCHED · PENDING ADMISSIBILITY', en: 'WATCHED · PENDING ADMISSIBILITY' },
    summary: {
      zh: 'Candidate-v13 naturalistic external-validity lineage 以 infrastructure blocked 終止；EV-B / EV-C 未執行。Integrity PASS 只證明停止方式守住研究完整性，不是 external-validity performance PASS。',
      en: 'Candidate-v13 naturalistic external validity ended infrastructure-blocked; EV-B / EV-C were not executed. Integrity PASS validates the closeout discipline, not external-validity performance.'
    },
    current: { zh: 'NATURALISTIC_EXTERNAL_VALIDITY_INFRASTRUCTURE_BLOCKED', en: 'NATURALISTIC_EXTERNAL_VALIDITY_INFRASTRUCTURE_BLOCKED', url: 'https://github.com/kodlbegiko/personal-state-engine-clean-integrity/pull/1' },
    next: { zh: '等待獨立 admissibility audit；不得因 repo/PR 存在就推進 RT-01 umbrella maturity。', en: 'Await independent admissibility audit; repository/PR existence cannot advance RT-01 umbrella maturity.' },
    counts: { achieved: 0, failed: 0 },
    latestAt: '2026-08-16',
    latestPrecision: 'date',
    history: [{ status: 'blocked', zh: 'Candidate-v13 external validity — INFRASTRUCTURE BLOCKED / EV-B EV-C NOT EXECUTED', en: 'Candidate-v13 external validity — INFRASTRUCTURE BLOCKED / EV-B EV-C NOT EXECUTED', at: '2026-08-16', precision: 'date', url: 'https://github.com/kodlbegiko/personal-state-engine-clean-integrity/commit/bad307ac11e549437b4337f0459ccfd55625f826' }]
  }];
}

const candidate9Supported = 'PDA Candidate-v9 在 pre-freeze validation 通過，但首個 formal H1 DEV-OOD 僅 macro-F1 0.5772、ACT recall 0.2367，因此 terminal development FAIL；protected evaluation 未執行。';
if (!snapshot.claims.supported.includes(candidate9Supported)) snapshot.claims.supported.push(candidate9Supported);
const candidate9Unsupported = 'Candidate-v9 establishes protected/OOD generalization, Gate G authorization, closed-loop readiness, or production safety.';
if (!snapshot.claims.notSupported.includes(candidate9Unsupported)) snapshot.claims.notSupported.push(candidate9Unsupported);

snapshot.lineageRegistryVersion = registry.registryVersion;
snapshot.controlPlane = {
  registryVersion: registry.registryVersion,
  watchPolicyVersion: policyVersion,
  watchPolicyHash: policyHash,
  staleAfterHours: 2,
  changesSincePrevious: [
    { type: 'architecture', zh: 'canonical state 改為 deterministic compiled snapshot；browser overlay side effect 已移除。', en: 'Canonical state moved to a deterministic compiled snapshot; browser overlay side effects were removed.' },
    { type: 'lineage', zh: 'PSE clean-integrity repo 登錄為 WATCHED / PENDING，不推進 RT-01。', en: 'PSE clean-integrity is registered WATCHED / PENDING without advancing RT-01.' },
    { type: 'terminal', zh: 'PDA Candidate-v9 terminal development FAIL 已採納為負面證據。', en: 'PDA Candidate-v9 terminal development FAIL was admitted as negative evidence.' }
  ],
  history: [
    { snapshotId: previousSnapshotId, verifiedAt: '2026-08-16T11:09:26+08:00', sourceUmbrellaSHA: '08ea68eb417216a56398c12c67c3a281f8b9bee4', auditId: 'legacy-hourly-evidence-overlay' }
  ]
};

snapshot.snapshotId = 'v2-' + sourceUmbrellaSHA.slice(0, 12) + '-' + auditId.replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 36);
snapshot.controlPlane.history.push({ snapshotId: snapshot.snapshotId, verifiedAt: snapshot.verifiedAt, sourceUmbrellaSHA: snapshot.sourceUmbrellaSHA, auditId: snapshot.auditId });
const unsigned = structuredClone(snapshot);
delete unsigned.contentHash;
snapshot.contentHash = sha256(unsigned);

const verifiedDir = resolve(root, 'dashboard/state/verified');
const historyDir = resolve(root, 'dashboard/state/history');
const diffDir = resolve(root, 'dashboard/state/diffs');
await mkdir(verifiedDir, { recursive: true });
await mkdir(historyDir, { recursive: true });
await mkdir(diffDir, { recursive: true });
const baselinePath = resolve(historyDir, previousSnapshotId + '.json');
try { await access(baselinePath); } catch {
  await writeFile(baselinePath, JSON.stringify({ schemaVersion: '1.x-baseline', snapshotId: previousSnapshotId, verifiedAt: '2026-08-16T11:09:26+08:00', sourceUmbrellaSHA: '08ea68eb417216a56398c12c67c3a281f8b9bee4', canonicalArchitecture: 'researchState.js + recoveryOverlay.js + hourlyEvidenceOverlay.js browser side effects', note: 'Immutable baseline identity captured before Dashboard v2 migration.' }, null, 2) + '\n');
}
await writeFile(resolve(verifiedDir, 'current.json'), JSON.stringify(snapshot, null, 2) + '\n');
await writeFile(resolve(historyDir, snapshot.snapshotId + '.json'), JSON.stringify(snapshot, null, 2) + '\n');
await writeFile(resolve(diffDir, previousSnapshotId + '--' + snapshot.snapshotId + '.json'), JSON.stringify({ from: previousSnapshotId, to: snapshot.snapshotId, changes: snapshot.controlPlane.changesSincePrevious }, null, 2) + '\n');
const historyFiles = (await readdir(historyDir)).filter((name) => name.endsWith('.json') && name !== 'index.json').sort();
await writeFile(resolve(historyDir, 'index.json'), JSON.stringify({ schemaVersion: '1.0.0', snapshots: historyFiles.map((name) => name.replace(/\.json$/, '')) }, null, 2) + '\n');
console.log('[dashboard-state] compiled', snapshot.snapshotId, snapshot.contentHash);
