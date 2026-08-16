import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../i18n.jsx';

const OWNER = 'kodlbegiko';
const API_URL = `https://api.github.com/users/${OWNER}/events/public?per_page=100`;
const FALLBACK_URL = './live-events.json';
const BASE_POLL_MS = 60_000;
const LEASE_MS = 75_000;
const CACHE_KEY = 'jarvis-live-pulse:v2:payload';
const LEADER_KEY = 'jarvis-live-pulse:v2:leader';
const CHANNEL_NAME = 'jarvis-live-pulse-v2';
const LOW_BUDGET_THRESHOLD = 2;
const WATCHED = new Set([
  'kodlbegiko/persistent-personal-agent-research',
  'kodlbegiko/personal-state-engine-research',
  'kodlbegiko/Proactivity-Decision-Algorithm',
  'kodlbegiko/personal-agent-recovery-engine',
]);

const labels = {
  'zh-Hant': {
    title: '研究分支即時脈衝',
    desc: '同一瀏覽器只由一個分頁每 60 秒讀取 GitHub 公開事件流；其他分頁共享結果。此訊號不會自動升級研究門檻。',
    live: 'LIVE 60s',
    verified: 'VERIFIED 1h',
    next: '下次',
    now: '剛剛',
    paused: 'API 暫停 · 顯示快取',
    cached: '部署快照',
    shared: '共享即時資料',
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
    desc: 'Only one tab per browser polls the public GitHub event stream every 60 seconds; other tabs share that result. This signal never auto-promotes a research gate.',
    live: 'LIVE 60s',
    verified: 'VERIFIED 1h',
    next: 'next',
    now: 'now',
    paused: 'API paused · cached data',
    cached: 'deployment snapshot',
    shared: 'shared live data',
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
          sha: payload.head?.slice(0, 7),
          title: `Push → ${branch}`,
          url: payload.head ? `https://github.com/${repo}/commit/${payload.head}` : `https://github.com/${repo}/tree/${encodeURIComponent(branch)}`,
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

function readJsonStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage is an optimization only.
  }
}

