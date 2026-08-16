
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
