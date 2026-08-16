
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
