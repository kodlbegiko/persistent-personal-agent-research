
export function eventDedupKey(event) {
  return [event.repo || '', event.id || '', event.sha || event.ref || event.branch || ''].join(':');
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

export function normalizeGitHubEvents(events, watched) {
  const rows = [];
  for (const event of Array.isArray(events) ? events : []) {
    const repo = event.repo?.name;
    if (!repo || !watched.has(repo)) continue;
    const payload = event.payload || {};
    if (event.type === 'PushEvent') {
      const branch = String(payload.ref || '').replace('refs/heads/', '') || '—';
      rows.push({ id: event.id, kind: 'push', repo, branch, ref: payload.ref, sha: payload.head, title: 'Push → ' + branch, createdAt: event.created_at, url: payload.head ? 'https://github.com/' + repo + '/commit/' + payload.head : 'https://github.com/' + repo + '/tree/' + encodeURIComponent(branch) });
    } else if (event.type === 'PullRequestEvent') {
      const pr = payload.pull_request || {};
      rows.push({ id: event.id, kind: 'pr', repo, branch: pr.head?.ref || payload.ref || '—', ref: pr.head?.ref, sha: pr.head?.sha, title: 'PR #' + (pr.number || payload.number || '—') + ' · ' + (pr.title || payload.action || 'updated'), createdAt: event.created_at, url: pr.html_url || 'https://github.com/' + repo + '/pulls' });
    } else if (event.type === 'CreateEvent' && payload.ref_type === 'branch') {
      rows.push({ id: event.id, kind: 'branch', repo, branch: payload.ref || '—', ref: payload.ref, title: 'Branch → ' + (payload.ref || '—'), createdAt: event.created_at, url: 'https://github.com/' + repo + '/tree/' + encodeURIComponent(payload.ref || '') });
    }
  }
  return dedupeEvents(rows).sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0));
}
