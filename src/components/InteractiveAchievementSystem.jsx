import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../i18n.jsx';

function formatEvidenceTime(value, precision, locale) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(precision === 'time'
      ? { hour: '2-digit', minute: '2-digit', hour12: false }
      : {}),
  }).format(date);
}

function getStatusMeta(t) {
  return {
    complete: { label: t('timeline.achieved'), symbol: '✓' },
    current: { label: t('timeline.current'), symbol: '→' },
    blocked: { label: t('timeline.blocked'), symbol: '!' },
    failed: { label: t('timeline.failed'), symbol: '×' },
    future: { label: t('timeline.future'), symbol: '·' },
  };
}

function localText(value, language) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return language === 'en' ? value.en : value.zh;
}

function getLineCopy(language) {
  return language === 'en'
    ? {
        eyebrow: 'ACTIVE RESEARCH LINES',
        title: 'Progress by research lineage',
        desc: 'Select a line to focus the roadmap. Filters only change the view; they never change research evidence or maturity.',
        achieved: 'Achieved',
        failed: 'Failed',
        latest: 'Latest verified event',
        current: 'Current position',
        next: 'Next target',
        inProgress: 'In progress',
        focus: 'Focus path',
        focused: 'Focused',
        jumpNext: 'Jump to next target',
        explorer: 'ROADMAP EXPLORER',
        explorerTitle: 'Explore the path to the North Star',
        allLines: 'All lines',
        status: 'Status',
        all: 'All',
        mvjOnly: 'MVJ-required only',
        reset: 'Reset view',
        showing: 'Showing',
        nodes: 'nodes',
        noMatches: 'No roadmap nodes match these filters.',
        details: 'Details',
        hideDetails: 'Hide details',
        criticalPath: 'Jump to current critical path',
      }
    : {
        eyebrow: '目前研究主線',
        title: '每條研究線的實際進度',
        desc: '點選研究線即可聚焦整條路徑。所有篩選只改變畫面，不會修改研究 evidence 或成熟度。',
        achieved: '已達成',
        failed: '未通過',
        latest: '最近可驗證事件',
        current: '目前所在位置',
        next: '下一個目標',
        inProgress: '進行中',
        focus: '聚焦路徑',
        focused: '已聚焦',
        jumpNext: '跳到下一個目標',
        explorer: '路徑探索器',
        explorerTitle: '互動探索通往 North Star 的路徑',
        allLines: '全部研究線',
        status: '節點狀態',
        all: '全部',
        mvjOnly: '只看 MVJ 必要節點',
        reset: '重設視圖',
        showing: '目前顯示',
        nodes: '個節點',
        noMatches: '目前篩選條件下沒有符合的路徑節點。',
        details: '查看細節',
        hideDetails: '收合細節',
        criticalPath: '跳到目前關鍵路徑',
      };
}

const LINE_TARGETS = {
  'program-integration': 'integration-contract',
  'pse-lineage': 'pse-integrity-lineage',
  'pda-lineage': 'pda-recovery',
  'pare-lineage': 'action-verification',
};

function lineMatchesNode(lineId, node) {
  if (!lineId || lineId === 'all') return true;
  const track = String(node.track || '').toUpperCase();
  if (lineId === 'program-integration') {
    return track === 'PROGRAM' || track === 'INTEGRATION' || track === 'MVJ' || track === 'NORTH STAR';
  }
  if (lineId === 'pse-lineage') return track.includes('RT-01');
  if (lineId === 'pda-lineage') return track.includes('RT-02');
  if (lineId === 'pare-lineage') return track.includes('RT-03');
  return true;
}

