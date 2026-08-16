import { useCallback, useEffect, useMemo, useState } from 'react';
import { verifiedSnapshot } from './data/researchState.js';
import { clearDashboardCache, loadAllLiveState } from './lib/github.js';
import { useLanguage } from './i18n.jsx';
import PlainLanguageProgress from './components/PlainLanguageProgress.jsx';
import ResearchHistory from './components/ResearchHistory.jsx';
import {
  ActivityPanel,
  BenchmarkPanel,
  BlockerPanel,
  DashboardFooter,
  DashboardShell,
  EvidencePanel,
  GateTable,
  Icon,
  NorthStarSummary,
  RepositoryPanel,
  ResearchTracks,
  Sidebar,
  Topbar,
} from './components/dashboard/DashboardComponents.jsx';

export default function App() {
  const { language, setLanguage, t, snapshot, locale } = useLanguage();
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
      if (failures.length) setLiveError(t('liveFailure', { count: failures.length }));
    } catch (error) {
      setLiveError(error.message || 'GitHub live data unavailable');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { load(false); }, [load]);

  const evidenceBearing = snapshot.tracks.filter((track) => track.stage >= 2).length;
  const integrated = snapshot.tracks.filter((track) => track.stage >= 6).length;
  const activeIssueCount = live.issues.filter((issue) => issue.state === 'open').length || snapshot.milestones.length;
  const verifiedBlockers = snapshot.blockers.length;
  const issueMap = useMemo(() => new Map(live.issues.map((issue) => [issue.number, issue])), [live.issues]);

  const activities = useMemo(() => {
    const rows = [];
    for (const result of live.repos) {
      if (!result.ok) continue;
      const repo = result.data;
      for (const commit of repo.commits.slice(0, 3)) {
        rows.push({
          type: 'commit', repo: repo.repo,
          title: commit.commit?.message?.split('\n')[0] || 'Commit',
          date: commit.commit?.committer?.date || commit.commit?.author?.date,
          url: commit.html_url, sha: commit.sha?.slice(0, 7),
        });
      }
      for (const pr of repo.pulls.slice(0, 2)) {
        rows.push({
          type: 'pr', repo: repo.repo,
          title: `PR #${pr.number} ${pr.title}`,
          date: pr.updated_at, url: pr.html_url,
          state: pr.merged_at ? 'merged' : pr.state,
        });
      }
    }
    return rows.filter((row) => row.date).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  }, [live.repos]);

  const repoCards = snapshot.repositories.map((repo) => ({
    ...repo,
    liveRow: live.repos.find((row) => row.data?.key === repo.key),
  }));

  const navItems = [
    ['overview', 'home', t('nav.overview')],
    ['north-star', 'star', t('nav.northStar')],
    ['tracks', 'grid', t('nav.tracks')],
    ['history', 'clock', language === 'en' ? 'Verified History' : '已驗證歷史'],
    ['gates', 'flag', t('nav.gates')],
    ['benchmarks', 'benchmark', t('nav.benchmarks')],
    ['blockers', 'alert', t('nav.blockers')],
    ['activity', 'activity', t('nav.activity')],
    ['evidence', 'database', t('nav.evidence')],
  ];

  return (
    <DashboardShell language={language}>
      <Topbar language={language} setLanguage={setLanguage} t={t} snapshot={snapshot} locale={locale} live={live} loading={loading} onRefresh={() => load(true)} />
      <Sidebar navItems={navItems} repoCards={repoCards} t={t} />
      <main className="main-content" id="overview">
        {liveError && <div className="notice warning"><Icon name="alert" /><span>{liveError}</span></div>}
        <PlainLanguageProgress snapshot={snapshot} language={language} />
        <NorthStarSummary snapshot={snapshot} t={t} evidenceBearing={evidenceBearing} integrated={integrated} verifiedBlockers={verifiedBlockers} activeIssueCount={activeIssueCount} live={live} />
        <ResearchTracks snapshot={snapshot} t={t} language={language} />
        <ResearchHistory />
        <div className="two-column"><GateTable snapshot={snapshot} t={t} /><BlockerPanel snapshot={snapshot} t={t} /></div>
        <BenchmarkPanel snapshot={snapshot} t={t} />
        <EvidencePanel snapshot={snapshot} t={t} issueMap={issueMap} language={language} />
        <ActivityPanel activities={activities} t={t} language={language} locale={locale} loading={loading} />
        <RepositoryPanel repoCards={repoCards} t={t} language={language} locale={locale} />
        <DashboardFooter t={t} snapshot={snapshot} locale={locale} live={live} />
      </main>
    </DashboardShell>
  );
}
