
import test from 'node:test';
import assert from 'node:assert/strict';
import { isLegalTransition, validateDag, isStale, looksLikeResearchLineage, dedupeEvents } from '../dashboard/state/lib/state-tools.mjs';
import { normalizeGitHubEvents } from '../src/lib/activity.js';

test('terminal negative cannot become PASS without a new lineage', () => { assert.equal(isLegalTransition('FAIL', 'PASS'), false); assert.equal(isLegalTransition('FAIL', 'PASS', { newLineage: true }), true); });
test('DAG catches cycles and orphans', () => { assert.deepEqual(validateDag([{ id: 'a', dependencyIds: [] }, { id: 'b', dependencyIds: ['a'] }]), { circular: false, orphan: [] }); assert.equal(validateDag([{ id: 'a', dependencyIds: ['b'] }, { id: 'b', dependencyIds: ['a'] }]).circular, true); assert.equal(validateDag([{ id: 'a', dependencyIds: ['missing'] }]).orphan.length, 1); });
test('stale-state logic is deterministic', () => { assert.equal(isStale('2026-08-16T10:00:00+08:00', 2, Date.parse('2026-08-16T11:00:00+08:00')), false); assert.equal(isStale('2026-08-16T08:00:00+08:00', 2, Date.parse('2026-08-16T11:00:01+08:00')), true); });
test('registry discovery identifies research family and candidate refs', () => { assert.equal(looksLikeResearchLineage('personal-agent-new-research'), true); assert.equal(looksLikeResearchLineage('ordinary-site', ['candidate-v12'], []), true); assert.equal(looksLikeResearchLineage('ordinary-site'), false); });
test('event normalization is registry-scoped and deduplicated', () => { const watched = new Set(['kodlbegiko/research']); const raw = [{ id:'1', type:'PushEvent', repo:{name:'kodlbegiko/research'}, payload:{ref:'refs/heads/research/x',head:'abc'}, created_at:'2026-08-16T00:00:00Z' }, { id:'2', type:'PushEvent', repo:{name:'kodlbegiko/other'}, payload:{ref:'refs/heads/main',head:'def'}, created_at:'2026-08-16T00:00:00Z' }]; assert.equal(normalizeGitHubEvents(raw, watched).length, 1); assert.equal(dedupeEvents([{repo:'x',id:'1',sha:'a'},{repo:'x',id:'1',sha:'a'}]).length, 1); });

test('critical path dependency chain remains acyclic and explicit', () => {
  const nodes = [
    { id: 'mission-established', dependencyIds: [] },
    { id: 'pse-gate-e-scientific', dependencyIds: ['mission-established'] },
    { id: 'pda-gate-b', dependencyIds: ['mission-established'] },
    { id: 'pda-gate-c', dependencyIds: ['pda-gate-b'] },
    { id: 'pda-gate-d', dependencyIds: ['pda-gate-c'] },
    { id: 'pda-gate-e', dependencyIds: ['pda-gate-d'] },
    { id: 'integration-contract', dependencyIds: ['pse-gate-e-scientific', 'pda-gate-e'] },
  ];
  assert.deepEqual(validateDag(nodes), { circular: false, orphan: [] });
});
