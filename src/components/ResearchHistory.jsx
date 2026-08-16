import { useMemo, useState } from 'react';
import { useLanguage } from '../i18n.jsx';

const STATUS_ORDER = ['complete', 'failed', 'blocked', 'current'];

function formatEvidenceTime(value, precision, locale) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(precision === 'time' ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
  }).format(date);
}

function copyFor(language) {
  return language === 'en'
    ? {
        eyebrow: 'VERIFIED HISTORY',
        title: 'Research history & stage entry',
        desc: 'A chronological view of evidence-backed milestones. GitHub activity alone never advances this history.',
        latestPhase: 'Latest phase with verified evidence',
        latestEvent: 'Latest verified event',
        datedEvents: 'Dated evidence events',
        phaseMap: 'Program phases',
        phaseMapDesc: '“First verified event” marks when a phase first acquired admissible dated evidence; it does not mean the whole phase passed.',
        firstVerified: 'First verified event',
        latestVerified: 'Latest verified event',
        notEntered: 'No dated evidence yet',
        achieved: 'achieved',
        failed: 'failed',
        blocked: 'blocked',
        current: 'current',
        future: 'future',
        allTracks: 'All tracks',
        allOutcomes: 'All outcomes',
        completedOnly: 'Achieved',
        negativeOnly: 'Negative / blocked',
        timelineTitle: 'Evidence chronology',
        timelineDesc: 'Negative terminal evidence is kept in place instead of being overwritten by later attempts.',
        evidence: 'Open evidence',
        details: 'Evidence boundary',
        showAll: 'Show all history',
        showRecent: 'Show recent only',
        openRoadmap: 'Open full North Star roadmap',
        verifiedDate: 'verified date',
        terminalTime: 'terminal time',
        achievedTime: 'achieved time',
        noMatches: 'No dated evidence matches the current filters.',
        stageLabel: 'Phase',
        track: 'Track',
      }
    : {
        eyebrow: '已驗證歷史',
        title: '研究歷史與階段進入時間',
        desc: '依可採納 evidence 排出的時間軸。單純 GitHub push、PR 或 README 更新不會自動讓歷史進度升級。',
        latestPhase: '最近已有驗證證據的階段',
        latestEvent: '最近一筆已驗證事件',
        datedEvents: '有時間證據的事件',
        phaseMap: '總體階段地圖',
        phaseMapDesc: '「首次可驗證事件」代表該階段第一次出現可採納且有日期的 evidence，不代表整個階段已通過。',
        firstVerified: '首次可驗證事件',
        latestVerified: '最近可驗證事件',
        notEntered: '尚無有日期的證據',
        achieved: '已達成',
        failed: '未通過',
        blocked: '阻塞／無效',
        current: '目前目標',
        future: '尚未開始',
        allTracks: '全部研究線',
        allOutcomes: '全部結果',
        completedOnly: '只看達成',
        negativeOnly: '只看失敗／阻塞',
        timelineTitle: '證據時間軸',
        timelineDesc: '負面 terminal evidence 會永久保留，不會因後續 candidate 或新 branch 出現就被覆寫。',
        evidence: '開啟證據',
        details: '證據邊界',
        showAll: '顯示完整歷史',
        showRecent: '只顯示近期',
        openRoadmap: '開啟完整北極星路徑',
        verifiedDate: '可驗證日期',
        terminalTime: '終端時間',
        achievedTime: '達成時間',
        noMatches: '目前篩選條件下沒有有日期的 evidence。',
        stageLabel: '階段',
        track: '研究線',
      };
}

function statusLabel(status, copy) {
  if (status === 'complete') return copy.achieved;
  if (status === 'failed') return copy.failed;
  if (status === 'blocked') return copy.blocked;
  if (status === 'current') return copy.current;
  return copy.future;
}

function eventTime(node) {
  return node.achievedAt || node.terminalAt || null;
}

