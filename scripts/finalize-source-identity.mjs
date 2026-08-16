import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sha256 } from '../dashboard/state/lib/state-tools.mjs';

const root = resolve('.');
const currentPath = resolve(root, 'dashboard/state/verified/current.json');
const registryPath = resolve(root, 'dashboard/state/registry/research-lineages.json');
const state = JSON.parse(await readFile(currentPath, 'utf8'));
const registry = JSON.parse(await readFile(registryPath, 'utf8'));

const fail = (message) => {
  console.error('SOURCE_IDENTITY_FINALIZATION_FAILED', message);
  process.exit(1);
};

if (!/^[0-9a-f]{40}$/.test(String(state.sourceUmbrellaSHA || ''))) {
  fail('sourceUmbrellaSHA must be an exact 40-character git SHA');
}

const program = registry.lineages.find((lineage) => lineage.role === 'PROGRAM_CONTROL');
if (!program) fail('PROGRAM_CONTROL lineage is missing from registry');

const programRepo = `${program.owner}/${program.repo}`;
const programSource = state.sourceRepositories?.find((source) => source.repo === programRepo);
if (!programSource) fail(`sourceRepositories is missing ${programRepo}`);

// PROGRAM_CONTROL is self-referential: a SHA stored inside the repository cannot
// permanently equal the commit that contains it. Resolve it at compile time from
// the trusted execution identity instead of copying the registry's static ref SHA.
programSource.ref = program.defaultBranch || 'main';
programSource.sha = state.sourceUmbrellaSHA;

const registryVersion = state.lineageRegistryVersion || state.controlPlane?.registryVersion || registry.registryVersion;
const watchPolicyVersion = state.controlPlane?.watchPolicyVersion || state.auditPolicyVersion;
const watchPolicyHash = state.controlPlane?.watchPolicyHash || state.auditPolicyHash;

if (!registryVersion || registryVersion !== registry.registryVersion) fail('registry version mismatch');
if (!watchPolicyVersion) fail('watch policy version is missing');
if (!/^[0-9a-f]{64}$/.test(String(watchPolicyHash || ''))) fail('watch policy hash is missing or invalid');
if (state.auditPolicyVersion && state.auditPolicyVersion !== watchPolicyVersion) fail('watch policy version aliases disagree');
if (state.auditPolicyHash && state.auditPolicyHash !== watchPolicyHash) fail('watch policy hash aliases disagree');

// Canonical top-level names required by production acceptance. Keep the older
// aliases for backward compatibility with the existing dashboard UI.
state.registryVersion = registryVersion;
state.watchPolicyVersion = watchPolicyVersion;
state.watchPolicyHash = watchPolicyHash;

const unsigned = structuredClone(state);
delete unsigned.contentHash;
state.contentHash = sha256(unsigned);

await writeFile(currentPath, JSON.stringify(state, null, 2) + '\n');
if (!state.snapshotId) fail('snapshotId is missing');
await writeFile(resolve(root, 'dashboard/state/history', `${state.snapshotId}.json`), JSON.stringify(state, null, 2) + '\n');

console.log('SOURCE_IDENTITY_FINALIZED', {
  snapshotId: state.snapshotId,
  sourceUmbrellaSHA: state.sourceUmbrellaSHA,
  registryVersion: state.registryVersion,
  watchPolicyVersion: state.watchPolicyVersion,
  watchPolicyHash: state.watchPolicyHash,
  contentHash: state.contentHash,
});
