
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
