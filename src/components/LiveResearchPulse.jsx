import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../i18n.jsx';

const OWNER = 'kodlbegiko';
const API_URL = `https://api.github.com/users/${OWNER}/events/public?per_page=100`;
const BASE_POLL_MS = 60_000;
const LOW_BUDGET_THRESHOLD = 12;
const WATCHED = new Set([
  'kodlbegiko/persistent-personal-agent-research',
  'kodlbegiko/personal-state-engine-research',
  'kodlbegiko/Proactivity-Decision-Algorithm',
  'kodlbegiko/personal-agent-recovery-engine',
]);

const labels = {
  'zh-Hant': {
    title: '研究分支即時脈衝',
    desc: '每 60 秒讀取 GitHub 公開事件流；顯示 branch / PR 活動，但不會自動升級研究門檻。',
    live: 'LIVE 60s',
    verified: 'VERIFIED 1h',
    next: '下次',
    ago: '前',
    now: '剛剛',
    paused: 'API 安全暫停',
    hidden: '頁面背景暫停',
    unavailable: '事件流暫時無法取得',
    noEvents: '目前沒有新的研究分支事件。',
    push: '推送',
    pr: 'PR',
    created: '建立分支',
    deleted: '刪除分支',
    branch: '分支',
    rate: 'API 配額',
    refresh: '立即刷新',
  },
  en: {
    title: 'Research branch live pulse',
    desc: 'Polls the public GitHub event stream every 60 seconds. Branch/PR activity is live signal only and never auto-promotes a research gate.',
    live: 'LIVE 60s',
    verified: 'VERIFIED 1h',
    next: 'next',
    ago: 'ago',
    now: 'now',
    paused: 'API safe pause',
    hidden: 'paused in background',
    unavailable: 'event stream temporarily unavailable',
    noEvents: 'No new research-branch events are visible right now.',
    push: 'push',
    pr: 'PR',
    created: 'branch created',
    deleted: 'branch deleted',
    branch: 'branch',
    rate: 'API budget',
    refresh: 'Refresh now',
  },
};

function shortRepo(fullName = '') {
  return fullName.split('/')[1] || fullName;
}

