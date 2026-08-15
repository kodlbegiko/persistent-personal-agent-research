import { useEffect, useMemo, useState } from 'react';
import { verifiedSnapshot } from '../data/researchState.js';

const statusMeta = {
  complete: { label: '已達成', symbol: '✓' },
  current: { label: '目前目標', symbol: '→' },
  blocked: { label: '阻塞', symbol: '!' },
  failed: { label: '未通過', symbol: '×' },
  future: { label: '尚未開始', symbol: '·' },
};

function formatEvidenceTime(value, precision = 'time') {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(precision === 'time'
      ? { hour: '2-digit', minute: '2-digit', hour12: false }
      : {}),
  }).format(date);
}

function TimelineNode({ node, index }) {
  const meta = statusMeta[node.status] || statusMeta.future;
  const achieved = node.status === 'complete';
  const terminal = node.status === 'failed';
  const timestamp = formatEvidenceTime(node.achievedAt || node.terminalAt, node.datePrecision);

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
              {node.requiredForMvj ? <span>MVJ REQUIRED</span> : null}
            </div>
            <h3>{node.title}</h3>
            <p>{node.description}</p>
          </div>
          <span className={`roadmap-status status-${node.status}`}>{meta.label}</span>
        </div>

        <div className="roadmap-node-meta">
          {timestamp ? (
            <div className="roadmap-meta-block">
              <span>{achieved ? (node.datePrecision === 'date' ? '首次可驗證日期' : '達成時間') : terminal ? '終端證據時間' : '時間'}</span>
              <strong>{timestamp}</strong>
            </div>
          ) : (
            <div className="roadmap-meta-block">
              <span>時間</span>
              <strong>{node.status === 'current' ? '進行中' : '尚未達成'}</strong>
            </div>
          )}

          <div className="roadmap-meta-block roadmap-prereq">
            <span>前置條件</span>
            <strong>{node.dependsOn?.length ? node.dependsOn.join(' · ') : '無'}</strong>
          </div>

          {node.evidenceUrl ? (
            <a className="roadmap-evidence-link" href={node.evidenceUrl} target="_blank" rel="noreferrer">
              <span>證據</span>
              <strong>{node.evidenceLabel}</strong>
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <div className="roadmap-meta-block">
              <span>解鎖條件</span>
              <strong>{node.unlockCondition || '等待前置研究完成'}</strong>
            </div>
          )}
        </div>

        {node.note ? <div className={`roadmap-node-note status-${node.status}`}>{node.note}</div> : null}
      </div>
    </article>
  );
}

function PhaseSummary({ phase }) {
  const completed = phase.nodes.filter((node) => node.status === 'complete').length;
  const failed = phase.nodes.filter((node) => node.status === 'failed').length;
  const current = phase.nodes.some((node) => node.status === 'current');

  return (
    <div className={`roadmap-phase-chip ${current ? 'is-current' : ''}`}>
      <span>{phase.shortLabel}</span>
      <strong>{phase.title}</strong>
      <small>{completed}/{phase.nodes.length} 已達成{failed ? ` · ${failed} 未通過` : ''}</small>
    </div>
  );
}

export default function AchievementSystem() {
  const [open, setOpen] = useState(false);
  const timeline = verifiedSnapshot.advancementTimeline;

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
      <button className="roadmap-launcher" type="button" onClick={() => setOpen(true)} aria-label="開啟北極星研究路徑">
        <span className="roadmap-launcher-icon" aria-hidden="true">⌁</span>
        <span className="roadmap-launcher-copy">
          <strong>北極星路徑</strong>
          <small>{stats.completed}/{stats.total} 個節點 · 下一步 {stats.current?.issue ? `#${stats.current.issue}` : '待確認'}</small>
        </span>
        <span className="roadmap-launcher-arrow" aria-hidden="true">›</span>
      </button>

      {open ? (
        <div className="roadmap-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="roadmap-window" role="dialog" aria-modal="true" aria-labelledby="roadmap-title">
            <header className="roadmap-header">
              <div>
                <span className="roadmap-eyebrow">JARVIS ADVANCEMENT PATH</span>
                <h2 id="roadmap-title">從現在走到 North Star</h2>
                <p>不是成就收藏，而是一條可追溯的研究路徑：每個已完成節點保留達成時間與證據，未完成節點顯示前置條件。</p>
              </div>
              <button className="roadmap-close" type="button" onClick={() => setOpen(false)} aria-label="關閉北極星路徑">×</button>
            </header>

            <div className="roadmap-phase-strip" aria-label="研究階段摘要">
              {timeline.phases.map((phase) => <PhaseSummary key={phase.id} phase={phase} />)}
            </div>

            <div className="roadmap-body">
              <aside className="roadmap-summary">
                <div className="roadmap-north-star">
                  <span>NORTH STAR</span>
                  <strong>{verifiedSnapshot.northStar.title}</strong>
                  <p>{verifiedSnapshot.northStar.description}</p>
                </div>

                <div className="roadmap-summary-grid">
                  <div><span>已達成</span><strong>{stats.completed}</strong></div>
                  <div><span>全部節點</span><strong>{stats.total}</strong></div>
                  <div><span>未通過</span><strong>{stats.failed}</strong></div>
                  <div><span>阻塞</span><strong>{stats.blocked}</strong></div>
                </div>

                <div className="roadmap-current-card">
                  <span>現在所在位置</span>
                  <strong>{stats.current?.title || '等待下一個可驗證節點'}</strong>
                  <p>{stats.current?.unlockCondition || stats.current?.description}</p>
                  {stats.current?.issue ? (
                    <a href={`https://github.com/kodlbegiko/persistent-personal-agent-research/issues/${stats.current.issue}`} target="_blank" rel="noreferrer">
                      Issue #{stats.current.issue} ↗
                    </a>
                  ) : null}
                </div>

                {stats.lastCompleted ? (
                  <div className="roadmap-last-completed">
                    <span>最近達成</span>
                    <strong>{stats.lastCompleted.title}</strong>
                    <small>{formatEvidenceTime(stats.lastCompleted.achievedAt, stats.lastCompleted.datePrecision)}</small>
                  </div>
                ) : null}

                <div className="roadmap-legend" aria-label="路徑狀態圖例">
                  {Object.entries(statusMeta).map(([status, meta]) => (
                    <span key={status}><i className={`status-${status}`} />{meta.label}</span>
                  ))}
                </div>

                <div className="roadmap-evidence-rule">
                  <strong>時間與完成規則</strong>
                  <p>只記錄可回溯的 terminal / frozen evidence。若只能證明日期、不足以證明分鐘級時間，就只顯示日期，不補猜。</p>
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
                      {phase.nodes.map((node, index) => <TimelineNode key={node.id} node={node} index={index} />)}
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