function ResearchLineCard({ line, language, locale, copy, selected, onFocus, onJump }) {
  const latest = formatEvidenceTime(line.latestAt, line.latestPrecision, locale);
  return (
    <article className={`research-line-card line-${line.status} accent-${line.accent} ${selected ? 'is-focused' : ''}`}>
      <div className="research-line-head">
        <span className="research-line-code">{line.code}</span>
        <span className={`research-line-status status-${line.status}`}>{localText(line.statusText, language)}</span>
      </div>

      <h3>{localText(line.title, language)}</h3>
      <p className="research-line-summary">{localText(line.summary, language)}</p>

      <div className="research-line-stats">
        <div><span>{copy.achieved}</span><strong>{line.counts?.achieved ?? 0}</strong></div>
        <div><span>{copy.failed}</span><strong>{line.counts?.failed ?? 0}</strong></div>
        <div><span>{copy.latest}</span><strong>{latest || copy.inProgress}</strong></div>
      </div>

      <div className="research-line-current">
        <span>{copy.current}</span>
        <a href={line.current?.url} target="_blank" rel="noreferrer">
          {localText(line.current, language)} <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="research-line-history" aria-label={`${localText(line.title, language)} history`}>
        {line.history?.map((event, index) => {
          const timestamp = formatEvidenceTime(event.at, event.precision, locale);
          return (
            <a key={`${line.id}-${index}`} className={`research-history-row status-${event.status}`} href={event.url} target="_blank" rel="noreferrer">
              <span className="research-history-symbol">{event.status === 'complete' ? '✓' : event.status === 'failed' ? '×' : event.status === 'blocked' ? '!' : '→'}</span>
              <span className="research-history-copy"><strong>{localText(event, language)}</strong><small>{timestamp || copy.inProgress}</small></span>
              <span aria-hidden="true">↗</span>
            </a>
          );
        })}
      </div>

      <div className="research-line-next">
        <span>{copy.next}</span>
        <strong>{localText(line.next, language)}</strong>
      </div>

      <div className="research-line-actions">
        <button type="button" className={`research-focus-button ${selected ? 'is-active' : ''}`} onClick={() => onFocus(line.id)} aria-pressed={selected}>
          <span aria-hidden="true">◎</span>{selected ? copy.focused : copy.focus}
        </button>
        <button type="button" className="research-jump-button" onClick={() => onJump(line.id)}>
          {copy.jumpNext}<span aria-hidden="true">↓</span>
        </button>
      </div>
    </article>
  );
}

