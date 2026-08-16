from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n", encoding="utf-8")


def write_json(path: str, value: object) -> None:
    write(path, json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def append_once(path: str, marker: str, content: str) -> None:
    target = ROOT / path
    existing = target.read_text(encoding="utf-8") if target.exists() else ""
    if marker not in existing:
        target.write_text(existing.rstrip() + "\n\n" + content.strip() + "\n", encoding="utf-8")


# Preserve the exact pre-v2 mutable implementation as deterministic migration input.
migration = ROOT / "dashboard/state/migration"
migration.mkdir(parents=True, exist_ok=True)
for name in ("researchState.js", "recoveryOverlay.js", "hourlyEvidenceOverlay.js"):
    shutil.copy2(ROOT / "src/data" / name, migration / name)

registry = {
    "schemaVersion": "2.0.0",
    "registryVersion": "2026.08.16.1",
    "owner": "kodlbegiko",
    "lineages": [
        {
            "id": "program-control",
            "owner": "kodlbegiko",
            "repo": "persistent-personal-agent-research",
            "track": "PROGRAM",
            "role": "PROGRAM_CONTROL",
            "watchState": "WATCHED",
            "admissibility": "ADMITTED",
            "defaultBranch": "main",
            "activeRefs": [{"type": "branch", "name": "main", "sha": "08ea68eb417216a56398c12c67c3a281f8b9bee4"}],
            "sourceOfTruth": "https://github.com/kodlbegiko/persistent-personal-agent-research/tree/main",
            "addedAt": "2026-08-14",
            "retiredAt": None,
            "supersedes": [],
            "supersededBy": None,
            "claimBoundary": {
                "zh": "總體研究治理與可驗證狀態；不得以 umbrella 活動取代 child research evidence。",
                "en": "Program governance and verified state only; umbrella activity cannot substitute for child-research evidence."
            },
            "notes": "GitHub main is the umbrella source of truth."
        },
        {
            "id": "pse-legacy",
            "owner": "kodlbegiko",
            "repo": "personal-state-engine-research",
            "track": "RT-01",
            "role": "LEGACY_PSE_LINEAGE",
            "watchState": "WATCHED",
            "admissibility": "ADMITTED_WITH_FORMAL_FAIL_CLOSED_BOUNDARY",
            "defaultBranch": "main",
            "activeRefs": [{"type": "pull_request", "name": "#2", "branch": "research/personal-state-engine-v0", "sha": "8da87b2f8d1d3dbbfcc168a8f7c700e6f3bec4f8"}],
            "sourceOfTruth": "https://github.com/kodlbegiko/personal-state-engine-research/pull/2",
            "addedAt": "2026-08-14",
            "retiredAt": None,
            "supersedes": [],
            "supersededBy": "pse-clean-integrity",
            "claimBoundary": {
                "zh": "Candidate-v6 scientific evidence 可保留；formal Gate E 仍 fail-closed，現有 lineage 不得把 Gate F 視為合法進度。",
                "en": "Candidate-v6 scientific evidence is retained; formal Gate E remains fail-closed and Gate F is not admissible progress in this lineage."
            },
            "notes": "Historical negative and integrity evidence remains immutable."
        },
        {
            "id": "pse-clean-integrity",
            "owner": "kodlbegiko",
            "repo": "personal-state-engine-clean-integrity",
            "track": "RT-01",
            "role": "CLEAN_INTEGRITY_PSE_LINEAGE",
            "watchState": "WATCHED",
            "admissibility": "PENDING",
            "defaultBranch": "main",
            "activeRefs": [{"type": "pull_request", "name": "#1", "branch": "research/candidate-v13-naturalistic-external-validity", "sha": "bad307ac11e549437b4337f0459ccfd55625f826"}],
            "sourceOfTruth": "https://github.com/kodlbegiko/personal-state-engine-clean-integrity/pull/1",
            "addedAt": "2026-08-16",
            "retiredAt": None,
            "supersedes": ["pse-legacy"],
            "supersededBy": None,
            "claimBoundary": {
                "zh": "目前只能確認 Candidate-v13 external-validity lineage 在 formal execution 前 infrastructure blocked；EV-B/EV-C 未執行。Integrity PASS 不等於 external-validity performance PASS。",
                "en": "Candidate-v13 external validity is currently infrastructure-blocked before formal execution; EV-B/EV-C were not executed. Integrity PASS is not an external-validity performance PASS."
            },
            "notes": "WATCHED / PENDING admissibility. Must not auto-promote RT-01 maturity."
        },
        {
            "id": "pda",
            "owner": "kodlbegiko",
            "repo": "Proactivity-Decision-Algorithm",
            "track": "RT-02",
            "role": "PROACTIVITY_RESEARCH",
            "watchState": "WATCHED",
            "admissibility": "ADMITTED_NEGATIVE_TERMINALS_PRESERVED",
            "defaultBranch": "main",
            "activeRefs": [{"type": "pull_request", "name": "#23", "branch": "research/candidate-v9-normative-state-safe-recovery", "sha": "8b8149698d7b04147b620c063887cebd901e2252"}],
            "sourceOfTruth": "https://github.com/kodlbegiko/Proactivity-Decision-Algorithm/pull/23",
            "addedAt": "2026-08-14",
            "retiredAt": None,
            "supersedes": [],
            "supersededBy": None,
            "claimBoundary": {
                "zh": "Gate B–E bounded evidence 可保留；Gate F 與後續失敗/失效 lineage 不得被改寫成 protected/OOD generalization PASS。",
                "en": "Bounded Gate B–E evidence is retained; Gate F and later failed/invalid lineages cannot be rewritten as protected/OOD generalization PASS."
            },
            "notes": "Candidate-v9 is a terminal development FAIL; protected evaluation was not executed."
        },
        {
            "id": "pare",
            "owner": "kodlbegiko",
            "repo": "personal-agent-recovery-engine",
            "track": "RT-03",
            "role": "RECOVERY_RESEARCH",
            "watchState": "WATCHED",
            "admissibility": "ADMITTED_BENCHMARK_SPECIFIC",
            "defaultBranch": "main",
            "activeRefs": [{"type": "branch", "name": "main", "sha": "881e139bc59ee75d32efaca6a61988640f54db4d"}],
            "sourceOfTruth": "https://github.com/kodlbegiko/personal-agent-recovery-engine/tree/main",
            "addedAt": "2026-08-15",
            "retiredAt": None,
            "supersedes": [],
            "supersededBy": None,
            "claimBoundary": {
                "zh": "PARE v0.3 僅支持 benchmark-specific recovery/state-repair evidence；不等於 PAAV / RT-03 Action Verification 已建立。",
                "en": "PARE v0.3 supports benchmark-specific recovery/state-repair evidence only; it does not establish PAAV / RT-03 Action Verification."
            },
            "notes": "Independent recovery research with bounded admitted evidence."
        }
    ]
}
write_json("dashboard/state/registry/research-lineages.json", registry)

write("governance/watch-policy.yaml", r'''
version: "2.0.0"
registry: dashboard/state/registry/research-lineages.json
audit:
  cadence: PT1H
  staleVerifiedSnapshotAfter: PT2H
  failClosedOnPolicyDrift: true
evidenceRules:
  completedRequiresEvidenceRef: true
  failedRequiresEvidenceRef: true
  terminalEvidenceImmutable: true
  protectedEvidenceCannotBeReclassifiedByActivity: true
claimRules:
  benchmarkSpecificDoesNotImplyUniversalSuperiority: true
  noProductionSafetyClaimWithoutDedicatedEvidence: true
terminalRules:
  preserve: [FAIL, FAIL_CLOSED, INVALID, BLOCKED, PROHIBITED, NEGATIVE_RESULT, INTEGRITY_INCIDENT]
  passAfterTerminalRequires: [newLineage, explicitSupersessionEvidence]
admissibilityRules:
  newRepositoryDefaultsTo: UNREGISTERED_RESEARCH_LINEAGE
  discoveryDoesNotAutoAdmit: true
languageSynchronizationRule: zh-Hant/en semantic parity required
deploymentRule:
  sourceOfTruthBranch: main
  productionRequiresCleanCI: true
  exactSourceSHARequired: true
''')

write_json("dashboard/state/schema/dashboard-state.schema.json", {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://jarvis-research-dashboard.vercel.app/schema/dashboard-state-v2.json",
    "title": "JARVIS Research Control Plane verified snapshot",
    "type": "object",
    "required": ["schemaVersion", "snapshotId", "verifiedAt", "auditId", "auditPolicyVersion", "auditPolicyHash", "sourceUmbrellaSHA", "sourceRepositories", "previousSnapshotId", "contentHash", "tracks", "gates", "blockers", "claims", "advancementTimeline"],
    "properties": {
        "schemaVersion": {"const": "2.0.0"},
        "snapshotId": {"type": "string"},
        "verifiedAt": {"type": "string"},
        "auditId": {"type": "string"},
        "auditPolicyVersion": {"type": "string"},
        "auditPolicyHash": {"type": "string", "pattern": "^[a-f0-9]{64}$"},
        "sourceUmbrellaSHA": {"type": "string", "minLength": 7},
        "sourceRepositories": {"type": "array", "minItems": 5},
        "previousSnapshotId": {"type": ["string", "null"]},
        "contentHash": {"type": "string", "pattern": "^[a-f0-9]{64}$"}
    },
    "additionalProperties": True
})

write_json("dashboard/state/i18n/control-plane.json", {
    "zh-Hant": {
        "verifiedHistory": "已驗證歷史",
        "sinceAudit": "自上次已驗證稽核後",
        "sinceVisit": "自你上次查看後",
        "registry": "研究 lineage registry",
        "policy": "監督政策",
        "pending": "等待 admissibility audit",
        "stale": "已驗證快照逾期",
        "fresh": "已驗證快照在 SLA 內"
    },
    "en": {
        "verifiedHistory": "Verified History",
        "sinceAudit": "Since Last Verified Audit",
        "sinceVisit": "Since Your Last Visit",
        "registry": "Research Lineage Registry",
        "policy": "Watch Policy",
        "pending": "Pending admissibility audit",
        "stale": "Stale verified snapshot",
        "fresh": "Verified snapshot within SLA"
    }
})

write("dashboard/state/lib/state-tools.mjs", r'''
import { createHash } from 'node:crypto';

export const TERMINAL_NEGATIVE = new Set(['FAIL', 'FAIL_CLOSED', 'FAIL CLOSED', 'INVALID', 'PROHIBITED']);
export const PASS_LIKE = new Set(['PASS', 'COMPLETE', 'VALIDATED', 'INTEGRATED', 'INDEPENDENTLY_REPRODUCED']);

function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).filter((key) => value[key] !== undefined).sort().map((key) => [key, sortValue(value[key])]));
  }
  return value;
}

export function canonicalJson(value) {
  return JSON.stringify(sortValue(value));
}

export function sha256(value) {
  return createHash('sha256').update(typeof value === 'string' ? value : canonicalJson(value)).digest('hex');
}

export function isLegalTransition(previous, next, context = {}) {
  const from = String(previous || '').toUpperCase().replaceAll('-', '_');
  const to = String(next || '').toUpperCase().replaceAll('-', '_');
  if (TERMINAL_NEGATIVE.has(from) && PASS_LIKE.has(to)) {
    return Boolean(context.newLineage || context.explicitSupersessionEvidence);
  }
  return true;
}

export function validateDag(nodes) {
  const ids = new Set(nodes.map((node) => node.id));
  const graph = new Map(nodes.map((node) => [node.id, node.dependencyIds || []]));
  const orphan = [];
  for (const [id, deps] of graph) for (const dep of deps) if (!ids.has(dep)) orphan.push({ id, dep });
  const visiting = new Set();
  const visited = new Set();
  let circular = false;
  const visit = (id) => {
    if (visiting.has(id)) { circular = true; return; }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dep of graph.get(id) || []) visit(dep);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of ids) visit(id);
  return { circular, orphan };
}

export function isStale(verifiedAt, staleAfterHours = 2, now = Date.now()) {
  const value = Date.parse(verifiedAt);
  if (!Number.isFinite(value)) return true;
  return now - value > staleAfterHours * 60 * 60 * 1000;
}

export function looksLikeResearchLineage(name, branches = [], prs = []) {
  const repoMatch = /(personal.*agent|personal-state-engine|proactivity-decision|recovery-engine)/i.test(name || '');
  const refMatch = [...branches, ...prs].some((ref) => /^(research\/|candidate-)/i.test(ref || '') || /candidate-v\d+/i.test(ref || ''));
  return repoMatch || refMatch;
}

export function eventDedupKey(event) {
  const repo = event.repo || event.repoName || '';
  const id = event.id || '';
  const ref = event.sha || event.ref || event.branch || '';
  return [repo, id, ref].join(':');
}

export function dedupeEvents(events) {
  const seen = new Set();
  return events.filter((event) => {
    const key = eventDedupKey(event);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
''')

write("src/lib/activity.js", r'''
export function eventDedupKey(event) {
  return [event.repo || '', event.id || '', event.sha || event.ref || event.branch || ''].join(':');
}

export function dedupeEvents(events) {
  const seen = new Set();
  return events.filter((event) => {
    const key = eventDedupKey(event);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeGitHubEvents(events, watched) {
  const rows = [];
  for (const event of Array.isArray(events) ? events : []) {
    const repo = event.repo?.name;
    if (!repo || !watched.has(repo)) continue;
    const payload = event.payload || {};
    if (event.type === 'PushEvent') {
      const branch = String(payload.ref || '').replace('refs/heads/', '') || '—';
      rows.push({ id: event.id, kind: 'push', repo, branch, ref: payload.ref, sha: payload.head, title: 'Push → ' + branch, createdAt: event.created_at, url: payload.head ? 'https://github.com/' + repo + '/commit/' + payload.head : 'https://github.com/' + repo + '/tree/' + encodeURIComponent(branch) });
    } else if (event.type === 'PullRequestEvent') {
      const pr = payload.pull_request || {};
      rows.push({ id: event.id, kind: 'pr', repo, branch: pr.head?.ref || payload.ref || '—', ref: pr.head?.ref, sha: pr.head?.sha, title: 'PR #' + (pr.number || payload.number || '—') + ' · ' + (pr.title || payload.action || 'updated'), createdAt: event.created_at, url: pr.html_url || 'https://github.com/' + repo + '/pulls' });
    } else if (event.type === 'CreateEvent' && payload.ref_type === 'branch') {
      rows.push({ id: event.id, kind: 'branch', repo, branch: payload.ref || '—', ref: payload.ref, title: 'Branch → ' + (payload.ref || '—'), createdAt: event.created_at, url: 'https://github.com/' + repo + '/tree/' + encodeURIComponent(payload.ref || '') });
    }
  }
  return dedupeEvents(rows).sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0));
}
''')

write("scripts/compile-dashboard-state.mjs", r'''
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
const unsigned = structuredClone(snapshot);
delete unsigned.contentHash;
snapshot.contentHash = sha256(unsigned);
snapshot.controlPlane.history.push({ snapshotId: snapshot.snapshotId, verifiedAt: snapshot.verifiedAt, sourceUmbrellaSHA: snapshot.sourceUmbrellaSHA, auditId: snapshot.auditId });

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
''')

write("scripts/validate-dashboard-state.mjs", r'''
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sha256, validateDag, isLegalTransition } from '../dashboard/state/lib/state-tools.mjs';

const readJson = async (path) => JSON.parse(await readFile(resolve(path), 'utf8'));
const state = await readJson('dashboard/state/verified/current.json');
const registry = await readJson('dashboard/state/registry/research-lineages.json');
const i18n = await readJson('dashboard/state/i18n/control-plane.json');
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const unique = (values) => new Set(values).size === values.length;

assert(state.schemaVersion === '2.0.0', 'schemaVersion must be 2.0.0');
assert(unique(registry.lineages.map((lineage) => lineage.id)), 'lineage ids must be unique');
assert(unique(registry.lineages.map((lineage) => lineage.owner + '/' + lineage.repo)), 'repo identities must be unique');
assert(registry.lineages.some((lineage) => lineage.id === 'pse-clean-integrity' && lineage.watchState === 'WATCHED' && lineage.admissibility === 'PENDING'), 'PSE clean-integrity must be WATCHED/PENDING');
for (const lineage of registry.lineages) {
  assert(Boolean(lineage.claimBoundary?.zh && lineage.claimBoundary?.en), 'missing claim boundary: ' + lineage.id);
  try { new URL(lineage.sourceOfTruth); } catch { errors.push('invalid sourceOfTruth URL: ' + lineage.id); }
}
const nodes = state.advancementTimeline?.phases?.flatMap((phase) => phase.nodes) || [];
assert(unique(nodes.map((node) => node.id)), 'timeline node ids must be unique');
for (const node of nodes) {
  const status = String(node.status || '').toLowerCase();
  if (status === 'complete' || status === 'failed') assert(Array.isArray(node.evidenceRefs) && node.evidenceRefs.length > 0, 'completed/failed node lacks evidenceRefs: ' + node.id);
  if (status === 'complete') assert(Boolean(node.achievedAt), 'complete node lacks achievedAt: ' + node.id);
  if (status === 'failed') assert(Boolean(node.terminalAt), 'failed node lacks terminalAt: ' + node.id);
  assert(['date', 'time'].includes(node.datePrecision || 'date'), 'invalid datePrecision: ' + node.id);
  const track = String(node.track || '');
  assert(/^(RT-0[1-7]|PROGRAM|INTEGRATION|MVJ|NORTH STAR)/.test(track), 'unknown track: ' + node.id + ' -> ' + track);
}
const dag = validateDag(nodes);
assert(!dag.circular, 'timeline DAG contains a cycle');
assert(dag.orphan.length === 0, 'timeline DAG has orphan dependencies: ' + JSON.stringify(dag.orphan));
assert(isLegalTransition('FAIL', 'PASS', {}) === false, 'terminal FAIL must not transition directly to PASS');
assert(isLegalTransition('FAIL', 'PASS', { newLineage: true }) === true, 'new lineage must permit separately evidenced progression');
assert(Object.keys(i18n['zh-Hant']).sort().join('|') === Object.keys(i18n.en).sort().join('|'), 'zh/en control-plane keys differ');
assert(state.sourceRepositories.length === registry.lineages.length, 'sourceRepositories must cover entire registry');
const unsigned = structuredClone(state); delete unsigned.contentHash;
assert(state.contentHash === sha256(unsigned), 'snapshot contentHash is not reproducible');
if (errors.length) {
  console.error('DATA VALIDATION FAILED\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log('DATA VALIDATION PASS', { lineages: registry.lineages.length, nodes: nodes.length, snapshotId: state.snapshotId });
''')

write("scripts/check-watch-policy.mjs", r'''
import { readFile } from 'node:fs/promises';
import { sha256 } from '../dashboard/state/lib/state-tools.mjs';
const text = await readFile('governance/watch-policy.yaml', 'utf8');
const actual = sha256(text);
const expected = process.env.EXPECTED_WATCH_POLICY_HASH;
if (expected && expected !== actual) {
  console.error('POLICY_DRIFT', { expected, actual });
  process.exit(1);
}
console.log('WATCH_POLICY_OK', actual);
''')

write("scripts/discover-research-lineages.mjs", r'''
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { looksLikeResearchLineage } from '../dashboard/state/lib/state-tools.mjs';
const registry = JSON.parse(await readFile('dashboard/state/registry/research-lineages.json', 'utf8'));
const owner = registry.owner;
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'jarvis-lineage-discovery' };
if (process.env.GITHUB_TOKEN) headers.Authorization = 'Bearer ' + process.env.GITHUB_TOKEN;
const fetchJson = async (url) => { const response = await fetch(url, { headers }); if (!response.ok) throw new Error(url + ' -> ' + response.status); return response.json(); };
const repos = await fetchJson('https://api.github.com/users/' + owner + '/repos?per_page=100&sort=updated');
const registered = new Set(registry.lineages.map((lineage) => lineage.owner + '/' + lineage.repo));
const detections = [];
for (const repo of repos) {
  const full = repo.full_name;
  if (!registered.has(full) && looksLikeResearchLineage(repo.name)) detections.push({ type: 'repository', repo: full, state: 'UNREGISTERED_RESEARCH_LINEAGE', admissibility: 'PENDING_AUDIT' });
}
for (const lineage of registry.lineages.filter((item) => item.watchState === 'WATCHED')) {
  const full = lineage.owner + '/' + lineage.repo;
  const [branches, pulls] = await Promise.all([
    fetchJson('https://api.github.com/repos/' + full + '/branches?per_page=100').catch(() => []),
    fetchJson('https://api.github.com/repos/' + full + '/pulls?state=open&per_page=100').catch(() => [])
  ]);
  const known = new Set((lineage.activeRefs || []).flatMap((ref) => [ref.name, ref.branch].filter(Boolean)));
  for (const branch of branches) if (!known.has(branch.name) && looksLikeResearchLineage(lineage.repo, [branch.name], [])) detections.push({ type: 'branch', repo: full, ref: branch.name, sha: branch.commit?.sha, state: 'UNREGISTERED_RESEARCH_LINEAGE', admissibility: 'PENDING_AUDIT' });
  for (const pr of pulls) if (!known.has('#' + pr.number) && !known.has(pr.head?.ref) && looksLikeResearchLineage(lineage.repo, [], [pr.head?.ref || '', pr.title || ''])) detections.push({ type: 'pull_request', repo: full, ref: '#' + pr.number, branch: pr.head?.ref, sha: pr.head?.sha, state: 'UNREGISTERED_RESEARCH_LINEAGE', admissibility: 'PENDING_AUDIT' });
}
await mkdir('dashboard/state/discovery', { recursive: true });
await writeFile('dashboard/state/discovery/latest.json', JSON.stringify({ discoveredAt: new Date().toISOString(), detections }, null, 2) + '\n');
console.log('LINEAGE_DISCOVERY', detections.length);
''')

write("scripts/check-bundle-budget.mjs", r'''
import { readdir, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const files = await readdir('dist/assets');
let js = 0; let css = 0;
for (const file of files) {
  const bytes = gzipSync(await readFile('dist/assets/' + file)).length;
  if (file.endsWith('.js')) js += bytes;
  if (file.endsWith('.css')) css += bytes;
}
const result = { jsGzipKB: +(js / 1024).toFixed(2), cssGzipKB: +(css / 1024).toFixed(2), jsBudgetKB: 120, cssBudgetKB: 20 };
console.log('BUNDLE_BUDGET', result);
if (js > 120 * 1024 || css > 20 * 1024) process.exit(1);
''')

write("src/data/researchState.js", r'''
import compiledSnapshot from '../../dashboard/state/verified/current.json';
export const verifiedSnapshot = compiledSnapshot;
export const maturityStages = ['NOT_STARTED', 'SCOPED', 'INFRASTRUCTURE_READY', 'DEVELOPMENT_EVIDENCE', 'PROTECTED_VALIDATION', 'VALIDATED', 'INTEGRATED'];
''')
for obsolete in (ROOT / "src/data/recoveryOverlay.js", ROOT / "src/data/hourlyEvidenceOverlay.js"):
    if obsolete.exists():
        obsolete.unlink()

write("src/components/AppErrorBoundary.jsx", r'''
import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[dashboard-boundary]', this.props.name || 'surface', error, info); }
  render() {
    if (!this.state.error) return this.props.children;
    return <section className="control-plane-error" role="status"><strong>{this.props.label || 'DEGRADED LIVE DATA'}</strong><p>{this.props.description || 'Verified research state remains available.'}</p></section>;
  }
}
''')

write("src/components/LiveResearchPulse.jsx", r'''
import { useEffect, useMemo, useRef, useState } from 'react';
import registry from '../../dashboard/state/registry/research-lineages.json';
import { normalizeGitHubEvents } from '../lib/activity.js';
import { useLanguage } from '../i18n.jsx';

const WATCHED = new Set(registry.lineages.filter((lineage) => lineage.watchState === 'WATCHED').map((lineage) => lineage.owner + '/' + lineage.repo));
const OWNER = registry.owner;
const POLL_MS = 60_000;
const CACHE_KEY = 'jarvis-live-pulse:v3';
const ETAG_KEY = 'jarvis-live-pulse:v3:etag';
const LAST_EVENT_KEY = 'jarvis-live-pulse:v3:last-event';
const LEADER_KEY = 'jarvis-live-pulse:v3:leader';
const CHANNEL = 'jarvis-live-pulse-v3';
const LEASE_MS = 75_000;

function jsonGet(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
function jsonSet(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
function getTabId() { try { let id = sessionStorage.getItem('jarvis-live-pulse:tab'); if (!id) { id = crypto.randomUUID?.() || String(Math.random()); sessionStorage.setItem('jarvis-live-pulse:tab', id); } return id; } catch { return String(Math.random()); } }

const copy = {
  'zh-Hant': { title: 'Near-live 研究脈衝', desc: '60 秒輪詢；Live activity 與 Verified Evidence 永久分離。', source: '來源', fetched: '取得時間', next: '下次輪詢', api: 'API 狀態', gap: 'ACTIVITY_GAP_POSSIBLE', empty: '目前沒有新的研究活動。' },
  en: { title: 'Near-live Research Pulse', desc: '60-second polling; live activity remains separate from verified evidence.', source: 'Source', fetched: 'Fetched', next: 'Next poll', api: 'API status', gap: 'ACTIVITY_GAP_POSSIBLE', empty: 'No new research activity is visible.' }
};

export default function LiveResearchPulse() {
  const { language, locale } = useLanguage();
  const l = copy[language] || copy.en;
  const [state, setState] = useState(() => jsonGet(CACHE_KEY) || { rows: [], fetchedAt: null, status: 'CACHED', source: 'local-cache', apiStatus: 'INIT', nextAt: null, gapPossible: false });
  const tabId = useRef(getTabId());
  const channel = useRef(null);
  const timer = useRef(null);
  const inFlight = useRef(false);

  const apply = (payload) => {
    setState(payload); jsonSet(CACHE_KEY, payload);
    channel.current?.postMessage({ type: 'payload', payload });
    window.dispatchEvent(new CustomEvent('jarvis:live-pulse-state', { detail: payload }));
  };
  const claim = () => {
    const now = Date.now(); const leader = jsonGet(LEADER_KEY);
    if (!leader || leader.expiresAt <= now || leader.id === tabId.current) jsonSet(LEADER_KEY, { id: tabId.current, expiresAt: now + LEASE_MS });
    const result = jsonGet(LEADER_KEY); return result?.id === tabId.current && result.expiresAt > now;
  };
  const schedule = (delay = POLL_MS) => { clearTimeout(timer.current); const nextAt = Date.now() + delay; setState((current) => ({ ...current, nextAt })); if (claim()) timer.current = setTimeout(poll, delay); };

  const deploymentFallback = async () => {
    try {
      const response = await fetch('/live-events.json', { cache: 'no-store' });
      if (!response.ok) return null;
      const body = await response.json(); const rows = normalizeGitHubEvents(body.events || [], WATCHED);
      return { rows, fetchedAt: body.fetchedAt || new Date().toISOString(), status: 'DEPLOYMENT_SNAPSHOT', source: 'build-fallback', apiStatus: body.error || 'FALLBACK', nextAt: Date.now() + POLL_MS, gapPossible: false };
    } catch { return null; }
  };

  async function poll() {
    if (inFlight.current || !claim()) return;
    if (document.visibilityState !== 'visible') { schedule(POLL_MS); return; }
    inFlight.current = true;
    try {
      const etag = localStorage.getItem(ETAG_KEY);
      let response = await fetch('/api/research-pulse', { headers: etag ? { 'If-None-Match': etag } : {} });
      if (response.status === 304) {
        const cached = jsonGet(CACHE_KEY); if (cached) apply({ ...cached, status: 'CACHED', source: 'same-origin-cache', apiStatus: '304 NOT MODIFIED', nextAt: Date.now() + POLL_MS });
      } else if (response.ok) {
        const body = await response.json(); const responseEtag = response.headers.get('etag'); if (responseEtag) localStorage.setItem(ETAG_KEY, responseEtag);
        const rows = normalizeGitHubEvents(body.events || [], WATCHED); const lastSeen = localStorage.getItem(LAST_EVENT_KEY); const rawIds = new Set((body.events || []).map((event) => String(event.id)));
        const gapPossible = Boolean(lastSeen && body.events?.length >= 100 && !rawIds.has(lastSeen));
        if (body.events?.[0]?.id) localStorage.setItem(LAST_EVENT_KEY, String(body.events[0].id));
        apply({ rows, fetchedAt: body.fetchedAt || new Date().toISOString(), status: 'LIVE', source: 'same-origin /api/research-pulse', apiStatus: '200', nextAt: Date.now() + POLL_MS, gapPossible });
      } else {
        throw new Error('same-origin ' + response.status);
      }
    } catch (error) {
      try {
        const response = await fetch('https://api.github.com/users/' + OWNER + '/events/public?per_page=100', { headers: { Accept: 'application/vnd.github+json' } });
        if (!response.ok) throw new Error('GitHub ' + response.status);
        const events = await response.json(); apply({ rows: normalizeGitHubEvents(events, WATCHED), fetchedAt: new Date().toISOString(), status: 'LIVE', source: 'GitHub public Events API', apiStatus: String(response.status), nextAt: Date.now() + POLL_MS, gapPossible: false });
      } catch {
        const fallback = await deploymentFallback();
        if (fallback) apply(fallback); else { const cached = jsonGet(CACHE_KEY); apply({ ...(cached || state), status: cached ? 'CACHED' : 'ERROR', source: cached ? 'local-cache' : 'unavailable', apiStatus: String(error), nextAt: Date.now() + POLL_MS }); }
      }
    } finally { inFlight.current = false; schedule(POLL_MS); }
  }

  useEffect(() => {
    channel.current = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL) : null;
    if (channel.current) channel.current.onmessage = (event) => { if (event.data?.type === 'payload') setState({ ...event.data.payload, status: event.data.payload.status === 'LIVE' ? 'SHARED' : event.data.payload.status }); };
    if (claim()) poll(); else channel.current?.postMessage({ type: 'state-request' });
    const onVisible = () => { if (document.visibilityState === 'visible' && claim()) poll(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearTimeout(timer.current); channel.current?.close(); document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  const time = (value) => value ? new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(value)) : '—';
  const rows = useMemo(() => state.rows?.slice(0, 6) || [], [state.rows]);
  return <section className="live-pulse-v2" aria-label={l.title}>
    <header><div><span>LIVE ACTIVITY ≠ VERIFIED EVIDENCE</span><h2>{l.title}</h2><p>{l.desc}</p></div><strong className={'live-state live-state-' + String(state.status).toLowerCase()}>{state.status}</strong></header>
    <div className="live-meta"><span>{l.source}: <strong>{state.source}</strong></span><span>{l.fetched}: <strong>{time(state.fetchedAt)}</strong></span><span>{l.next}: <strong>{time(state.nextAt)}</strong></span><span>{l.api}: <strong>{state.apiStatus}</strong></span></div>
    {state.gapPossible ? <div className="live-gap" role="status">{l.gap}</div> : null}
    <div className="live-rows">{rows.length ? rows.map((row) => <a key={row.repo + ':' + row.id + ':' + row.sha} href={row.url} target="_blank" rel="noreferrer"><span>{row.repo}</span><strong>{row.title}</strong><small>{time(row.createdAt)}</small></a>) : <p>{l.empty}</p>}</div>
  </section>;
}
''')

write("src/components/ControlPlaneMetaPanel.jsx", r'''
import { useEffect, useMemo, useRef, useState } from 'react';
import registry from '../../dashboard/state/registry/research-lineages.json';
import { useLanguage } from '../i18n.jsx';

function localized(value, language) { if (value == null) return '—'; if (typeof value === 'string') return value; return language === 'en' ? value.en : value.zh; }
function format(value, locale) { if (!value) return '—'; const date = new Date(value); if (Number.isNaN(date.getTime())) return value; return new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date); }

const text = {
  'zh-Hant': { eyebrow: 'RESEARCH CONTROL PLANE V2', title: '可重建的已驗證狀態', history: 'Verified History', audit: 'Since Last Verified Audit', visit: 'Since Your Last Visit', registry: 'Research Lineage Registry', policy: 'Watch Policy', snapshot: 'Snapshot', fresh: 'VERIFIED', stale: 'STALE VERIFIED SNAPSHOT', detail: 'Lineage 詳情', close: '關閉', current: 'CURRENT', latest: 'LATEST VERIFIED EVENT', refs: 'ACTIVE BRANCH / PR', gates: 'GATES', terminal: 'TERMINAL HISTORY', blockers: 'BLOCKERS', next: 'NEXT TARGET', evidence: 'EVIDENCE', claim: 'CLAIM BOUNDARY', lastAudit: 'LAST AUDIT', live: 'LIVE ACTIVITY', none: '無', firstVisit: '這是此瀏覽器首次看到這份 snapshot。' },
  en: { eyebrow: 'RESEARCH CONTROL PLANE V2', title: 'Reconstructable verified state', history: 'Verified History', audit: 'Since Last Verified Audit', visit: 'Since Your Last Visit', registry: 'Research Lineage Registry', policy: 'Watch Policy', snapshot: 'Snapshot', fresh: 'VERIFIED', stale: 'STALE VERIFIED SNAPSHOT', detail: 'Lineage detail', close: 'Close', current: 'CURRENT', latest: 'LATEST VERIFIED EVENT', refs: 'ACTIVE BRANCH / PR', gates: 'GATES', terminal: 'TERMINAL HISTORY', blockers: 'BLOCKERS', next: 'NEXT TARGET', evidence: 'EVIDENCE', claim: 'CLAIM BOUNDARY', lastAudit: 'LAST AUDIT', live: 'LIVE ACTIVITY', none: 'None', firstVisit: 'This is the first time this browser has seen this snapshot.' }
};

export default function ControlPlaneMetaPanel() {
  const { language, locale, snapshot } = useLanguage(); const l = text[language] || text.en;
  const [selected, setSelected] = useState(null); const [live, setLive] = useState(null); const dialogRef = useRef(null); const triggerRef = useRef(null);
  const seenKey = 'jarvis-control-plane:lastSeenSnapshotId'; const previousSeen = (() => { try { return localStorage.getItem(seenKey); } catch { return null; } })();
  const stale = Date.now() - Date.parse(snapshot.verifiedAt) > (snapshot.controlPlane?.staleAfterHours || 2) * 3600000;
  useEffect(() => { try { localStorage.setItem(seenKey, snapshot.snapshotId); } catch {} }, [snapshot.snapshotId]);
  useEffect(() => { const handler = (event) => setLive(event.detail); window.addEventListener('jarvis:live-pulse-state', handler); return () => window.removeEventListener('jarvis:live-pulse-state', handler); }, []);
  useEffect(() => { if (!selected) return; const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; setTimeout(() => dialogRef.current?.querySelector('button')?.focus(), 0); const key = (event) => { if (event.key === 'Escape') setSelected(null); if (event.key !== 'Tab') return; const focusable = [...(dialogRef.current?.querySelectorAll('button,a[href]') || [])]; if (!focusable.length) return; if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); } }; window.addEventListener('keydown', key); return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', key); setTimeout(() => triggerRef.current?.focus(), 0); }; }, [selected]);
  const lineage = selected ? registry.lineages.find((item) => item.id === selected) : null;
  const line = useMemo(() => { if (!lineage) return null; if (lineage.id === 'program-control') return snapshot.researchLines?.find((item) => item.id === 'program-integration'); if (lineage.id === 'pda') return snapshot.researchLines?.find((item) => item.id === 'pda-lineage'); if (lineage.id === 'pare') return snapshot.researchLines?.find((item) => item.id === 'pare-lineage'); if (lineage.id === 'pse-clean-integrity') return snapshot.researchLines?.find((item) => item.id === 'pse-clean-lineage'); return snapshot.researchLines?.find((item) => item.id === 'pse-lineage'); }, [lineage, snapshot]);
  const gates = lineage ? (snapshot.gates || []).filter((gate) => gate.track === lineage.track) : [];
  const blockers = lineage ? (snapshot.blockers || []).filter((item) => String(item.source || '').includes(lineage.track) || String(item.title || '').toLowerCase().includes(lineage.repo.split('-')[0])) : [];
  const latestHistory = line?.history?.at(-1);
  const sinceVisit = previousSeen && previousSeen !== snapshot.snapshotId ? snapshot.controlPlane?.changesSincePrevious || [] : [];
  return <section className="control-plane-v2" id="verified-history">
    <header className="control-plane-head"><div><span>{l.eyebrow}</span><h2>{l.title}</h2></div><strong className={stale ? 'is-stale' : 'is-fresh'}>{stale ? l.stale : l.fresh}</strong></header>
    <div className="control-plane-identities"><div><span>{l.snapshot}</span><strong>{snapshot.snapshotId}</strong><small>{snapshot.contentHash}</small></div><div><span>{l.policy}</span><strong>v{snapshot.controlPlane?.watchPolicyVersion}</strong><small>{snapshot.controlPlane?.watchPolicyHash}</small></div><div><span>{l.registry}</span><strong>{snapshot.controlPlane?.registryVersion}</strong><small>{registry.lineages.length} lineages</small></div></div>
    <div className="control-plane-columns"><article><h3>{l.audit}</h3>{(snapshot.controlPlane?.changesSincePrevious || []).map((change, index) => <p key={index}><span aria-hidden="true">{change.type === 'terminal' ? '×' : change.type === 'lineage' ? '+' : '↻'}</span>{localized(change, language)}</p>)}</article><article><h3>{l.visit}</h3>{sinceVisit.length ? sinceVisit.map((change, index) => <p key={index}><span aria-hidden="true">+</span>{localized(change, language)}</p>) : <p>{l.firstVisit}</p>}</article></div>
    <div className="verified-history-list"><h3>{l.history}</h3>{(snapshot.controlPlane?.history || []).map((item) => <div key={item.snapshotId}><strong>{item.snapshotId}</strong><span>{format(item.verifiedAt, locale)}</span><code>{String(item.sourceUmbrellaSHA).slice(0, 12)}</code><small>{item.auditId}</small></div>)}</div>
    <div className="registry-grid"><h3>{l.registry}</h3>{registry.lineages.map((item) => <button key={item.id} ref={selected === item.id ? triggerRef : null} type="button" onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(item.id); }}><span>{item.track} · {item.role}</span><strong>{item.repo}</strong><small>{item.watchState} · {item.admissibility}</small></button>)}</div>
    {lineage ? <div className="lineage-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section ref={dialogRef} className="lineage-dialog" role="dialog" aria-modal="true" aria-labelledby="lineage-detail-title"><header><div><span>{l.detail}</span><h2 id="lineage-detail-title">{lineage.repo}</h2><p>{lineage.watchState} · {lineage.admissibility}</p></div><button type="button" onClick={() => setSelected(null)} aria-label={l.close}>×</button></header><div className="lineage-detail-grid">
      <article><h3>{l.current}</h3><p>{localized(line?.current, language)}</p></article><article><h3>{l.latest}</h3><p>{latestHistory ? localized(latestHistory, language) : l.none}</p><small>{format(latestHistory?.at || line?.latestAt, locale)}</small></article><article><h3>{l.refs}</h3>{lineage.activeRefs.map((ref, index) => <p key={index}><code>{ref.branch || ref.name}</code><br/><small>{ref.sha}</small></p>)}</article><article><h3>{l.gates}</h3>{gates.length ? gates.map((gate) => <p key={gate.gate}><strong>{gate.gate}</strong> · {gate.verdict}</p>) : <p>{l.none}</p>}</article><article><h3>{l.terminal}</h3>{line?.history?.filter((item) => ['failed','blocked'].includes(item.status)).slice(-4).map((item, index) => <p key={index}>{localized(item, language)}</p>) || <p>{l.none}</p>}</article><article><h3>{l.blockers}</h3>{blockers.length ? blockers.map((item, index) => <p key={index}>{item.title}</p>) : <p>{l.none}</p>}</article><article><h3>{l.next}</h3><p>{localized(line?.next, language)}</p></article><article><h3>{l.evidence}</h3><a href={lineage.sourceOfTruth} target="_blank" rel="noreferrer">{lineage.sourceOfTruth}</a></article><article><h3>{l.claim}</h3><p>{localized(lineage.claimBoundary, language)}</p></article><article><h3>{l.lastAudit}</h3><p>{format(snapshot.verifiedAt, locale)}</p><code>{snapshot.auditId}</code></article><article><h3>{l.live}</h3><p>{live?.status || '—'}</p><small>{live?.source || l.none}</small></article>
    </div></section></div> : null}
  </section>;
}
''')

write("src/control-plane.css", r'''
@layer tokens, base, layout, components, responsive, utilities;
@layer tokens {
  :root { --cp-space-1:.45rem; --cp-space-2:.75rem; --cp-space-3:1rem; --cp-space-4:1.4rem; --cp-radius:14px; --cp-border:rgba(255,255,255,.12); --cp-surface:rgba(13,22,31,.88); --cp-surface-2:rgba(255,255,255,.045); --cp-content-max:1180px; --cp-status-good:#72d7a5; --cp-status-warn:#ffcb66; --cp-status-bad:#ff8d8d; }
}
@layer layout {
  .control-plane-v2,.live-pulse-v2{width:min(var(--cp-content-max),calc(100% - 40px));margin:24px auto;box-sizing:border-box}
  .control-plane-identities,.control-plane-columns,.lineage-detail-grid{display:grid;gap:12px}.control-plane-identities{grid-template-columns:repeat(3,minmax(0,1fr))}.control-plane-columns{grid-template-columns:repeat(2,minmax(0,1fr))}.lineage-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.registry-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.registry-grid>h3{grid-column:1/-1}
}
@layer components {
  .control-plane-v2,.live-pulse-v2{border:1px solid var(--cp-border);border-radius:var(--cp-radius);background:var(--cp-surface);padding:20px;color:inherit}.control-plane-head,.live-pulse-v2>header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.control-plane-head span,.live-pulse-v2 header span{font-size:.72rem;letter-spacing:.12em;opacity:.68}.control-plane-head h2,.live-pulse-v2 h2{margin:.25rem 0}.is-fresh{color:var(--cp-status-good)}.is-stale,.live-gap{color:var(--cp-status-warn)}
  .control-plane-identities>div,.control-plane-columns>article,.lineage-detail-grid>article,.verified-history-list>div{background:var(--cp-surface-2);border:1px solid var(--cp-border);border-radius:12px;padding:12px;min-width:0}.control-plane-identities span,.lineage-detail-grid h3{display:block;font-size:.72rem;opacity:.68}.control-plane-identities strong,.control-plane-identities small,.lineage-detail-grid code{display:block;overflow-wrap:anywhere}.control-plane-identities small{font-family:ui-monospace,monospace;font-size:.68rem;opacity:.65;margin-top:5px}.control-plane-columns p{display:flex;gap:8px;margin:.55rem 0}.verified-history-list{margin-top:16px}.verified-history-list>div{display:grid;grid-template-columns:1.6fr 1fr .6fr 1.4fr;gap:8px;margin-top:8px;align-items:center}.registry-grid{margin-top:16px}.registry-grid button{text-align:left;border:1px solid var(--cp-border);border-radius:12px;background:var(--cp-surface-2);color:inherit;padding:12px;cursor:pointer}.registry-grid button span,.registry-grid button small{display:block;opacity:.66}.registry-grid button strong{display:block;margin:.3rem 0;overflow-wrap:anywhere}.registry-grid button:focus-visible,.lineage-dialog button:focus-visible{outline:2px solid currentColor;outline-offset:3px}
  .lineage-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.68);z-index:1200;display:grid;place-items:center;padding:20px}.lineage-dialog{width:min(980px,100%);max-height:90vh;overflow:auto;background:#0e1720;border:1px solid var(--cp-border);border-radius:16px;padding:18px}.lineage-dialog>header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.lineage-dialog>header button{font-size:1.8rem;background:transparent;border:0;color:inherit;cursor:pointer}.lineage-detail-grid a{overflow-wrap:anywhere}.control-plane-error{margin:20px auto;width:min(var(--cp-content-max),calc(100% - 40px));border:1px solid var(--cp-status-warn);padding:16px;border-radius:12px}
  .live-state{font-size:.76rem;white-space:nowrap}.live-state-live{color:var(--cp-status-good)}.live-state-error{color:var(--cp-status-bad)}.live-meta{display:flex;flex-wrap:wrap;gap:8px 16px;font-size:.74rem;opacity:.76;margin:12px 0}.live-rows{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.live-rows a{display:grid;gap:3px;padding:10px;border:1px solid var(--cp-border);border-radius:10px;color:inherit;text-decoration:none}.live-rows a span,.live-rows a small{font-size:.7rem;opacity:.65}.live-gap{font-size:.76rem;margin:8px 0}
}
@layer responsive {
  @media (max-width:900px){.control-plane-identities,.control-plane-columns,.lineage-detail-grid,.registry-grid,.live-rows{grid-template-columns:1fr}.verified-history-list>div{grid-template-columns:1fr}.control-plane-v2,.live-pulse-v2{width:min(100% - 24px,var(--cp-content-max));padding:15px}.registry-grid>h3{grid-column:auto}}
}
@layer utilities { @media (prefers-reduced-motion:reduce){.control-plane-v2 *,.live-pulse-v2 *{scroll-behavior:auto!important;transition:none!important;animation:none!important}} }
''')

roadmap_old = ROOT / "src/components/PolishedAchievementSystem.jsx"
roadmap_new = ROOT / "src/components/NorthStarRoadmap.jsx"
if roadmap_old.exists():
    content = roadmap_old.read_text(encoding="utf-8").replace("export default function PolishedAchievementSystem()", "export default function NorthStarRoadmap()")
    roadmap_new.write_text(content, encoding="utf-8")
    roadmap_old.unlink()
for legacy in (ROOT / "src/components/AchievementSystem.jsx", ROOT / "src/components/InteractiveAchievementSystem.jsx"):
    if legacy.exists(): legacy.unlink()

write("src/main.jsx", r'''
import React from 'react';
import ReactDOM from 'react-dom/client';
import './navigation-state.js';
import App from './App.jsx';
import AppErrorBoundary from './components/AppErrorBoundary.jsx';
import NorthStarRoadmap from './components/NorthStarRoadmap.jsx';
import LiveResearchPulse from './components/LiveResearchPulse.jsx';
import ControlPlaneMetaPanel from './components/ControlPlaneMetaPanel.jsx';
import { LanguageProvider } from './i18n.jsx';
import './styles.css';
import './achievements.css';
import './research-lines.css';
import './roadmap-interactions.css';
import './macbook.css';
import './i18n.css';
import './polish.css';
import './detail-fixes.css';
import './live-pulse.css';
import './control-plane.css';

const params = new URLSearchParams(window.location.search);
const queryLanguage = params.get('lang');
const savedLanguage = window.localStorage.getItem('jarvis-dashboard-language');
const initialLanguage = queryLanguage === 'en' || queryLanguage === 'en-US' ? 'en' : queryLanguage === 'zh-Hant' || queryLanguage === 'zh-TW' || queryLanguage === 'zh' ? 'zh-Hant' : savedLanguage === 'en' ? 'en' : 'zh-Hant';
document.documentElement.lang = initialLanguage;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><LanguageProvider>
    <AppErrorBoundary name="verified-dashboard" label="VERIFIED DASHBOARD DEGRADED"><App /></AppErrorBoundary>
    <AppErrorBoundary name="control-plane" label="CONTROL PLANE METADATA DEGRADED"><ControlPlaneMetaPanel /></AppErrorBoundary>
    <AppErrorBoundary name="live-pulse" label="DEGRADED LIVE DATA" description="Verified research dashboard remains available."><LiveResearchPulse /></AppErrorBoundary>
    <AppErrorBoundary name="north-star-roadmap" label="ROADMAP DEGRADED"><NorthStarRoadmap /></AppErrorBoundary>
  </LanguageProvider></React.StrictMode>,
);
''')

write("api/research-pulse.js", r'''
import { readFile } from 'node:fs/promises';
const registryUrl = new URL('../dashboard/state/registry/research-lineages.json', import.meta.url);
export default async function handler(req, res) {
  try {
    const registry = JSON.parse(await readFile(registryUrl, 'utf8'));
    const watched = new Set(registry.lineages.filter((lineage) => lineage.watchState === 'WATCHED').map((lineage) => lineage.owner + '/' + lineage.repo));
    const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'jarvis-research-control-plane' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = 'Bearer ' + process.env.GITHUB_TOKEN;
    if (req.headers['if-none-match']) headers['If-None-Match'] = req.headers['if-none-match'];
    const response = await fetch('https://api.github.com/users/' + registry.owner + '/events/public?per_page=100', { headers });
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    const etag = response.headers.get('etag'); if (etag) res.setHeader('ETag', etag);
    if (response.status === 304) return res.status(304).end();
    if (!response.ok) return res.status(response.status).json({ status: response.status === 403 || response.status === 429 ? 'RATE_LIMIT_PAUSED' : 'ERROR', fetchedAt: new Date().toISOString(), source: 'github-public-events', events: [], error: 'GitHub API ' + response.status });
    const events = (await response.json()).filter((event) => watched.has(event.repo?.name));
    return res.status(200).json({ status: 'LIVE', fetchedAt: new Date().toISOString(), source: process.env.GITHUB_TOKEN ? 'server-authenticated-github' : 'server-public-github', events });
  } catch (error) {
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
    return res.status(503).json({ status: 'ERROR', fetchedAt: new Date().toISOString(), source: 'research-pulse', events: [], error: error instanceof Error ? error.message : String(error) });
  }
}
''')

package = {
    "name": "persistent-personal-agent-dashboard",
    "private": True,
    "version": "0.2.0",
    "type": "module",
    "scripts": {
        "dev": "npm run compile:data && vite",
        "compile:data": "node scripts/compile-dashboard-state.mjs",
        "validate:data": "npm run compile:data && node scripts/check-watch-policy.mjs && node scripts/validate-dashboard-state.mjs",
        "discover:lineages": "node scripts/discover-research-lineages.mjs",
        "test:unit": "node --test tests/state.test.mjs",
        "build": "npm run compile:data && node scripts/capture-public-events.mjs && vite build && node scripts/check-bundle-budget.mjs",
        "preview": "vite preview",
        "test:e2e": "playwright test tests/dashboard.e2e.spec.js",
        "test:a11y": "playwright test tests/a11y.spec.js",
        "test:visual": "playwright test tests/visual.spec.js",
        "test": "npm run validate:data && npm run test:unit"
    },
    "dependencies": {"@vitejs/plugin-react": "6.0.5", "vite": "8.2.1", "react": "19.2.8", "react-dom": "19.2.8"},
    "devDependencies": {"@playwright/test": "^1.55.0", "@axe-core/playwright": "^4.10.2"}
}
write_json("package.json", package)

write("playwright.config.js", r'''
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 30_000, expect: { timeout: 7_000 }, workers: 1,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: true, timeout: 120_000 },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
});
''')

write("tests/state.test.mjs", r'''
import test from 'node:test';
import assert from 'node:assert/strict';
import { isLegalTransition, validateDag, isStale, looksLikeResearchLineage, dedupeEvents } from '../dashboard/state/lib/state-tools.mjs';
import { normalizeGitHubEvents } from '../src/lib/activity.js';

test('terminal negative cannot become PASS without a new lineage', () => { assert.equal(isLegalTransition('FAIL', 'PASS'), false); assert.equal(isLegalTransition('FAIL', 'PASS', { newLineage: true }), true); });
test('DAG catches cycles and orphans', () => { assert.deepEqual(validateDag([{ id: 'a', dependencyIds: [] }, { id: 'b', dependencyIds: ['a'] }]), { circular: false, orphan: [] }); assert.equal(validateDag([{ id: 'a', dependencyIds: ['b'] }, { id: 'b', dependencyIds: ['a'] }]).circular, true); assert.equal(validateDag([{ id: 'a', dependencyIds: ['missing'] }]).orphan.length, 1); });
test('stale-state logic is deterministic', () => { assert.equal(isStale('2026-08-16T10:00:00+08:00', 2, Date.parse('2026-08-16T11:00:00+08:00')), false); assert.equal(isStale('2026-08-16T08:00:00+08:00', 2, Date.parse('2026-08-16T11:00:01+08:00')), true); });
test('registry discovery identifies research family and candidate refs', () => { assert.equal(looksLikeResearchLineage('personal-agent-new-research'), true); assert.equal(looksLikeResearchLineage('ordinary-site', ['candidate-v12'], []), true); assert.equal(looksLikeResearchLineage('ordinary-site'), false); });
test('event normalization is registry-scoped and deduplicated', () => { const watched = new Set(['kodlbegiko/research']); const raw = [{ id:'1', type:'PushEvent', repo:{name:'kodlbegiko/research'}, payload:{ref:'refs/heads/research/x',head:'abc'}, created_at:'2026-08-16T00:00:00Z' }, { id:'2', type:'PushEvent', repo:{name:'kodlbegiko/other'}, payload:{ref:'refs/heads/main',head:'def'}, created_at:'2026-08-16T00:00:00Z' }]; assert.equal(normalizeGitHubEvents(raw, watched).length, 1); assert.equal(dedupeEvents([{repo:'x',id:'1',sha:'a'},{repo:'x',id:'1',sha:'a'}]).length, 1); });
''')

write("tests/dashboard.e2e.spec.js", r'''
import { test, expect } from '@playwright/test';
const viewports = [{ width:1470,height:956 },{ width:1512,height:982 },{ width:1280,height:800 },{ width:390,height:844 }];
async function mockPulse(page) { await page.route('**/api/research-pulse', (route) => route.fulfill({ status:200, headers:{'content-type':'application/json'}, body:JSON.stringify({ status:'LIVE', fetchedAt:new Date().toISOString(), source:'test', events:[] }) })); }
for (const viewport of viewports) for (const lang of ['zh-Hant','en']) test('responsive '+viewport.width+'x'+viewport.height+' '+lang, async ({ page }) => { await page.setViewportSize(viewport); await mockPulse(page); await page.goto('/?lang='+lang); await expect(page.locator('body')).toBeVisible(); const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); expect(overflow).toBeLessThanOrEqual(1); await expect(page.locator('.control-plane-v2')).toBeVisible(); await expect(page.locator('.live-pulse-v2')).toBeVisible(); });

test('roadmap keyboard dialog and focus return', async ({ page }) => { await mockPulse(page); await page.goto('/?lang=zh-Hant'); const launcher = page.locator('.roadmap-launcher'); await launcher.click(); const dialog = page.locator('[role="dialog"]').filter({ has: page.locator('#roadmap-title') }); await expect(dialog).toBeVisible(); await page.keyboard.press('Escape'); await expect(dialog).toBeHidden(); await expect(launcher).toBeFocused(); });

test('lineage detail is accessible and PSE clean stays pending', async ({ page }) => { await mockPulse(page); await page.goto('/?lang=en'); const button = page.getByRole('button', { name: /personal-state-engine-clean-integrity/i }); await button.click(); const dialog = page.getByRole('dialog', { name: /personal-state-engine-clean-integrity/i }); await expect(dialog).toContainText('PENDING'); await expect(dialog).toContainText('NATURALISTIC_EXTERNAL_VALIDITY_INFRASTRUCTURE_BLOCKED'); await page.keyboard.press('Escape'); await expect(dialog).toBeHidden(); });

test('GitHub/live failure never removes verified dashboard', async ({ page }) => { await page.route('**/api/research-pulse', (route) => route.fulfill({ status:503, body:'{}' })); await page.route('https://api.github.com/**', (route) => route.abort()); await page.route('**/live-events.json', (route) => route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({ fetchedAt:new Date().toISOString(),source:'test-fallback',events:[] }) })); await page.goto('/?lang=en'); await expect(page.locator('#root')).toBeVisible(); await expect(page.getByText(/Persistent Personal Agent/i).first()).toBeVisible(); });

test('gate and blocker content rails remain aligned', async ({ page }) => { await mockPulse(page); await page.setViewportSize({width:1470,height:956}); await page.goto('/?lang=zh-Hant'); const gates = await page.locator('#gates').boundingBox(); const blockers = await page.locator('#blockers').boundingBox(); if (gates && blockers) expect(Math.abs(gates.x - blockers.x)).toBeLessThanOrEqual(4); });
''')

write("tests/a11y.spec.js", r'''
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('critical accessibility violations are zero in zh/en', async ({ page }) => { for (const lang of ['zh-Hant','en']) { await page.route('**/api/research-pulse', (route) => route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({status:'LIVE',fetchedAt:new Date().toISOString(),events:[]}) })); await page.goto('/?lang='+lang); const result = await new AxeBuilder({ page }).analyze(); const critical = result.violations.filter((item) => item.impact === 'critical'); expect(critical, JSON.stringify(critical, null, 2)).toEqual([]); } });
''')

write("tests/visual.spec.js", r'''
import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
test('capture MacBook control-plane regression artifacts', async ({ page }) => { await mkdir('test-results/screenshots', { recursive:true }); await page.setViewportSize({width:1470,height:956}); await page.route('**/api/research-pulse', (route) => route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({status:'LIVE',fetchedAt:new Date().toISOString(),events:[]})})); for (const lang of ['zh-Hant','en']) { await page.goto('/?lang='+lang); await page.screenshot({path:'test-results/screenshots/overview-'+lang+'.png',fullPage:true}); const gate = await page.locator('#gates').boundingBox(); const blocker = await page.locator('#blockers').boundingBox(); if (gate && blocker) expect(Math.abs(gate.x-blocker.x)).toBeLessThanOrEqual(4); await page.locator('.roadmap-launcher').click(); await page.screenshot({path:'test-results/screenshots/roadmap-'+lang+'.png',fullPage:false}); await page.keyboard.press('Escape'); } });
''')

write(".github/workflows/dashboard-ci.yml", r'''
name: Dashboard Control Plane CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main, agent/dashboard-v2-control-plane]
    paths: ['src/**','api/**','dashboard/**','governance/**','scripts/**','tests/**','index.html','package.json','package-lock.json','playwright.config.js','.github/workflows/dashboard-ci.yml']
permissions:
  contents: read
jobs:
  control-plane:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: npm }
      - run: npm ci --no-audit --no-fund
      - run: npm run validate:data
      - run: npm run test:unit
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run test:a11y
      - run: npm run test:visual
      - name: Upload control-plane evidence
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: dashboard-control-plane-evidence
          path: |
            dist
            dashboard/state/verified/current.json
            dashboard/state/history
            dashboard/state/diffs
            test-results
            playwright-report
            package-lock.json
          if-no-files-found: warn
          retention-days: 14
''')

write("docs/dashboard-v2/BASELINE.md", r'''
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

## Research scope at freeze

The baseline preserved RT-01 formal fail-closed history, RT-02 Gate-F and Candidate-v3–v8 negative terminal evidence, PARE v0.3 benchmark-specific evidence, all blockers/claims/timeline nodes, and the existing North Star UI. No child research evidence was edited for this migration.

## Newly audited but not baseline-promoted

`personal-state-engine-clean-integrity` Draft PR #1 is `NATURALISTIC_EXTERNAL_VALIDITY_INFRASTRUCTURE_BLOCKED`; EV-B and EV-C were not executed and integrity PASS is not a performance PASS. It enters v2 as WATCHED/PENDING only.

PDA Candidate-v9 Draft PR #23 is a terminal development FAIL. The exact terminal artifact at `gate_recovery_v9/development_terminal.json` records H1 DEV-OOD macro-F1 0.577159, ACT recall 0.236667, fail-fast H2–H13 not executed, and protected evaluation not eligible/not executed.
''')

write("docs/dashboard-v2/DATA_MODEL.md", r'''
# Dashboard v2 Data Model

The browser reads exactly one compiled verified snapshot: `dashboard/state/verified/current.json`. The build/audit compiler reconstructs it deterministically from the frozen migration baseline, admitted terminal events, the lineage registry, and the versioned watch policy. Browser imports never mutate canonical research state.

Snapshot identity includes `schemaVersion`, `snapshotId`, `verifiedAt`, `auditId`, `auditPolicyVersion`, `auditPolicyHash`, `sourceUmbrellaSHA`, `sourceRepositories`, `previousSnapshotId`, and reproducible `contentHash`.

Completed and failed roadmap nodes carry `evidenceRefs` with repository/ref/path/hash metadata where available. Historical URL-only evidence is normalized as a traceable reference without inventing unavailable artifact hashes.
''')

write("docs/dashboard-v2/LIVE_VS_VERIFIED.md", r'''
# Live vs Verified

`LIVE`, `SHARED`, `CACHED`, `DEPLOYMENT_SNAPSHOT`, `RATE_LIMIT_PAUSED`, `STALE`, and `ERROR` are transport/freshness states only. They never change a research gate.

The preferred path is browser → same-origin `/api/research-pulse` → GitHub. The function keeps any optional GitHub token server-side, uses CDN cache headers and ETag conditional requests, and filters using the single lineage registry. Client fallback is the public GitHub events endpoint, then the build-time `live-events.json`, then local cache.

GitHub public Events is near-live rather than guaranteed real-time. If a previous event disappears while the 100-event window is full, the UI reports `ACTIVITY_GAP_POSSIBLE` rather than claiming completeness.
''')

write("docs/dashboard-v2/RESEARCH_REGISTRY.md", r'''
# Research Registry

`dashboard/state/registry/research-lineages.json` is the only repository watch source for Dashboard v2. It records owner/repo identity, track, role, watch state, admissibility, active refs, supersession, source of truth, and bilingual claim boundary.

Discovery is deliberately fail-closed. `npm run discover:lineages` may identify new repositories, `research/*` branches, `candidate-*` refs, or Draft PRs, but discovery emits `UNREGISTERED_RESEARCH_LINEAGE / PENDING_AUDIT`; it does not auto-admit or advance umbrella maturity.
''')

write("docs/dashboard-v2/TESTING.md", r'''
# Dashboard v2 Testing

CI runs deterministic data compilation, watch-policy drift checks, state validation, Node unit tests, production build and bundle budgets, Playwright responsive E2E at 1470×956 / 1512×982 / 1280×800 / 390×844 in zh-Hant and English, keyboard/dialog checks, live-failure fallback checks, critical accessibility scanning with axe, geometry assertions, and screenshot artifact capture.

`npm run validate:data` fails on duplicate lineage/node IDs, missing completed/failed evidence references, illegal terminal transitions, unknown tracks, orphan/cyclic structural dependencies, control-plane zh/en key drift, incomplete registry source coverage, or non-reproducible snapshot hash.
''')

write("docs/dashboard-v2/OPERATIONS.md", r'''
# Dashboard v2 Operations

1. Keep child research repositories read-only from the umbrella workflow.
2. Run discovery/audit against the registry and versioned watch policy.
3. Admit only traceable terminal/frozen/admissible evidence.
4. Run `npm run validate:data && npm run test:unit && npm run build` before PR publication.
5. Preserve each substantive verified snapshot in `dashboard/state/history/` and its diff in `dashboard/state/diffs/`.
6. Merge only with clean CI. Production must be built from exact `main`; the compiler reads `VERCEL_GIT_COMMIT_SHA` or `GITHUB_SHA` for visible source identity.
7. If `EXPECTED_WATCH_POLICY_HASH` differs from the repository policy hash, `POLICY_DRIFT` fails closed.
''')

append_once("README.md", "## JARVIS Research Control Plane v2", r'''
## JARVIS Research Control Plane v2

The production dashboard now uses an evidence-first control-plane architecture: a single lineage registry, deterministic compiled verified snapshot, immutable history/diff artifacts, versioned watch policy, registry-driven near-live activity, legal-transition validation, responsive/accessibility regression tests, and exact source-SHA identity. See `docs/dashboard-v2/`.
''')
append_once("dashboard/README.md", "## Control Plane v2", r'''
## Control Plane v2

The dashboard no longer treats `researchState.js` plus browser-side overlays as canonical state. `scripts/compile-dashboard-state.mjs` creates `dashboard/state/verified/current.json` before Vite starts, while legacy files are retained only under `dashboard/state/migration/` as deterministic migration input. Live activity is registry-driven and explicitly non-verifying.
''')
append_once("ARCHITECTURE.md", "## Dashboard Research Control Plane v2", r'''
## Dashboard Research Control Plane v2

Canonical path: registry + watch policy + admitted evidence → deterministic compiler → immutable snapshot/history/diff → read-only React surfaces. The near-live GitHub pulse is a separate transport layer and cannot mutate verified scientific state. Invalid terminal-to-PASS transitions fail validation unless a new lineage or explicit supersession evidence is present.
''')

# Bootstrap workflow/script are removed by the successful generated commit.
for bootstrap in (ROOT / ".github/workflows/apply-dashboard-v2.yml", Path(__file__)):
    try:
        bootstrap.unlink()
    except FileNotFoundError:
        pass

print("Dashboard v2 patch staged")
