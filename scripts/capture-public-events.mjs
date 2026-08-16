import { mkdir, writeFile } from 'node:fs/promises';

const OWNER = 'kodlbegiko';
const url = `https://api.github.com/users/${OWNER}/events/public?per_page=100`;
const output = new URL('../public/live-events.json', import.meta.url);

const payload = {
  fetchedAt: new Date().toISOString(),
  source: 'build-fallback',
  events: [],
  error: null,
};

try {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'jarvis-research-dashboard-build',
    },
  });

  if (!response.ok) {
    payload.error = `GitHub API ${response.status}`;
  } else {
    payload.events = await response.json();
    payload.fetchedAt = new Date().toISOString();
  }
} catch (error) {
  payload.error = error instanceof Error ? error.message : String(error);
}

await mkdir(new URL('../public/', import.meta.url), { recursive: true });
await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

if (payload.error) {
  console.warn(`[live-events] fallback capture failed safely: ${payload.error}`);
} else {
  console.log(`[live-events] captured ${payload.events.length} public events`);
}