function TimelineNode({ node, index, t, locale, copy }) {
  const statusMeta = getStatusMeta(t);
  const meta = statusMeta[node.status] || statusMeta.future;
  const achieved = node.status === 'complete';
  const terminal = node.status === 'failed';
  const timestamp = formatEvidenceTime(node.achievedAt || node.terminalAt, node.datePrecision, locale);
  const [expanded, setExpanded] = useState(node.status === 'current' || node.status === 'failed');

  return (
    <article className={`roadmap-node status-${node.status}`} id={`roadmap-node-${node.id}`}>
      <div className="roadmap-node-rail" aria-hidden="true">
        <span className="roadmap-node-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="roadmap-node-dot">{meta.symbol}</span>
      </div>

      <div className={`roadmap-node-card ${expanded ? 'is-expanded' : 'is-collapsed'}`}>
        <div className="roadmap-node-heading">
          <div className="roadmap-node-title-wrap">
            <div className="roadmap-node-kicker">
              <span>{node.track}</span>
              {node.requiredForMvj ? <span>{t('timeline.mvjRequired')}</span> : null}
            </div>
            <h3>{node.title}</h3>
            <p>{node.description}</p>
          </div>
          <div className="roadmap-node-heading-actions">
            <span className={`roadmap-status status-${node.status}`}>{meta.label}</span>
            <button type="button" className="roadmap-detail-toggle" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-controls={`roadmap-details-${node.id}`}>
              {expanded ? copy.hideDetails : copy.details}<span aria-hidden="true">{expanded ? '−' : '+'}</span>
            </button>
          </div>
        </div>

        {timestamp ? (
          <div className="roadmap-inline-time">
            <span>{achieved ? (node.datePrecision === 'date' ? t('timeline.verifiedDate') : t('timeline.achievedAt')) : terminal ? t('timeline.terminalAt') : t('timeline.time')}</span>
            <strong>{timestamp}</strong>
          </div>
        ) : null}

        {expanded ? (
          <div id={`roadmap-details-${node.id}`} className="roadmap-node-expandable">
            <div className="roadmap-node-meta">
              {!timestamp ? (
                <div className="roadmap-meta-block">
                  <span>{t('timeline.time')}</span>
                  <strong>{node.status === 'current' ? t('timeline.inProgress') : t('timeline.notAchieved')}</strong>
                </div>
              ) : null}

              <div className="roadmap-meta-block roadmap-prereq">
                <span>{t('timeline.prereq')}</span>
                <strong>{node.dependsOn?.length ? node.dependsOn.join(' · ') : t('timeline.none')}</strong>
              </div>

              {node.evidenceUrl ? (
                <a className="roadmap-evidence-link" href={node.evidenceUrl} target="_blank" rel="noreferrer">
                  <span>{t('timeline.evidence')}</span>
                  <strong>{node.evidenceLabel}</strong>
                  <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <div className="roadmap-meta-block">
                  <span>{t('timeline.unlock')}</span>
                  <strong>{node.unlockCondition || t('timeline.waiting')}</strong>
                </div>
              )}
            </div>

            {node.note ? <div className={`roadmap-node-note status-${node.status}`}>{node.note}</div> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function PhaseSummary({ phase, t, onJump }) {
  const completed = phase.nodes.filter((node) => node.status === 'complete').length;
  const failed = phase.nodes.filter((node) => node.status === 'failed').length;
  const current = phase.nodes.some((node) => node.status === 'current');

  return (
    <button type="button" className={`roadmap-phase-chip ${current ? 'is-current' : ''}`} onClick={() => onJump(phase.id)}>
      <span>{phase.shortLabel}</span>
      <strong>{phase.title}</strong>
      <small>
        {t('timeline.phaseSummary', { done: completed, total: phase.nodes.length })}
        {failed ? ` · ${t('timeline.failedCount', { count: failed })}` : ''}
      </small>
    </button>
  );
}

export default function InteractiveAchievementSystem() {
  const [open, setOpen] = useState(false);
  const [lineFilter, setLineFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mvjOnly, setMvjOnly] = useState(false);
  const { t, snapshot, locale, language } = useLanguage();
  const timeline = snapshot.advancementTimeline;
  const lineCopy = getLineCopy(language);

  const allNodes = useMemo(() => timeline.phases.flatMap((phase) => phase.nodes), [timeline]);

  const stats = useMemo(() => ({
    total: allNodes.length,
    completed: allNodes.filter((node) => node.status === 'complete').length,
    failed: allNodes.filter((node) => node.status === 'failed').length,
    blocked: allNodes.filter((node) => node.status === 'blocked').length,
    current: allNodes.find((node) => node.status === 'current'),
    lastCompleted: [...allNodes]
      .filter((node) => node.status === 'complete' && node.achievedAt)
      .sort((a, b) => new Date(b.achievedAt) - new Date(a.achievedAt))[0],
  }), [allNodes]);

  const filteredPhases = useMemo(() => timeline.phases
    .map((phase) => ({
      ...phase,
      nodes: phase.nodes.filter((node) => {
        if (!lineMatchesNode(lineFilter, node)) return false;
        if (statusFilter !== 'all' && node.status !== statusFilter) return false;
        if (mvjOnly && !node.requiredForMvj) return false;
        return true;
      }),
    }))
    .filter((phase) => phase.nodes.length > 0), [timeline, lineFilter, statusFilter, mvjOnly]);

  const visibleNodeCount = useMemo(() => filteredPhases.reduce((sum, phase) => sum + phase.nodes.length, 0), [filteredPhases]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const resetView = () => {
    setLineFilter('all');
    setStatusFilter('all');
    setMvjOnly(false);
  };

  const jumpToNode = (nodeId, lineId = null) => {
    if (lineId) setLineFilter(lineId);
    setStatusFilter('all');
    setMvjOnly(false);
    window.setTimeout(() => {
      document.getElementById(`roadmap-node-${nodeId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const focusLine = (lineId) => {
    setLineFilter((current) => current === lineId ? 'all' : lineId);
    setStatusFilter('all');
  };

  const jumpToLineTarget = (lineId) => {
    const target = LINE_TARGETS[lineId];
    if (target) jumpToNode(target, lineId);
  };

  const jumpToPhase = (phaseId) => {
    document.getElementById(`roadmap-phase-${phaseId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const statusOptions = ['all', 'complete', 'current', 'blocked', 'failed', 'future'];
  const statusMeta = getStatusMeta(t);

  return (
    <>
      <button className="roadmap-launcher" type="button" onClick={() => setOpen(true)} aria-label={t('timeline.openAria')}>
        <span className="roadmap-launcher-icon" aria-hidden="true">⌁</span>
        <span className="roadmap-launcher-copy">
          <strong>{t('timeline.launcher')}</strong>
          <small>
            {t('timeline.nodes', { done: stats.completed, total: stats.total })}
            {' · '}{t('timeline.next')} {stats.current?.issue ? `#${stats.current.issue}` : t('timeline.pending')}
          </small>
        </span>
        <span className="roadmap-launcher-arrow" aria-hidden="true">›</span>
      </button>

      {open ? (
        <div className="roadmap-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="roadmap-window" role="dialog" aria-modal="true" aria-labelledby="roadmap-title" data-language={language}>
            <header className="roadmap-header">
              <div>
                <span className="roadmap-eyebrow">{t('timeline.eyebrow')}</span>
                <h2 id="roadmap-title">{t('timeline.title')}</h2>
                <p>{t('timeline.intro')}</p>
              </div>
              <button className="roadmap-close" type="button" onClick={() => setOpen(false)} aria-label={t('timeline.close')}>×</button>
            </header>

            {snapshot.researchLines?.length ? (
              <section className="research-lines-panel">
                <div className="research-lines-heading">
                  <div>
                    <span>{lineCopy.eyebrow}</span>
                    <h3>{lineCopy.title}</h3>
                    <p>{lineCopy.desc}</p>
                  </div>
                </div>
                <div className="research-lines-grid">
                  {snapshot.researchLines.map((line) => (
                    <ResearchLineCard
                      key={line.id}
                      line={line}
                      language={language}
                      locale={locale}
                      copy={lineCopy}
                      selected={lineFilter === line.id}
                      onFocus={focusLine}
                      onJump={jumpToLineTarget}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="roadmap-explorer" aria-label={lineCopy.explorerTitle}>
              <div className="roadmap-explorer-head">
                <div><span>{lineCopy.explorer}</span><strong>{lineCopy.explorerTitle}</strong></div>
                <div className="roadmap-explorer-count" aria-live="polite">{lineCopy.showing} <strong>{visibleNodeCount}</strong> {lineCopy.nodes}</div>
              </div>

              <div className="roadmap-filter-row">
                <div className="roadmap-filter-group">
                  <span>{lineCopy.title}</span>
                  <div className="roadmap-filter-buttons">
                    <button type="button" className={lineFilter === 'all' ? 'is-active' : ''} onClick={() => setLineFilter('all')} aria-pressed={lineFilter === 'all'}>{lineCopy.allLines}</button>
                    {snapshot.researchLines?.map((line) => (
                      <button key={line.id} type="button" className={lineFilter === line.id ? 'is-active' : ''} onClick={() => setLineFilter(line.id)} aria-pressed={lineFilter === line.id}>{line.code}</button>
                    ))}
                  </div>
                </div>

                <div className="roadmap-filter-group">
                  <span>{lineCopy.status}</span>
                  <div className="roadmap-filter-buttons compact">
                    {statusOptions.map((status) => (
                      <button key={status} type="button" className={statusFilter === status ? 'is-active' : ''} onClick={() => setStatusFilter(status)} aria-pressed={statusFilter === status}>
                        {status === 'all' ? lineCopy.all : statusMeta[status]?.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="roadmap-filter-actions">
                  <button type="button" className={`roadmap-mvj-toggle ${mvjOnly ? 'is-active' : ''}`} onClick={() => setMvjOnly((value) => !value)} aria-pressed={mvjOnly}>★ {lineCopy.mvjOnly}</button>
                  <button type="button" className="roadmap-reset-button" onClick={resetView}>{lineCopy.reset}</button>
                </div>
              </div>
            </section>

            <div className="roadmap-phase-strip" aria-label={t('timeline.phaseAria')}>
              {timeline.phases.map((phase) => <PhaseSummary key={phase.id} phase={phase} t={t} onJump={jumpToPhase} />)}
            </div>

            <div className="roadmap-body">
              <aside className="roadmap-summary">
                <div className="roadmap-north-star">
                  <span>{t('timeline.northStar')}</span>
                  <strong>{snapshot.northStar.title}</strong>
                  <p>{snapshot.northStar.description}</p>
                </div>

                <div className="roadmap-summary-grid">
                  <div><span>{t('timeline.completed')}</span><strong>{stats.completed}</strong></div>
                  <div><span>{t('timeline.total')}</span><strong>{stats.total}</strong></div>
                  <div><span>{t('timeline.failedStat')}</span><strong>{stats.failed}</strong></div>
                  <div><span>{t('timeline.blockedStat')}</span><strong>{stats.blocked}</strong></div>
                </div>

                <div className="roadmap-current-card">
                  <span>{t('timeline.currentPosition')}</span>
                  <strong>{stats.current?.title || t('timeline.waitingNext')}</strong>
                  <p>{stats.current?.unlockCondition || stats.current?.description}</p>
                  <button type="button" className="roadmap-critical-jump" onClick={() => stats.current && jumpToNode(stats.current.id)}>{lineCopy.criticalPath} ↓</button>
                  {stats.current?.issue ? (
                    <a href={`https://github.com/kodlbegiko/persistent-personal-agent-research/issues/${stats.current.issue}`} target="_blank" rel="noreferrer">
                      Issue #{stats.current.issue} ↗
                    </a>
                  ) : null}
                </div>

                {stats.lastCompleted ? (
                  <div className="roadmap-last-completed">
                    <span>{t('timeline.recent')}</span>
                    <strong>{stats.lastCompleted.title}</strong>
                    <small>{formatEvidenceTime(stats.lastCompleted.achievedAt, stats.lastCompleted.datePrecision, locale)}</small>
                  </div>
                ) : null}

                <div className="roadmap-legend" aria-label={t('timeline.legendAria')}>
                  {Object.entries(statusMeta).map(([status, meta]) => (
                    <span key={status}><i className={`status-${status}`} />{meta.label}</span>
                  ))}
                </div>

                <div className="roadmap-evidence-rule">
                  <strong>{t('timeline.ruleTitle')}</strong>
                  <p>{t('timeline.rule')}</p>
                </div>
              </aside>

              <div className="roadmap-scroll-region">
                {filteredPhases.length ? filteredPhases.map((phase) => (
                  <section className="roadmap-phase" key={phase.id} id={`roadmap-phase-${phase.id}`}>
                    <header className="roadmap-phase-header">
                      <span>{phase.shortLabel}</span>
                      <div>
                        <h3>{phase.title}</h3>
                        <p>{phase.description}</p>
                      </div>
                    </header>
                    <div className="roadmap-nodes">
                      {phase.nodes.map((node, index) => <TimelineNode key={node.id} node={node} index={index} t={t} locale={locale} copy={lineCopy} />)}
                    </div>
                  </section>
                )) : (
                  <div className="roadmap-empty-filter" aria-live="polite">{lineCopy.noMatches}<button type="button" onClick={resetView}>{lineCopy.reset}</button></div>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
