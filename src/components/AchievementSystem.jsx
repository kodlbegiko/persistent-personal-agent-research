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

function TimelineNode({ node, index, t, locale }) {
  const statusMeta = getStatusMeta(t);
  const meta = statusMeta[node.status] || statusMeta.future;
  const achieved = node.status === 'complete';
  const terminal = node.status === 'failed';
  const timestamp = formatEvidenceTime(node.achievedAt || node.terminalAt, node.datePrecision, locale);

  return (
    <article className={`roadmap-node status-${node.status}`}>
      <div className="roadmap-node-rail" aria-hidden="true">
        <span className="roadmap-node-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="roadmap-node-dot">{meta.symbol}</span>
      </div>

      <div className="roadmap-node-card">
        <div className="roadmap-node-heading">
          <div className="roadmap-node-title-wrap">
            <div className="roadmap-node-kicker">
              <span>{node.track}</span>
              {node.requiredForMvj ? <span>{t('timeline.mvjRequired')}</span> : null}
            </div>
            <h3>{node.title}</h3>
            <p>{node.description}</p>
          </div>
          <span className={`roadmap-status status-${node.status}`}>{meta.label}</span>
        </div>

        <div className="roadmap-node-meta">
          {timestamp ? (
            <div className="roadmap-meta-block">
              <span>{achieved ? (node.datePrecision === 'date' ? t('timeline.verifiedDate') : t('timeline.achievedAt')) : terminal ? t('timeline.terminalAt') : t('timeline.time')}</span>
              <strong>{timestamp}</strong>
            </div>
          ) : (
            <div className="roadmap-meta-block">
              <span>{t('timeline.time')}</span>
              <strong>{node.status === 'current' ? t('timeline.inProgress') : t('timeline.notAchieved')}</strong>
            </div>
          )}

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
    </article>
  );
}

function PhaseSummary({ phase, t }) {
  const completed = phase.nodes.filter((node) => node.status === 'complete').length;
  const failed = phase.nodes.filter((node) => node.status === 'failed').length;
  const current = phase.nodes.some((node) => node.status === 'current');

  return (
    <div className={`roadmap-phase-chip ${current ? 'is-current' : ''}`}>
      <span>{phase.shortLabel}</span>
      <strong>{phase.title}</strong>
      <small>
        {t('timeline.phaseSummary', { done: completed, total: phase.nodes.length })}
        {failed ? ` · ${t('timeline.failedCount', { count: failed })}` : ''}
      </small>
    </div>
  );
}

export default function AchievementSystem() {
  const [open, setOpen] = useState(false);
  const { t, snapshot, locale, language } = useLanguage();
  const timeline = snapshot.advancementTimeline;

  const stats = useMemo(() => {
    const nodes = timeline.phases.flatMap((phase) => phase.nodes);
    return {
      total: nodes.length,
      completed: nodes.filter((node) => node.status === 'complete').length,
      failed: nodes.filter((node) => node.status === 'failed').length,
      blocked: nodes.filter((node) => node.status === 'blocked').length,
      current: nodes.find((node) => node.status === 'current'),
      lastCompleted: [...nodes]
        .filter((node) => node.status === 'complete' && node.achievedAt)
        .sort((a, b) => new Date(b.achievedAt) - new Date(a.achievedAt))[0],
    };
  }, [timeline]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

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

            <div className="roadmap-phase-strip" aria-label={t('timeline.phaseAria')}>
              {timeline.phases.map((phase) => <PhaseSummary key={phase.id} phase={phase} t={t} />)}
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
                  {Object.entries(getStatusMeta(t)).map(([status, meta]) => (
                    <span key={status}><i className={`status-${status}`} />{meta.label}</span>
                  ))}
                </div>

                <div className="roadmap-evidence-rule">
                  <strong>{t('timeline.ruleTitle')}</strong>
                  <p>{t('timeline.rule')}</p>
                </div>
              </aside>

              <div className="roadmap-scroll-region">
                {timeline.phases.map((phase) => (
                  <section className="roadmap-phase" key={phase.id}>
                    <header className="roadmap-phase-header">
                      <span>{phase.shortLabel}</span>
                      <div>
                        <h3>{phase.title}</h3>
                        <p>{phase.description}</p>
                      </div>
                    </header>
                    <div className="roadmap-nodes">
                      {phase.nodes.map((node, index) => <TimelineNode key={node.id} node={node} index={index} t={t} locale={locale} />)}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
