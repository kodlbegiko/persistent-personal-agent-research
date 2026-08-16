import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sha256 } from '../dashboard/state/lib/state-tools.mjs';

const state = JSON.parse(await readFile('dashboard/state/verified/current.json', 'utf8'));
const registry = JSON.parse(await readFile('dashboard/state/registry/research-lineages.json', 'utf8'));

test('canonical snapshot exposes production acceptance identity fields', () => {
  assert.equal(state.schemaVersion, '2.0.0');
  assert.match(state.sourceUmbrellaSHA, /^[0-9a-f]{40}$/);
  assert.equal(state.registryVersion, registry.registryVersion);
  assert.equal(state.watchPolicyVersion, state.controlPlane.watchPolicyVersion);
  assert.equal(state.watchPolicyHash, state.controlPlane.watchPolicyHash);
  assert.match(state.watchPolicyHash, /^[0-9a-f]{64}$/);
});

test('PROGRAM_CONTROL source repository resolves to exact sourceUmbrellaSHA', () => {
  const program = registry.lineages.find((lineage) => lineage.role === 'PROGRAM_CONTROL');
  assert.ok(program);
  const repo = `${program.owner}/${program.repo}`;
  const source = state.sourceRepositories.find((item) => item.repo === repo);
  assert.ok(source);
  assert.equal(source.ref, program.defaultBranch || 'main');
  assert.equal(source.sha, state.sourceUmbrellaSHA);
});

test('content hash remains reproducible after source identity finalization', () => {
  const unsigned = structuredClone(state);
  delete unsigned.contentHash;
  assert.equal(state.contentHash, sha256(unsigned));
});
