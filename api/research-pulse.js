
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
