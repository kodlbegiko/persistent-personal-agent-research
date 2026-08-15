import { useCallback, useEffect, useMemo, useState } from 'react';
import { maturityStages, verifiedSnapshot } from './data/researchState.js';
import { clearDashboardCache, loadAllLiveState } from './lib/github.js';

const GITHUB = 'https://github.com';

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  const paths = {
    home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9L12 3Z"/>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    flag: <><path d="M5 21V4"/><path d="M5 5h11l-2 4 2 4H5"/></>,
    benchmark: <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></>,
    alert: <><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4"/><path d="M12 16.5h.01"/></>,
    activity: <path d="M3 12h4l2.4-5 4.2 10 2.4-5H21"/>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>,
    github: <><path d="M12 2.7a9.3 9.3 0 0 0-2.9 18.1c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.1-4.7-5.1 0-1.1.4-2 1.1-2.8-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 3 1.1a10.5 10.5 0 0 1 5.4 0c2.1-1.4 3-1.1 3-1.1.6 1.4.2 2.4.1 2.7.7.8 1.1 1.7 1.1 2.8 0 4-2.4 4.8-4.7 5.1.4.3.7 1 .7 1.9v2.8c0 .3.2.6.7.5A9.3 9.3 0 0 0 12 2.7Z"/></>,
    refresh: <><path d="M20 6v5h-5"/><path d="M19 11a7.5 7.5 0 1 0 1 5"/></>,
    external: <><path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    git: <><circle cx="6" cy="5" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="6" cy="19" r="2"/><path d="M6 7v10"/><path d="M8 6c5 0 4 2 8 2"/></>,
  };
  return <svg {...common}>{paths[name] || paths.grid}</svg>;
}

function formatDate(value, includeTime = true) {
  if (!value) return '—';
  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
    }).format(date);
  } catch {
    return value;
  }
}

function statusClass(status = '') {
  const normalized = status.toLowerCase();
  if (normalized.includes('fail') || normalized.includes('prohibited')) return 'danger';
  if (normalized.includes('pass') || normalized.includes('complete') || normalized.includes('integrated')) return 'success';
  if (normalized.includes('progress') || normalized.includes('validation')) return 'active';
  if (normalized.includes('evidence')) return 'evidence';
  if (normalized.includes('scoped')) return 'scoped';
  return 'muted';
}

function Badge({ children, tone }) {
  return <span className={`badge ${tone || statusClass(String(children))}`}>{children}</span>;
}