function eventTimeLabel(node, copy) {
  if (node.terminalAt) return copy.terminalTime;
  if (node.achievedAt) return node.datePrecision === 'date' ? copy.verifiedDate : copy.achievedTime;
  return copy.verifiedDate;
}

export default function ResearchHistory() {
  const { snapshot, locale, language } = useLanguage();
  const copy = copyFor(language);
  const timeline = snapshot.advancementTimeline;
  const [trackFilter, setTrackFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const events = useMemo(() => {
    if (!timeline?.phases) return [];
    return timeline.phases.flatMap((phase, phaseIndex) => phase.nodes.map((node) => ({
      ...node,
      phaseId: phase.id,
      phaseIndex,
      phaseLabel: phase.shortLabel,
      phaseTitle: phase.title,
      at: eventTime(node),
    }))).filter((node) => node.at).sort((a, b) => new Date(b.at) - new Date(a.at));
  }, [timeline]);

  const tracks = useMemo(() => [...new Set(events.map((event) => event.track).filter(Boolean))], [events]);

  const filteredEvents = useMemo(() => events.filter((event) => {
    if (trackFilter !== 'all' && event.track !== trackFilter) return false;
    if (outcomeFilter === 'complete' && event.status !== 'complete') return false;
    if (outcomeFilter === 'negative' && !['failed', 'blocked'].includes(event.status)) return false;
    return true;
  }), [events, trackFilter, outcomeFilter]);

  const visibleEvents = showAll ? filteredEvents : filteredEvents.slice(0, 12);

  const phaseStats = useMemo(() => (timeline?.phases || []).map((phase) => {
    const dated = phase.nodes.map((node) => ({ node, at: eventTime(node) })).filter((row) => row.at).sort((a, b) => new Date(a.at) - new Date(b.at));
    const counts = phase.nodes.reduce((acc, node) => {
      acc[node.status] = (acc[node.status] || 0) + 1;
      return acc;
    }, {});
    return {
      ...phase,
      firstAt: dated[0]?.at || null,
      firstPrecision: dated[0]?.node.datePrecision || 'date',
      latestAt: dated.at(-1)?.at || null,
      latestPrecision: dated.at(-1)?.node.datePrecision || 'date',
      counts,
    };
  }), [timeline]);

  const latestEvent = events[0] || null;
  const latestPhase = latestEvent ? phaseStats.find((phase) => phase.id === latestEvent.phaseId) : null;

  const openRoadmap = () => document.querySelector('.roadmap-launcher')?.click();

  if (!timeline?.phases?.length) return null;

  return (
    <section id="history" className="section-block research-history-section">
      <div className="section-heading history-heading">
        <div>
          <span className="history-eyebrow">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.desc}</p>
        </div>
        <button type="button" className="history-roadmap-button" onClick={openRoadmap}>{copy.openRoadmap}<span aria-hidden="true">↗</span></button>
      </div>

      <div className="history-summary-grid">
        <article className="history-summary-card">
          <span>{copy.latestPhase}</span>
          <strong>{latestPhase ? `${latestPhase.shortLabel} · ${latestPhase.title}` : '—'}</strong>
          <small>{latestEvent ? formatEvidenceTime(latestEvent.at, latestEvent.datePrecision, locale) : '—'}</small>
        </article>
        <article className="history-summary-card">
          <span>{copy.latestEvent}</span>
          <strong>{latestEvent?.title || '—'}</strong>
          <small>{latestEvent ? `${latestEvent.track} · ${statusLabel(latestEvent.status, copy)}` : '—'}</small>
        </article>
        <article className="history-summary-card">
          <span>{copy.datedEvents}</span>
          <strong>{events.length}</strong>
          <small>{timeline.rule}</small>
        </article>
      </div>

      <div className="history-phase-wrap">
        <div className="history-subheading"><div><h3>{copy.phaseMap}</h3><p>{copy.phaseMapDesc}</p></div></div>
        <div className="history-phase-grid" aria-label={copy.phaseMap}>
          {phaseStats.map((phase) => {
            const hasEvidence = Boolean(phase.firstAt);
            return (
              <article key={phase.id} className={`history-phase-card ${hasEvidence ? 'has-evidence' : 'is-future'}`}>
                <div className="history-phase-top"><span>{phase.shortLabel}</span><small>{copy.stageLabel} {phase.id.replace('phase-', '')}</small></div>
                <h4>{phase.title}</h4>
                <p>{phase.description}</p>
                <div className="history-phase-time">
                  <span>{hasEvidence ? copy.firstVerified : copy.notEntered}</span>
                  <strong>{hasEvidence ? formatEvidenceTime(phase.firstAt, phase.firstPrecision, locale) : '—'}</strong>
                  {phase.latestAt && phase.latestAt !== phase.firstAt ? <small>{copy.latestVerified}: {formatEvidenceTime(phase.latestAt, phase.latestPrecision, locale)}</small> : null}
                </div>
                <div className="history-phase-counts">
                  {STATUS_ORDER.map((status) => phase.counts[status] ? <span key={status} className={`history-count status-${status}`}>{statusLabel(status, copy)} {phase.counts[status]}</span> : null)}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="history-chronology">
        <div className="history-subheading history-chronology-head">
          <div><h3>{copy.timelineTitle}</h3><p>{copy.timelineDesc}</p></div>
          <div className="history-filters" aria-label={copy.timelineTitle}>
            <div className="history-filter-group">
              <button type="button" className={trackFilter === 'all' ? 'is-active' : ''} onClick={() => setTrackFilter('all')}>{copy.allTracks}</button>
              {tracks.map((track) => <button type="button" key={track} className={trackFilter === track ? 'is-active' : ''} onClick={() => setTrackFilter(track)}>{track}</button>)}
            </div>
            <div className="history-filter-group compact">
              <button type="button" className={outcomeFilter === 'all' ? 'is-active' : ''} onClick={() => setOutcomeFilter('all')}>{copy.allOutcomes}</button>
              <button type="button" className={outcomeFilter === 'complete' ? 'is-active' : ''} onClick={() => setOutcomeFilter('complete')}>{copy.completedOnly}</button>
              <button type="button" className={outcomeFilter === 'negative' ? 'is-active' : ''} onClick={() => setOutcomeFilter('negative')}>{copy.negativeOnly}</button>
            </div>
          </div>
        </div>

        <div className="history-event-list">
          {visibleEvents.length ? visibleEvents.map((event) => (
            <article className={`history-event status-${event.status}`} key={`${event.phaseId}-${event.id}-${event.at}`}>
              <div className="history-event-time">
                <time dateTime={event.at}>{formatEvidenceTime(event.at, event.datePrecision, locale)}</time>
                <span>{eventTimeLabel(event, copy)}</span>
              </div>
              <div className="history-event-rail" aria-hidden="true"><i /><span /></div>
              <div className="history-event-body">
                <div className="history-event-meta"><span>{event.phaseLabel}</span><span>{event.track}</span><span className={`history-outcome status-${event.status}`}>{statusLabel(event.status, copy)}</span></div>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <div className="history-event-actions">
                  {event.evidenceUrl ? <a href={event.evidenceUrl} target="_blank" rel="noreferrer">{copy.evidence}<span aria-hidden="true">↗</span></a> : null}
                  {event.note ? <details><summary>{copy.details}</summary><p>{event.note}</p></details> : null}
                </div>
              </div>
            </article>
          )) : <div className="history-empty">{copy.noMatches}</div>}
        </div>

        {filteredEvents.length > 12 ? <button type="button" className="history-show-more" onClick={() => setShowAll((value) => !value)}>{showAll ? copy.showRecent : `${copy.showAll} (${filteredEvents.length})`}</button> : null}
      </div>
    </section>
  );
}
