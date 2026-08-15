const API = 'https://api.github.com';
const CACHE_PREFIX = 'jarvis-dashboard:v1:';
const CACHE_TTL_MS = 5 * 60 * 1000;

function cacheKey(path) {
  return `${CACHE_PREFIX}${path}`;
}

function readCache(path) {
  try {
    const raw = localStorage.getItem(cacheKey(path));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(path, data) {
  try {
    localStorage.setItem(cacheKey(path), JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Local storage is optional; never block the dashboard.
  }
}

async function githubGet(path, { force = false } = {}) {
  if (!force) {
    const cached = readCache(path);
    if (cached) return cached;
  }

  const response = await fetch(`${API}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    const error = new Error(`GitHub API ${response.status}`);
    error.rateLimit = { remaining, reset };
    throw error;
  }

  const data = await response.json();
  writeCache(path, data);
  return data;
}

export async function loadRepositoryLiveState(repository, { force = false } = {}) {
  const root = `/repos/${repository.owner}/${repository.repo}`;
  const [meta, commits, pulls, branches] = await Promise.all([
    githubGet(root, { force }),
    githubGet(`${root}/commits?per_page=4`, { force }),
    githubGet(`${root}/pulls?state=all&sort=updated&direction=desc&per_page=5`, { force }),
    githubGet(`${root}/branches?per_page=100`, { force }),
  ]);

  return {
    ...repository,
    meta,
    commits,
    pulls,
    branches,
  };
}

export async function loadProgramIssues(owner, repo, { force = false } = {}) {
  const rows = await githubGet(
    `/repos/${owner}/${repo}/issues?state=all&sort=updated&direction=desc&per_page=50`,
    { force },
  );
  return rows.filter((row) => !row.pull_request);
}

export async function loadAllLiveState(repositories, { force = false } = {}) {
  const settled = await Promise.allSettled(
    repositories.map((repository) => loadRepositoryLiveState(repository, { force })),
  );

  const repos = settled.map((result, index) => {
    if (result.status === 'fulfilled') return { ok: true, data: result.value };
    return {
      ok: false,
      data: repositories[index],
      error: result.reason?.message || 'GitHub API unavailable',
      rateLimit: result.reason?.rateLimit || null,
    };
  });

  const umbrella = repositories.find((item) => item.key === 'umbrella');
  let issues = [];
  let issuesError = null;
  if (umbrella) {
    try {
      issues = await loadProgramIssues(umbrella.owner, umbrella.repo, { force });
    } catch (error) {
      issuesError = error.message;
    }
  }

  return {
    repos,
    issues,
    issuesError,
    fetchedAt: new Date().toISOString(),
  };
}

export function clearDashboardCache() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // noop
  }
}