function Card({ children, className = '' }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function MetricCard({ icon, label, value, detail }) {
  return (
    <Card className="metric-card">
      <div className="metric-icon"><Icon name={icon} /></div>
      <div>
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
        {detail && <div className="metric-detail">{detail}</div>}
      </div>
    </Card>
  );
}

function StageRail({ stage }) {
  return (
    <div className="stage-rail" aria-label={`Maturity stage ${stage} of ${maturityStages.length - 1}`}>
      {maturityStages.map((_, index) => (
        <span key={index} className={index <= stage ? 'filled' : ''} />
      ))}
    </div>
  );
}

function App() {
  const [live, setLive] = useState({ repos: [], issues: [], fetchedAt: null, issuesError: null });
  const [loading, setLoading] = useState(true);
  const [liveError, setLiveError] = useState(null);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    setLiveError(null);
    try {
      if (force) clearDashboardCache();
      const data = await loadAllLiveState(verifiedSnapshot.repositories, { force });
      setLive(data);
      const failures = data.repos.filter((row) => !row.ok);
      if (failures.length) {
        setLiveError(`${failures.length} 個 repository 無法取得即時資料；已保留 verified snapshot。`);
      }
    } catch (error) {
      setLiveError(error.message || 'GitHub live data unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const evidenceBearing = verifiedSnapshot.tracks.filter((track) => track.stage >= 2).length;
  const integrated = verifiedSnapshot.tracks.filter((track) => track.stage >= 5).length;
  const activeIssueCount = live.issues.filter((issue) => issue.state === 'open').length || verifiedSnapshot.milestones.length;
  const verifiedBlockers = verifiedSnapshot.blockers.length;

  const issueMap = useMemo(() => {
    return new Map(live.issues.map((issue) => [issue.number, issue]));
  }, [live.issues]);

  const activities = useMemo(() => {
    const rows = [];
    for (const result of live.repos) {
      if (!result.ok) continue;
      const repo = result.data;
      for (const commit of repo.commits.slice(0, 3)) {
        rows.push({
          type: 'commit',
          repo: repo.repo,
          title: commit.commit?.message?.split('\n')[0] || 'Commit',
          date: commit.commit?.committer?.date || commit.commit?.author?.date,
          url: commit.html_url,
          sha: commit.sha?.slice(0, 7),
        });
      }
      for (const pr of repo.pulls.slice(0, 2)) {
        rows.push({
          type: 'pr',
          repo: repo.repo,
          title: `PR #${pr.number} ${pr.title}`,
          date: pr.updated_at,
          url: pr.html_url,
          state: pr.merged_at ? 'merged' : pr.state,
        });
      }
    }
    return rows
      .filter((row) => row.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
  }, [live.repos]);

  const repoCards = verifiedSnapshot.repositories.map((repo) => {
    const liveRow = live.repos.find((row) => row.data?.key === repo.key);
    return { ...repo, liveRow };
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-orbit"><span /></div>
          <div>
            <strong>JARVIS Research Dashboard</strong>
            <small>Persistent Personal Agent Research</small>
          </div>
        </div>
        <div className="topbar-right">
          <div className="freshness-block">
            <span>研究證據快照</span>
            <strong><Icon name="check" size={14} /> {formatDate(verifiedSnapshot.verifiedAt)}</strong>
          </div>
          <div className="freshness-block">
            <span>GitHub 即時資料</span>
            <strong><Icon name="activity" size={14} /> {live.fetchedAt ? formatDate(live.fetchedAt) : loading ? '更新中…' : '未取得'}</strong>
          </div>
          <button className="refresh-button" onClick={() => load(true)} disabled={loading}>
            <Icon name="refresh" size={16} />
            {loading ? '同步中' : '重新同步'}
          </button>
        </div>
      </header>

      <aside className="sidebar">
        <nav>
          {[
            ['overview', 'home', '總覽', 'Overview'],
            ['north-star', 'star', '北極星', 'North Star'],
            ['tracks', 'grid', '研究軌道', 'Research Tracks'],
            ['gates', 'flag', '研究門檻', 'Research Gates'],
            ['benchmarks', 'benchmark', '比較與基準', 'Benchmarks'],
            ['blockers', 'alert', '阻礙', 'Blockers'],
            ['activity', 'activity', '最新動態', 'Activity Feed'],
            ['evidence', 'database', '證據邊界', 'Evidence'],
          ].map(([href, icon, zh, en], index) => (
            <a key={href} href={`#${href}`} className={index === 0 ? 'active' : ''}>
              <Icon name={icon} />
              <span>{zh}<small>{en}</small></span>
            </a>
          ))}
        </nav>

        <div className="sidebar-repos">
          <h3>Repositories</h3>
          {repoCards.map((repo) => {
            const ok = repo.liveRow?.ok;
            return (
              <a key={repo.key} href={`${GITHUB}/${repo.owner}/${repo.repo}`} target="_blank" rel="noreferrer">
                <span className={`repo-dot ${repo.accent} ${ok ? 'online' : ''}`} />
                <span><strong>{repo.repo}</strong><small>{repo.label}</small></span>
              </a>
            );
          })}
        </div>
      </aside>

      <main className="main-content" id="overview">
        {liveError && (
          <div className="notice warning">
            <Icon name="alert" />
            <span>{liveError}</span>
          </div>
        )}

        <section className="hero" id="north-star">
          <div className="hero-copy">
            <div className="section-label">NORTH STAR</div>
            <h1>{verifiedSnapshot.northStar.title}</h1>
            <p>{verifiedSnapshot.northStar.description}</p>
            <div className="evidence-note">
              <Icon name="database" size={16} />
              本站不以任意百分比代表「JARVIS 完成度」；距離以必要能力、整合層與 MVJ gates 的實際證據計算。
            </div>
          </div>

          <Card className="distance-card">
            <div className="distance-head">
              <div>
                <span>距離北極星還有多遠？</span>
                <strong>目前仍在「子系統證據 → 首次整合」階段</strong>
              </div>
              <Badge tone="active">EVIDENCE-FIRST</Badge>
            </div>
            <div className="distance-grid">
              <div>
                <span>有研究證據的軌道</span>
                <strong>{evidenceBearing} / {verifiedSnapshot.tracks.length}</strong>
                <div className="count-bar"><span style={{ width: `${(evidenceBearing / verifiedSnapshot.tracks.length) * 100}%` }} /></div>
              </div>
              <div>
                <span>已整合軌道</span>
                <strong>{integrated} / {verifiedSnapshot.tracks.length}</strong>
                <div className="count-bar"><span style={{ width: `${Math.max(2, (integrated / verifiedSnapshot.tracks.length) * 100)}%` }} /></div>
              </div>
              <div>
                <span>MVJ 必要 gates 完成</span>
                <strong>{verifiedSnapshot.northStar.mvjCompletedGates} / {verifiedSnapshot.northStar.mvjRequiredGates}</strong>
                <div className="count-bar"><span style={{ width: '2%' }} /></div>
              </div>
            </div>
            <div className="critical-path">
              <span>現在的關鍵路徑</span>
              <strong>{verifiedSnapshot.northStar.criticalPath}</strong>
              <a href={`${GITHUB}/kodlbegiko/persistent-personal-agent-research/issues/1`} target="_blank" rel="noreferrer">查看 Issue <Icon name="external" size={14} /></a>
            </div>
          </Card>
        </section>

        <section className="metric-grid">
          <MetricCard icon="grid" label="研究軌道" value={verifiedSnapshot.tracks.length} detail="RT-01 → RT-07" />
          <MetricCard icon="database" label="已有研究證據" value={`${evidenceBearing} / ${verifiedSnapshot.tracks.length}`} detail="非等同 validated" />
          <MetricCard icon="check" label="已整合軌道" value={`${integrated} / ${verifiedSnapshot.tracks.length}`} detail="目前尚未形成完整 closed loop" />
          <MetricCard icon="alert" label="已驗證 blockers" value={verifiedBlockers} detail="依 evidence snapshot" />
          <MetricCard icon="activity" label="總 Repo Open Issues" value={activeIssueCount} detail={live.fetchedAt ? 'GitHub live' : 'snapshot fallback'} />
        </section>

        <section id="tracks" className="section-block">
          <div className="section-heading">
            <div><h2>研究軌道進度</h2><p>每條軌道顯示 evidence maturity，而不是主觀完成百分比。</p></div>
            <span className="mini-legend">0 Not started → 6 Independently reproduced</span>
          </div>
          <div className="tracks-grid">
            {verifiedSnapshot.tracks.map((track) => (
              <Card key={track.id} className={`track-card accent-${track.accent}`}>
                <div className="track-top">
                  <span className="track-id">{track.id}</span>
                  <Badge>{track.status}</Badge>
                </div>
                <h3>{track.name}</h3>
                <p className="track-subtitle">{track.subtitle}</p>
                <StageRail stage={track.stage} />
                <div className="stage-copy">
                  <strong>Stage {track.stage}</strong><span>{maturityStages[track.stage]}</span>
                </div>
                <p className="track-detail">{track.detail}</p>
              </Card>
            ))}
          </div>
        </section>

        <div className="two-column">
          <section id="gates" className="section-block">
            <div className="section-heading compact"><div><h2>研究門檻</h2><p>只顯示已驗證的 gate snapshot。</p></div></div>
            <Card className="table-card">
              <div className="gate-table" role="table">
                <div className="gate-row head" role="row">
                  <span>Track</span><span>Gate</span><span>Verdict</span><span>Evidence boundary</span>
                </div>
                {verifiedSnapshot.gates.map((gate, index) => (
                  <div className="gate-row" role="row" key={`${gate.track}-${gate.gate}-${index}`}>
                    <span>{gate.track}</span>
                    <strong>{gate.gate}</strong>
                    <span><Badge tone={gate.tone}>{gate.verdict}</Badge></span>
                    <span className="gate-detail">{gate.detail}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section id="blockers" className="section-block">
            <div className="section-heading compact"><div><h2>當前阻礙</h2><p>依對 North Star 的依賴關係排序。</p></div></div>
            <div className="blocker-list">
              {verifiedSnapshot.blockers.map((blocker) => (
                <Card key={blocker.title} className="blocker-card">
                  <div className="blocker-title"><Badge tone={blocker.level === 'critical' ? 'danger' : 'warn'}>{blocker.level.toUpperCase()}</Badge><strong>{blocker.title}</strong></div>
                  <p>{blocker.text}</p>
                  <span className="source-line">來源：{blocker.source}</span>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <section id="benchmarks" className="section-block">
          <div className="section-heading"><div><h2>關鍵基準與比較</h2><p>比較結果會連同 claim boundary 一起顯示，避免把特定 benchmark 的優勢擴張成 SOTA。</p></div></div>
          <div className="benchmark-grid">
            <Card className="benchmark-card">
              <div className="benchmark-title"><span>PSE</span><h3>{verifiedSnapshot.benchmarks.pse.title}</h3></div>
              <div className="duel-grid">
                <div className="duel-section">
                  <span>{verifiedSnapshot.benchmarks.pse.answerable.metric} — answerable</span>
                  <div className="duel-values"><div><small>Candidate-v6</small><strong>{verifiedSnapshot.benchmarks.pse.answerable.candidate.toFixed(3)}</strong></div><div><small>A-MEM</small><strong>{verifiedSnapshot.benchmarks.pse.answerable.baseline.toFixed(3)}</strong></div></div>
                </div>
                <div className="duel-section">
                  <span>{verifiedSnapshot.benchmarks.pse.noEvidence.metric} — no evidence</span>
                  <div className="duel-values"><div className="good"><small>Candidate-v6</small><strong>{verifiedSnapshot.benchmarks.pse.noEvidence.candidate}</strong></div><div className="bad"><small>A-MEM</small><strong>{verifiedSnapshot.benchmarks.pse.noEvidence.baseline}</strong></div></div>
                </div>
              </div>
              <div className="claim-boundary"><Icon name="flag" size={16} /><span>{verifiedSnapshot.benchmarks.pse.claim}</span></div>
            </Card>

            <Card className="benchmark-card">
              <div className="benchmark-title"><span>PDA</span><h3>{verifiedSnapshot.benchmarks.pda.title}</h3></div>
              <div className="audit-grid">
                {verifiedSnapshot.benchmarks.pda.values.map(([label, value]) => (
                  <div key={label}><span>{label}</span><strong>{value}</strong></div>
                ))}
              </div>
              <div className="claim-boundary"><Icon name="flag" size={16} /><span>{verifiedSnapshot.benchmarks.pda.claim}</span></div>
            </Card>
          </div>
        </section>

        <section className="section-block" id="evidence">
          <div className="section-heading"><div><h2>Claim Boundary</h2><p>哪些可以說、哪些現在還不能說。</p></div></div>
          <div className="claims-grid">
            <Card className="claims-card supported">
              <h3><Icon name="check" />目前有證據支持</h3>
              <ul>{verifiedSnapshot.claims.supported.map((claim) => <li key={claim}>{claim}</li>)}</ul>
            </Card>
            <Card className="claims-card unsupported">
              <h3><Icon name="alert" />目前禁止擴張宣稱</h3>
              <ul>{verifiedSnapshot.claims.notSupported.map((claim) => <li key={claim}>{claim}</li>)}</ul>
            </Card>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading"><div><h2>MVJ 關鍵里程碑</h2><p>Issue 狀態來自總 repo 的 GitHub live data；若 API 不可用則顯示 snapshot。</p></div></div>
          <Card className="milestones-card">
            {verifiedSnapshot.milestones.map((milestone) => {
              const issue = issueMap.get(milestone.issue);
              const state = issue?.state || 'unknown';
              return (
                <a key={milestone.issue} href={`${GITHUB}/kodlbegiko/persistent-personal-agent-research/issues/${milestone.issue}`} target="_blank" rel="noreferrer" className="milestone-row">
                  <span className="issue-number">#{milestone.issue}</span>
                  <span className="milestone-title"><strong>{milestone.title}</strong><small>{milestone.track}{milestone.requiredForMvj ? ' · MVJ required' : ''}</small></span>
                  <Badge tone={state === 'closed' ? 'success' : state === 'open' ? 'active' : 'muted'}>{state.toUpperCase()}</Badge>
                  <Icon name="external" size={15} />
                </a>
              );
            })}
          </Card>
        </section>

        <section id="activity" className="section-block">
          <div className="section-heading"><div><h2>最新 GitHub 動態</h2><p>這是 live activity signal，不等於研究 gate 自動升級。</p></div><span className="live-pill"><span /> LIVE ON REFRESH</span></div>
          <Card className="activity-card">
            {activities.length ? activities.map((item, index) => (
              <a href={item.url} target="_blank" rel="noreferrer" className="activity-row" key={`${item.repo}-${item.type}-${item.date}-${index}`}>
                <span className={`activity-type ${item.type}`}><Icon name={item.type === 'commit' ? 'git' : 'github'} size={16} /></span>
                <span className="activity-main"><strong>{item.title}</strong><small>{item.repo}{item.sha ? ` · ${item.sha}` : item.state ? ` · ${item.state}` : ''}</small></span>
                <time>{formatDate(item.date)}</time>
                <Icon name="external" size={14} />
              </a>
            )) : (
              <div className="empty-state">{loading ? '正在取得 GitHub live data…' : '目前無法取得 live activity；verified snapshot 仍可使用。'}</div>
            )}
          </Card>
        </section>

        <section className="section-block">
          <div className="section-heading"><div><h2>Repository 狀態</h2><p>即時 repo metadata、branch 與最近 PR。</p></div></div>
          <div className="repo-status-grid">
            {repoCards.map((repo) => {
              const result = repo.liveRow;
              const data = result?.ok ? result.data : null;
              return (
                <Card className="repo-status-card" key={repo.key}>
                  <div className="repo-status-title"><span className={`repo-dot ${repo.accent} ${result?.ok ? 'online' : ''}`} /><div><h3>{repo.repo}</h3><span>{repo.label}</span></div></div>
                  {data ? (
                    <>
                      <div className="repo-stats"><div><span>Branches</span><strong>{data.branches.length}</strong></div><div><span>Open issues + PRs</span><strong>{data.meta.open_issues_count}</strong></div><div><span>Default</span><strong>{data.meta.default_branch}</strong></div></div>
                      <div className="repo-last"><span>Last push</span><strong>{formatDate(data.meta.pushed_at)}</strong></div>
                      {data.pulls[0] && <a className="repo-pr" href={data.pulls[0].html_url} target="_blank" rel="noreferrer"><span>Latest PR</span><strong>#{data.pulls[0].number} {data.pulls[0].title}</strong><Badge tone={data.pulls[0].state === 'open' ? 'active' : 'muted'}>{data.pulls[0].state.toUpperCase()}</Badge></a>}
                    </>
                  ) : (
                    <div className="empty-state compact">Live metadata unavailable.</div>
                  )}
                  <a className="repo-link" href={`${GITHUB}/${repo.owner}/${repo.repo}`} target="_blank" rel="noreferrer"><Icon name="github" size={15}/> 開啟 Repository <Icon name="external" size={13}/></a>
                </Card>
              );
            })}
          </div>
        </section>

        <footer>
          <div><strong>Evidence-first dashboard</strong><span>研究進度只在 evidence boundary 允許時升級。</span></div>
          <div><span>Verified snapshot: {formatDate(verifiedSnapshot.verifiedAt)}</span><span>Live GitHub: {live.fetchedAt ? formatDate(live.fetchedAt) : 'unavailable'}</span></div>
        </footer>
      </main>
    </div>
  );
}

export default App;
