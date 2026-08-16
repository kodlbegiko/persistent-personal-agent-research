
import { useEffect, useMemo, useRef, useState } from 'react';
import registry from '../../dashboard/state/registry/research-lineages.json';
import { normalizeGitHubEvents } from '../lib/activity.js';
import { useLanguage } from '../i18n.jsx';

const WATCHED = new Set(registry.lineages.filter((lineage) => lineage.watchState === 'WATCHED').map((lineage) => lineage.owner + '/' + lineage.repo));
const OWNER = registry.owner;
const POLL_MS = 60_000;
const CACHE_KEY = 'jarvis-live-pulse:v3';
const ETAG_KEY = 'jarvis-live-pulse:v3:etag';
const LAST_EVENT_KEY = 'jarvis-live-pulse:v3:last-event';
const LEADER_KEY = 'jarvis-live-pulse:v3:leader';
const CHANNEL = 'jarvis-live-pulse-v3';
const LEASE_MS = 75_000;

function jsonGet(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
function jsonSet(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
function getTabId() { try { let id = sessionStorage.getItem('jarvis-live-pulse:tab'); if (!id) { id = crypto.randomUUID?.() || String(Math.random()); sessionStorage.setItem('jarvis-live-pulse:tab', id); } return id; } catch { return String(Math.random()); } }

const copy = {
  'zh-Hant': { title: 'Near-live 研究脈衝', desc: '60 秒輪詢；Live activity 與 Verified Evidence 永久分離。', source: '來源', fetched: '取得時間', next: '下次輪詢', api: 'API 狀態', gap: 'ACTIVITY_GAP_POSSIBLE', empty: '目前沒有新的研究活動。' },
  en: { title: 'Near-live Research Pulse', desc: '60-second polling; live activity remains separate from verified evidence.', source: 'Source', fetched: 'Fetched', next: 'Next poll', api: 'API status', gap: 'ACTIVITY_GAP_POSSIBLE', empty: 'No new research activity is visible.' }
};

export default function LiveResearchPulse() {
  const { language, locale } = useLanguage();
  const l = copy[language] || copy.en;
  const [state, setState] = useState(() => jsonGet(CACHE_KEY) || { rows: [], fetchedAt: null, status: 'CACHED', source: 'local-cache', apiStatus: 'INIT', nextAt: null, gapPossible: false });
  const tabId = useRef(getTabId());
  const channel = useRef(null);
  const timer = useRef(null);
  const inFlight = useRef(false);

  const apply = (payload) => {
    setState(payload); jsonSet(CACHE_KEY, payload);
    channel.current?.postMessage({ type: 'payload', payload });
    window.dispatchEvent(new CustomEvent('jarvis:live-pulse-state', { detail: payload }));
  };
  const claim = () => {
    const now = Date.now(); const leader = jsonGet(LEADER_KEY);
    if (!leader || leader.expiresAt <= now || leader.id === tabId.current) jsonSet(LEADER_KEY, { id: tabId.current, expiresAt: now + LEASE_MS });
    const result = jsonGet(LEADER_KEY); return result?.id === tabId.current && result.expiresAt > now;
  };
  const schedule = (delay = POLL_MS) => { clearTimeout(timer.current); const nextAt = Date.now() + delay; setState((current) => ({ ...current, nextAt })); if (claim()) timer.current = setTimeout(poll, delay); };

  const deploymentFallback = async () => {
    try {
      const response = await fetch('/live-events.json', { cache: 'no-store' });
      if (!response.ok) return null;
      const body = await response.json(); const rows = normalizeGitHubEvents(body.events || [], WATCHED);
      return { rows, fetchedAt: body.fetchedAt || new Date().toISOString(), status: 'DEPLOYMENT_SNAPSHOT', source: 'build-fallback', apiStatus: body.error || 'FALLBACK', nextAt: Date.now() + POLL_MS, gapPossible: false };
    } catch { return null; }
  };

  async function poll() {
    if (inFlight.current || !claim()) return;
    if (document.visibilityState !== 'visible') { schedule(POLL_MS); return; }
    inFlight.current = true;
    try {
      const etag = localStorage.getItem(ETAG_KEY);
      let response = await fetch('/api/research-pulse', { headers: etag ? { 'If-None-Match': etag } : {} });
      if (response.status === 304) {
        const cached = jsonGet(CACHE_KEY); if (cached) apply({ ...cached, status: 'CACHED', source: 'same-origin-cache', apiStatus: '304 NOT MODIFIED', nextAt: Date.now() + POLL_MS });
      } else if (response.ok) {
        const body = await response.json(); const responseEtag = response.headers.get('etag'); if (responseEtag) localStorage.setItem(ETAG_KEY, responseEtag);
        const rows = normalizeGitHubEvents(body.events || [], WATCHED); const lastSeen = localStorage.getItem(LAST_EVENT_KEY); const rawIds = new Set((body.events || []).map((event) => String(event.id)));
        const gapPossible = Boolean(lastSeen && body.events?.length >= 100 && !rawIds.has(lastSeen));
        if (body.events?.[0]?.id) localStorage.setItem(LAST_EVENT_KEY, String(body.events[0].id));
        apply({ rows, fetchedAt: body.fetchedAt || new Date().toISOString(), status: 'LIVE', source: 'same-origin /api/research-pulse', apiStatus: '200', nextAt: Date.now() + POLL_MS, gapPossible });
      } else {
        throw new Error('same-origin ' + response.status);
      }
    } catch (error) {
      try {
        const response = await fetch('https://api.github.com/users/' + OWNER + '/events/public?per_page=100', { headers: { Accept: 'application/vnd.github+json' } });
        if (!response.ok) throw new Error('GitHub ' + response.status);
        const events = await response.json(); apply({ rows: normalizeGitHubEvents(events, WATCHED), fetchedAt: new Date().toISOString(), status: 'LIVE', source: 'GitHub public Events API', apiStatus: String(response.status), nextAt: Date.now() + POLL_MS, gapPossible: false });
      } catch {
        const fallback = await deploymentFallback();
        if (fallback) apply(fallback); else { const cached = jsonGet(CACHE_KEY); apply({ ...(cached || state), status: cached ? 'CACHED' : 'ERROR', source: cached ? 'local-cache' : 'unavailable', apiStatus: String(error), nextAt: Date.now() + POLL_MS }); }
      }
    } finally { inFlight.current = false; schedule(POLL_MS); }
  }

  useEffect(() => {
    channel.current = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL) : null;
    if (channel.current) channel.current.onmessage = (event) => { if (event.data?.type === 'payload') setState({ ...event.data.payload, status: event.data.payload.status === 'LIVE' ? 'SHARED' : event.data.payload.status }); };
    if (claim()) poll(); else channel.current?.postMessage({ type: 'state-request' });
    const onVisible = () => { if (document.visibilityState === 'visible' && claim()) poll(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearTimeout(timer.current); channel.current?.close(); document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  const time = (value) => value ? new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(value)) : '—';
  const rows = useMemo(() => state.rows?.slice(0, 6) || [], [state.rows]);
  return <section className="live-pulse-v2" aria-label={l.title}>
    <header><div><span>LIVE ACTIVITY ≠ VERIFIED EVIDENCE</span><h2>{l.title}</h2><p>{l.desc}</p></div><strong className={'live-state live-state-' + String(state.status).toLowerCase()}>{state.status}</strong></header>
    <div className="live-meta"><span>{l.source}: <strong>{state.source}</strong></span><span>{l.fetched}: <strong>{time(state.fetchedAt)}</strong></span><span>{l.next}: <strong>{time(state.nextAt)}</strong></span><span>{l.api}: <strong>{state.apiStatus}</strong></span></div>
    {state.gapPossible ? <div className="live-gap" role="status">{l.gap}</div> : null}
    <div className="live-rows">{rows.length ? rows.map((row) => <a key={row.repo + ':' + row.id + ':' + row.sha} href={row.url} target="_blank" rel="noreferrer"><span>{row.repo}</span><strong>{row.title}</strong><small>{time(row.createdAt)}</small></a>) : <p>{l.empty}</p>}</div>
  </section>;
}