function branchFromRef(ref = '') {
  return ref.replace(/^refs\/heads\//, '') || '—';
}

function normalizeEvents(events) {
  const rows = [];
  for (const event of events || []) {
    const repo = event.repo?.name;
    if (!WATCHED.has(repo)) continue;
    const createdAt = event.created_at;
    const payload = event.payload || {};

    if (event.type === 'PushEvent') {
      const branch = branchFromRef(payload.ref);
      const commits = Array.isArray(payload.commits) ? payload.commits : [];
      if (commits.length) {
        for (const commit of commits.slice(-3).reverse()) {
          rows.push({
            id: `${event.id}-${commit.sha}`,
            kind: 'push',
            repo,
            branch,
            sha: commit.sha?.slice(0, 7),
            title: commit.message?.split('\n')[0] || `Push → ${branch}`,
            url: commit.sha ? `https://github.com/${repo}/commit/${commit.sha}` : `https://github.com/${repo}/tree/${encodeURIComponent(branch)}`,
            createdAt,
          });
        }
      } else {
        rows.push({
          id: event.id,
          kind: 'push',
          repo,
          branch,
          title: `Push → ${branch}`,
          url: `https://github.com/${repo}/tree/${encodeURIComponent(branch)}`,
          createdAt,
        });
      }
      continue;
    }

    if (event.type === 'PullRequestEvent') {
      const pr = payload.pull_request || {};
      rows.push({
        id: event.id,
        kind: 'pr',
        repo,
        branch: pr.head?.ref || payload.ref || '—',
        sha: pr.head?.sha?.slice(0, 7),
        title: `PR #${pr.number || payload.number || '—'} · ${pr.title || payload.action || 'updated'}`,
        meta: payload.action,
        url: pr.html_url || `https://github.com/${repo}/pulls`,
        createdAt,
      });
      continue;
    }

    if (event.type === 'CreateEvent' && payload.ref_type === 'branch') {
      rows.push({
        id: event.id,
        kind: 'created',
        repo,
        branch: payload.ref || '—',
        title: payload.ref || 'branch',
        url: `https://github.com/${repo}/tree/${encodeURIComponent(payload.ref || '')}`,
        createdAt,
      });
      continue;
    }

    if (event.type === 'DeleteEvent' && payload.ref_type === 'branch') {
      rows.push({
        id: event.id,
        kind: 'deleted',
        repo,
        branch: payload.ref || '—',
        title: payload.ref || 'branch',
        url: `https://github.com/${repo}/branches`,
        createdAt,
      });
    }
  }

  return rows
    .filter((row) => row.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 12);
}

function timeAgo(value, language, now) {
  if (!value) return '—';
  const seconds = Math.max(0, Math.floor((now - new Date(value).getTime()) / 1000));
  const zh = language === 'zh-Hant';
  if (seconds < 45) return labels[language].now;
  if (seconds < 3600) return zh ? `${Math.floor(seconds / 60)} 分鐘前` : `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return zh ? `${Math.floor(seconds / 3600)} 小時前` : `${Math.floor(seconds / 3600)}h ago`;
  return zh ? `${Math.floor(seconds / 86400)} 天前` : `${Math.floor(seconds / 86400)}d ago`;
}

function createMount(className, parent, before = null) {
  if (!parent) return null;
  const existing = parent.querySelector(`:scope > .${className}`);
  if (existing) return existing;
  const node = document.createElement('div');
  node.className = className;
  if (before) parent.insertBefore(node, before);
  else parent.prepend(node);
  return node;
}

export default function LiveResearchPulse() {
  const { language } = useLanguage();
  const l = labels[language] || labels.en;
  const [rows, setRows] = useState([]);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [nextAt, setNextAt] = useState(Date.now() + BASE_POLL_MS);
  const [now, setNow] = useState(Date.now());
  const [remaining, setRemaining] = useState(null);
  const [resetAt, setResetAt] = useState(null);
  const [status, setStatus] = useState('loading');
  const [topMount, setTopMount] = useState(null);
  const [activityMount, setActivityMount] = useState(null);
  const inFlight = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    const topbar = document.querySelector('.topbar-right');
    const refreshButton = topbar?.querySelector('.refresh-button') || null;
    const activityCard = document.querySelector('#activity .activity-card');
    const top = createMount('live-pulse-top-mount', topbar, refreshButton);
    const activity = createMount('live-pulse-activity-mount', activityCard);
    setTopMount(top);
    setActivityMount(activity);
    return () => {
      top?.remove();
      activity?.remove();
    };
  }, []);

  const schedule = (delay = BASE_POLL_MS) => {
    window.clearTimeout(timer.current);
    const due = Date.now() + delay;
    setNextAt(due);
    timer.current = window.setTimeout(() => poll(false), delay);
  };

  const poll = async (manual = false) => {
    if (inFlight.current) return;
    if (!manual && document.visibilityState !== 'visible') {
      setStatus('hidden');
      schedule(BASE_POLL_MS);
      return;
    }

    const current = Date.now();
    if (!manual && resetAt && remaining !== null && remaining <= LOW_BUDGET_THRESHOLD && current < resetAt) {
      setStatus('paused');
      schedule(Math.max(BASE_POLL_MS, resetAt - current + 2_000));
      return;
    }

    inFlight.current = true;
    setStatus('loading');
    try {
      const response = await fetch(`${API_URL}&_=${Math.floor(Date.now() / BASE_POLL_MS)}`, {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        cache: 'no-store',
      });

      const remainingHeader = response.headers.get('x-ratelimit-remaining');
      const resetHeader = response.headers.get('x-ratelimit-reset');
      const nextRemaining = remainingHeader === null ? null : Number(remainingHeader);
      const nextResetAt = resetHeader ? Number(resetHeader) * 1000 : null;
      setRemaining(Number.isFinite(nextRemaining) ? nextRemaining : null);
      setResetAt(Number.isFinite(nextResetAt) ? nextResetAt : null);

      if (!response.ok) throw new Error(`GitHub API ${response.status}`);
      const events = await response.json();
      setRows(normalizeEvents(events));
      setFetchedAt(Date.now());
      setStatus('live');

      if (Number.isFinite(nextRemaining) && nextRemaining <= LOW_BUDGET_THRESHOLD && Number.isFinite(nextResetAt)) {
        schedule(Math.max(BASE_POLL_MS, nextResetAt - Date.now() + 2_000));
      } else {
        const serverFloor = Number(response.headers.get('x-poll-interval')) * 1000;
        schedule(Number.isFinite(serverFloor) && serverFloor > BASE_POLL_MS ? serverFloor : BASE_POLL_MS);
      }
    } catch {
      setStatus('error');
      schedule(120_000);
    } finally {
      inFlight.current = false;
    }
  };

  useEffect(() => {
    poll(true);
    const tick = window.setInterval(() => setNow(Date.now()), 1_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && (!fetchedAt || Date.now() - fetchedAt >= BASE_POLL_MS)) poll(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(timer.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // Poll lifecycle is intentionally mounted once; state is managed internally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const secondsLeft = Math.max(0, Math.ceil((nextAt - now) / 1000));
  const statusCopy = status === 'paused' ? l.paused : status === 'hidden' ? l.hidden : status === 'error' ? l.unavailable : `${l.next} ${secondsLeft}s`;

  const latestByRepo = useMemo(() => {
    const map = new Map();
    for (const row of rows) if (!map.has(row.repo)) map.set(row.repo, row);
    return map;
  }, [rows]);

  const top = topMount ? createPortal(
    <div className={`live-pulse-compact ${status}`} title={l.desc}>
      <span className="live-pulse-dot" />
      <span className="live-pulse-compact-copy"><strong>{l.live}</strong><small>{statusCopy}</small></span>
      <span className="live-pulse-divider" />
      <span className="live-pulse-verified">{l.verified}</span>
    </div>,
    topMount,
  ) : null;

  const activity = activityMount ? createPortal(
    <section className="live-research-pulse" aria-label={l.title}>
      <header className="live-pulse-header">
        <div>
          <div className="live-pulse-title"><span className="live-pulse-dot" /><strong>{l.title}</strong><span className="live-pulse-tag">{l.live}</span></div>
          <p>{l.desc}</p>
        </div>
        <div className="live-pulse-meta">
          <span>{fetchedAt ? new Intl.DateTimeFormat(language === 'zh-Hant' ? 'zh-TW' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(fetchedAt) : '—'}</span>
          {remaining !== null && <span>{l.rate} {remaining}</span>}
          <button type="button" onClick={() => poll(true)} disabled={inFlight.current}>{l.refresh}</button>
        </div>
      </header>

      <div className="live-pulse-repo-strip">
        {[...WATCHED].map((repo) => {
          const latest = latestByRepo.get(repo);
          return (
            <div key={repo} className="live-pulse-repo-chip">
              <strong>{shortRepo(repo)}</strong>
              <span>{latest ? latest.branch : '—'}</span>
            </div>
          );
        })}
      </div>

      <div className="live-pulse-list">
        {rows.length ? rows.slice(0, 8).map((row) => (
          <a key={row.id} className={`live-pulse-row ${row.kind}`} href={row.url} target="_blank" rel="noreferrer">
            <span className="live-pulse-kind">{row.kind === 'pr' ? l.pr : row.kind === 'push' ? l.push : row.kind === 'created' ? l.created : l.deleted}</span>
            <span className="live-pulse-main">
              <strong>{row.title}</strong>
              <small>{shortRepo(row.repo)} · {l.branch} {row.branch}{row.sha ? ` · ${row.sha}` : ''}</small>
            </span>
            <time>{timeAgo(row.createdAt, language, now)}</time>
          </a>
        )) : <div className="live-pulse-empty">{status === 'error' ? l.unavailable : l.noEvents}</div>}
      </div>
    </section>,
    activityMount,
  ) : null;

  return <>{top}{activity}</>;
}