function getTabId() {
  try {
    const existing = sessionStorage.getItem('jarvis-live-pulse:tab-id');
    if (existing) return existing;
    const next = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    sessionStorage.setItem('jarvis-live-pulse:tab-id', next);
    return next;
  } catch {
    return `${Date.now()}-${Math.random()}`;
  }
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
  const [isLeader, setIsLeader] = useState(false);
  const [topMount, setTopMount] = useState(null);
  const [activityMount, setActivityMount] = useState(null);

  const tabId = useRef(getTabId());
  const inFlight = useRef(false);
  const timer = useRef(null);
  const leaderTimer = useRef(null);
  const channel = useRef(null);
  const stateRef = useRef({ rows: [], fetchedAt: null, remaining: null, resetAt: null, status: 'loading', nextAt: null });

  const applyPayload = (payload, sourceStatus = null) => {
    if (!payload) return;
    const nextRows = Array.isArray(payload.rows) ? payload.rows : stateRef.current.rows;
    const nextFetchedAt = payload.fetchedAt ?? stateRef.current.fetchedAt;
    const nextRemaining = payload.remaining ?? stateRef.current.remaining;
    const nextResetAt = payload.resetAt ?? stateRef.current.resetAt;
    const nextNextAt = payload.nextAt ?? stateRef.current.nextAt ?? Date.now() + BASE_POLL_MS;
    const nextStatus = sourceStatus || payload.status || stateRef.current.status;
    stateRef.current = {
      rows: nextRows,
      fetchedAt: nextFetchedAt,
      remaining: nextRemaining,
      resetAt: nextResetAt,
      status: nextStatus,
      nextAt: nextNextAt,
    };
    setRows(nextRows);
    setFetchedAt(nextFetchedAt);
    setRemaining(nextRemaining);
    setResetAt(nextResetAt);
    setNextAt(nextNextAt);
    setStatus(nextStatus);
    window.dispatchEvent(new CustomEvent('jarvis:live-pulse-state', { detail: { ...stateRef.current } }));
  };

  const persistAndShare = (payload) => {
    writeJsonStorage(CACHE_KEY, payload);
    channel.current?.postMessage({ type: 'payload', payload });
    applyPayload(payload);
  };

  const loadDeploymentFallback = async () => {
    try {
      const response = await fetch(FALLBACK_URL, { cache: 'no-store' });
      if (!response.ok) return false;
      const data = await response.json();
      const fallbackRows = normalizeEvents(data.events || []);
      if (!fallbackRows.length) return false;
      applyPayload({
        rows: fallbackRows,
        fetchedAt: data.fetchedAt ? new Date(data.fetchedAt).getTime() : Date.now(),
        nextAt: Date.now() + BASE_POLL_MS,
      }, 'fallback');
      return true;
    } catch {
      return false;
    }
  };

  const hasLeadership = () => {
    const leader = readJsonStorage(LEADER_KEY);
    return leader?.id === tabId.current && Number(leader.expiresAt) > Date.now();
  };

  const claimLeadership = () => {
    const current = readJsonStorage(LEADER_KEY);
    const nowMs = Date.now();
    if (!current || Number(current.expiresAt) <= nowMs || current.id === tabId.current) {
      writeJsonStorage(LEADER_KEY, { id: tabId.current, expiresAt: nowMs + LEASE_MS });
    }
    const won = hasLeadership();
    setIsLeader(won);
    return won;
  };

  const renewLeadership = () => {
    if (!hasLeadership()) return claimLeadership();
    writeJsonStorage(LEADER_KEY, { id: tabId.current, expiresAt: Date.now() + LEASE_MS });
    setIsLeader(true);
    return true;
  };

  const schedule = (delay = BASE_POLL_MS) => {
    window.clearTimeout(timer.current);
    const due = Date.now() + delay;
    setNextAt(due);
    stateRef.current.nextAt = due;
    if (hasLeadership()) {
      timer.current = window.setTimeout(() => poll(false), delay);
    }
  };

  const poll = async (manual = false) => {
    if (inFlight.current) return;
    if (!claimLeadership()) {
      channel.current?.postMessage({ type: manual ? 'refresh-request' : 'state-request' });
      return;
    }
    if (!manual && document.visibilityState !== 'visible') {
      applyPayload({ nextAt: Date.now() + BASE_POLL_MS }, 'hidden');
      schedule(BASE_POLL_MS);
      return;
    }

    const current = Date.now();
    const currentState = stateRef.current;
    if (!manual && currentState.resetAt && currentState.remaining !== null && currentState.remaining <= LOW_BUDGET_THRESHOLD && current < currentState.resetAt) {
      applyPayload({ nextAt: currentState.resetAt + 2_000 }, currentState.rows.length ? 'paused' : 'error');
      schedule(Math.max(BASE_POLL_MS, currentState.resetAt - current + 2_000));
      return;
    }

    inFlight.current = true;
    setStatus('loading');
    try {
      const response = await fetch(API_URL, {
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

      if (!response.ok) {
        const blocked = response.status === 403 || response.status === 429;
        const cached = readJsonStorage(CACHE_KEY);
        if (cached?.rows?.length) {
          applyPayload({
            ...cached,
            remaining: Number.isFinite(nextRemaining) ? nextRemaining : cached.remaining,
            resetAt: Number.isFinite(nextResetAt) ? nextResetAt : cached.resetAt,
            nextAt: Number.isFinite(nextResetAt) ? nextResetAt + 2_000 : Date.now() + 120_000,
          }, blocked ? 'paused' : 'stale');
        } else {
          const loadedFallback = await loadDeploymentFallback();
          if (!loadedFallback) setStatus('error');
        }
        schedule(Number.isFinite(nextResetAt) && nextResetAt > Date.now() ? Math.max(BASE_POLL_MS, nextResetAt - Date.now() + 2_000) : 120_000);
        return;
      }

      const events = await response.json();
      const serverFloor = Number(response.headers.get('x-poll-interval')) * 1000;
      const delay = Number.isFinite(serverFloor) && serverFloor > BASE_POLL_MS ? serverFloor : BASE_POLL_MS;
      const payload = {
        rows: normalizeEvents(events),
        fetchedAt: Date.now(),
        remaining: Number.isFinite(nextRemaining) ? nextRemaining : null,
        resetAt: Number.isFinite(nextResetAt) ? nextResetAt : null,
        status: 'live',
        nextAt: Date.now() + delay,
      };
      persistAndShare(payload);
      schedule(delay);
    } catch {
      const cached = readJsonStorage(CACHE_KEY);
      if (cached?.rows?.length) applyPayload({ ...cached, nextAt: Date.now() + 120_000 }, 'stale');
      else if (!(await loadDeploymentFallback())) setStatus('error');
      schedule(120_000);
    } finally {
      inFlight.current = false;
    }
  };

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

  useEffect(() => {
    const cached = readJsonStorage(CACHE_KEY);
    if (cached?.rows?.length) applyPayload(cached, Date.now() - (cached.fetchedAt || 0) < BASE_POLL_MS * 3 ? 'shared' : 'stale');
    else loadDeploymentFallback();

    if ('BroadcastChannel' in window) {
      channel.current = new BroadcastChannel(CHANNEL_NAME);
      channel.current.onmessage = (event) => {
        const message = event.data || {};
        if (message.type === 'payload') applyPayload(message.payload, message.payload?.status === 'live' ? 'shared' : null);
        if (message.type === 'state-request' && hasLeadership()) channel.current?.postMessage({ type: 'payload', payload: stateRef.current });
        if (message.type === 'refresh-request' && hasLeadership()) poll(true);
      };
    }

    const leader = claimLeadership();
    if (leader) {
      const age = Date.now() - (cached?.fetchedAt || 0);
      if (!cached?.rows?.length || age >= BASE_POLL_MS) poll(false);
      else schedule(Math.max(2_000, BASE_POLL_MS - age));
    } else {
      channel.current?.postMessage({ type: 'state-request' });
    }

    leaderTimer.current = window.setInterval(() => {
      const wasLeader = hasLeadership();
      const leaderNow = renewLeadership();
      if (!wasLeader && leaderNow) {
        const age = Date.now() - (stateRef.current.fetchedAt || 0);
        if (age >= BASE_POLL_MS) poll(false);
        else schedule(Math.max(2_000, BASE_POLL_MS - age));
      }
    }, 20_000);

    const tick = window.setInterval(() => setNow(Date.now()), 1_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && hasLeadership()) {
        const age = Date.now() - (stateRef.current.fetchedAt || 0);
        if (age >= BASE_POLL_MS) poll(false);
      }
    };
    const onRefresh = () => poll(true);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('jarvis:live-pulse-refresh', onRefresh);

    return () => {
      window.clearInterval(tick);
      window.clearInterval(leaderTimer.current);
      window.clearTimeout(timer.current);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('jarvis:live-pulse-refresh', onRefresh);
      channel.current?.close();
      if (hasLeadership()) {
        try { localStorage.removeItem(LEADER_KEY); } catch { /* noop */ }
      }
    };
    // Lifecycle is intentionally mounted once; live state is mirrored through refs/storage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const secondsLeft = Math.max(0, Math.ceil((nextAt - now) / 1000));
  const statusCopy = status === 'paused'
    ? l.paused
    : status === 'fallback'
      ? l.cached
      : status === 'stale'
        ? l.cached
        : status === 'hidden'
          ? l.hidden
          : status === 'shared'
            ? `${l.shared} · ${l.next} ${secondsLeft}s`
            : status === 'error'
              ? l.unavailable
              : `${l.next} ${secondsLeft}s`;

  const latestByRepo = useMemo(() => {
    const map = new Map();
    for (const row of rows) if (!map.has(row.repo)) map.set(row.repo, row);
    return map;
  }, [rows]);

  const top = topMount ? createPortal(
    <div className={`live-pulse-compact ${status}`} title={l.desc}>
      <span className="live-pulse-dot" />
      <span className="live-pulse-compact-copy"><strong>{status === 'live' || status === 'shared' || status === 'loading' ? l.live : l.cached}</strong><small>{statusCopy}</small></span>
      <span className="live-pulse-divider" />
      <span className="live-pulse-verified">{l.verified}</span>
    </div>,
    topMount,
  ) : null;

  const activity = activityMount ? createPortal(
    <section className="live-research-pulse" aria-label={l.title}>
      <header className="live-pulse-header">
        <div>
          <div className="live-pulse-title"><span className="live-pulse-dot" /><strong>{l.title}</strong><span className={`live-pulse-tag ${status}`}>{status === 'live' || status === 'shared' || status === 'loading' ? l.live : l.cached}</span></div>
          <p>{l.desc}</p>
        </div>
        <div className="live-pulse-meta">
          <span>{isLeader ? 'LEADER' : 'SHARED'}</span>
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
