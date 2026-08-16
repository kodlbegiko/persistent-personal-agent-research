
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
