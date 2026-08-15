import { useMemo, useState } from 'react';
import { verifiedSnapshot } from '../data/researchState.js';

const categories = [
  ['all', '全部'],
  ['foundation', '基礎研究'],
  ['method', '方法驗證'],
  ['integration', '系統整合'],
  ['milestone', '里程碑'],
  ['secret', '隱藏成就'],
];

const rarityLabels = {
  common: 'COMMON',
  uncommon: 'UNCOMMON',
  rare: 'RARE',
  epic: 'EPIC',
  legendary: 'LEGENDARY',
};

const achievements = [
  {
    id: 'first-block',
    title: '第一個方塊',
    subtitle: '建立總研究控制層',
    category: 'foundation',
    rarity: 'common',
    xp: 100,
    glyph: '▣',
    condition: (s) => s.repositories.length >= 3,
    evidence: '總研究 repo、PSE 與 PDA 已納入同一 Persistent Personal Agent 主線。',
  },
  {
    id: 'state-seeker',
    title: '狀態探索者',
    subtitle: 'Personal State 取得 development evidence',
    category: 'foundation',
    rarity: 'uncommon',
    xp: 180,
    glyph: '◉',
    condition: (s) => s.tracks.find((t) => t.id === 'RT-01')?.stage >= 2,
    evidence: 'RT-01 maturity ≥ DEVELOPMENT_EVIDENCE。',
  },
  {
    id: 'proactivity-scout',
    title: '主動偵察兵',
    subtitle: 'Proactivity 取得 development evidence',
    category: 'foundation',
    rarity: 'uncommon',
    xp: 180,
    glyph: '⚡',
    condition: (s) => s.tracks.find((t) => t.id === 'RT-02')?.stage >= 2,
    evidence: 'RT-02 maturity ≥ DEVELOPMENT_EVIDENCE。',
  },
  {
    id: 'protected-pathfinder',
    title: '保護區探路者',
    subtitle: '進入 protected validation',
    category: 'method',
    rarity: 'rare',
    xp: 260,
    glyph: '◇',
    condition: (s) => s.tracks.find((t) => t.id === 'RT-02')?.stage >= 3,
    evidence: 'RT-02 maturity ≥ PROTECTED_VALIDATION。',
  },
  {
    id: 'spec-guardian',
    title: '規格守門員',
    subtitle: 'PDA Gate B 通過',
    category: 'method',
    rarity: 'rare',
    xp: 280,
    glyph: '⌘',
    condition: (s) => s.gates.some((g) => g.track === 'RT-02' && g.gate === 'Gate B' && g.verdict === 'PASS'),
    evidence: 'Specification consistency / bounded-state audit 通過。',
  },
  {
    id: 'oracle-keeper',
    title: 'Oracle 守護者',
    subtitle: 'PDA Gate C 通過',
    category: 'method',
    rarity: 'rare',
    xp: 300,
    glyph: '✦',
    condition: (s) => s.gates.some((g) => g.track === 'RT-02' && g.gate === 'Gate C' && g.verdict === 'PASS'),
    evidence: 'Oracle / benchmark validity 通過。',
  },
  {
    id: 'baseline-keeper',
    title: '基準守衛',
    subtitle: 'PDA Gate D 通過',
    category: 'method',
    rarity: 'rare',
    xp: 320,
    glyph: '▥',
    condition: (s) => s.gates.some((g) => g.track === 'RT-02' && g.gate === 'Gate D' && g.verdict === 'PASS'),
    evidence: 'Baseline evaluation / selection 在 frozen protocol 下完成。',
  },
  {
    id: 'abstention-master',
    title: '知道不知道',
    subtitle: 'No-evidence 正確 abstain',
    category: 'method',
    rarity: 'epic',
    xp: 420,
    glyph: '∅',
    condition: (s) => s.benchmarks.pse.noEvidence.candidate === '0 / 30' && s.benchmarks.pse.noEvidence.baseline === '30 / 30',
    evidence: 'adversarial-v7 no-evidence subset：Candidate-v6 false retrieval 0/30；A-MEM 30/30。',
  },
  {
    id: 'scientific-gate',
    title: '科學門檻',
    subtitle: 'PSE Gate E scientific complete',
    category: 'method',
    rarity: 'epic',
    xp: 450,
    glyph: '⬡',
    condition: (s) => s.gates.some((g) => g.track === 'RT-01' && g.gate.includes('Gate E (scientific)') && g.verdict === 'COMPLETE'),
    evidence: 'Candidate-v6 scientific requirements complete。',
  },
  {
    id: 'integrity-keeper',
    title: '完整性守門人',
    subtitle: '在證據不足時選擇 fail-closed',
    category: 'secret',
    rarity: 'epic',
    xp: 500,
    glyph: '⬢',
    condition: (s) => s.gates.some((g) => g.track === 'RT-01' && g.verdict === 'FAIL CLOSED') && s.gates.some((g) => g.track === 'RT-01' && g.verdict === 'PROHIBITED'),
    evidence: 'Gate E formal 維持 fail-closed，Gate F 未被不當計入進度。',
  },
  {
    id: 'dual-core',
    title: '雙核心上線',
    subtitle: 'PSE 與 PDA 同時具備研究證據',
    category: 'integration',
    rarity: 'epic',
    xp: 480,
    glyph: '∞',
    condition: (s) => s.tracks.find((t) => t.id === 'RT-01')?.stage >= 2 && s.tracks.find((t) => t.id === 'RT-02')?.stage >= 2,
    evidence: 'RT-01 與 RT-02 皆至少達 DEVELOPMENT_EVIDENCE。',
  },
  {
    id: 'integration-pioneer',
    title: '整合先鋒',
    subtitle: '完成第一個正式 integration gate',
    category: 'integration',
    rarity: 'epic',
    xp: 650,
    glyph: '⇄',
    condition: (s) => s.northStar.mvjCompletedGates >= 1 || s.tracks.some((t) => t.stage >= 5),
    evidence: '至少一個 MVJ required gate 完成，或至少一條軌道達 INTEGRATED。',
  },
  {
    id: 'verifier',
    title: '驗證者',
    subtitle: 'Action Verification 取得 development evidence',
    category: 'integration',
    rarity: 'epic',
    xp: 700,
    glyph: '✓',
    condition: (s) => s.tracks.find((t) => t.id === 'RT-03')?.stage >= 2,
    evidence: 'RT-03 maturity ≥ DEVELOPMENT_EVIDENCE。',
  },
  {
    id: 'closed-loop',
    title: '閉環創建者',
    subtitle: 'State → Proactivity → Action → Verification → State',
    category: 'integration',
    rarity: 'legendary',
    xp: 1000,
    glyph: '↻',
    condition: (s) => s.tracks.find((t) => t.id === 'RT-03')?.stage >= 4 && s.tracks.some((t) => t.stage >= 5),
    evidence: 'Action Verification validated，且至少一條 research track 已正式整合。',
  },
  {
    id: 'long-horizon',
    title: '長征者',
    subtitle: 'Long-Horizon 取得 development evidence',
    category: 'milestone',
    rarity: 'epic',
    xp: 750,
    glyph: '⧖',
    condition: (s) => s.tracks.find((t) => t.id === 'RT-04')?.stage >= 2,
    evidence: 'RT-04 maturity ≥ DEVELOPMENT_EVIDENCE。',
  },
  {
    id: 'multimodal-architect',
    title: '多模態建築師',
    subtitle: 'Multimodal Context 取得 development evidence',
    category: 'milestone',
    rarity: 'epic',
    xp: 750,
    glyph: '◈',
    condition: (s) => s.tracks.find((t) => t.id === 'RT-05')?.stage >= 2,
    evidence: 'RT-05 maturity ≥ DEVELOPMENT_EVIDENCE。',
  },
  {
    id: 'cross-device-nomad',
    title: '跨裝置旅人',
    subtitle: 'Cross-device 取得 development evidence',
    category: 'milestone',
    rarity: 'epic',
    xp: 800,
    glyph: '⌁',
    condition: (s) => s.tracks.find((t) => t.id === 'RT-06')?.stage >= 2,
    evidence: 'RT-06 maturity ≥ DEVELOPMENT_EVIDENCE。',
  },
  {
    id: 'physical-world',
    title: '踏入現實世界',
    subtitle: 'Physical World 取得 development evidence',
    category: 'milestone',
    rarity: 'legendary',
    xp: 1200,
    glyph: '⬟',
    condition: (s) => s.tracks.find((t) => t.id === 'RT-07')?.stage >= 2,
    evidence: 'RT-07 maturity ≥ DEVELOPMENT_EVIDENCE。',
  },
  {
    id: 'mvj',
    title: 'Minimum Viable JARVIS',
    subtitle: '完成第一個可信的整合式個人 Agent 里程碑',
    category: 'milestone',
    rarity: 'legendary',
    xp: 2000,
    glyph: '★',
    condition: (s) => s.northStar.mvjCompletedGates >= s.northStar.mvjRequiredGates,
    evidence: '所有 MVJ required gates 皆有 admissible evidence。',
  },
];

const levelThresholds = [
  { level: 1, title: 'Observer', xp: 0 },
  { level: 2, title: 'Researcher', xp: 500 },
  { level: 3, title: 'Evidence Miner', xp: 1200 },
  { level: 4, title: 'Protocol Architect', xp: 2200 },
  { level: 5, title: 'System Integrator', xp: 3800 },
  { level: 6, title: 'Persistent Agent Builder', xp: 6000 },
  { level: 7, title: 'JARVIS Architect', xp: 9000 },
];

function getLevel(xp) {
  const current = [...levelThresholds].reverse().find((row) => xp >= row.xp) || levelThresholds[0];
  const currentIndex = levelThresholds.findIndex((row) => row.level === current.level);
  const next = levelThresholds[currentIndex + 1] || null;
  return { current, next };
}

function PixelGlyph({ glyph, rarity, locked }) {
  return (
    <div className={`achievement-glyph rarity-${rarity} ${locked ? 'locked' : ''}`} aria-hidden="true">
      <span>{locked ? '?' : glyph}</span>
    </div>
  );
}

export default function AchievementSystem() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const evaluated = useMemo(() => achievements.map((achievement) => ({
    ...achievement,
    unlocked: Boolean(achievement.condition(verifiedSnapshot)),
  })), []);

  const unlocked = evaluated.filter((item) => item.unlocked);
  const totalXp = unlocked.reduce((sum, item) => sum + item.xp, 0);
  const { current, next } = getLevel(totalXp);
  const progress = next ? Math.max(0, Math.min(100, ((totalXp - current.xp) / (next.xp - current.xp)) * 100)) : 100;
  const visible = filter === 'all' ? evaluated : evaluated.filter((item) => item.category === filter);

  return (
    <>
      <button className="achievement-launcher" type="button" onClick={() => setOpen(true)} aria-label="開啟研究成就系統">
        <span className="achievement-launcher-cube">◆</span>
        <span className="achievement-launcher-copy">
          <strong>研究成就</strong>
          <small>{unlocked.length}/{evaluated.length} · Lv.{current.level}</small>
        </span>
        <span className="achievement-launcher-arrow">›</span>
      </button>

      {open ? (
        <div className="achievement-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="achievement-window" role="dialog" aria-modal="true" aria-label="研究成就系統">
            <header className="achievement-header">
              <div className="achievement-header-title">
                <span className="achievement-title-cube">◆</span>
                <div>
                  <span>RESEARCH ADVANCEMENTS</span>
                  <h2>成就系統</h2>
                  <p>以可驗證 evidence 自動解鎖；XP 不代表 JARVIS 完成百分比。</p>
                </div>
              </div>
              <button className="achievement-close" type="button" onClick={() => setOpen(false)} aria-label="關閉成就系統">×</button>
            </header>

            <div className="achievement-body">
              <aside className="achievement-profile">
                <div className="achievement-level-card">
                  <div className="level-avatar"><span>{current.level}</span></div>
                  <div>
                    <span>研究等級</span>
                    <strong>Lv.{current.level} · {current.title}</strong>
                    <small>{totalXp.toLocaleString()} XP</small>
                  </div>
                </div>

                <div className="xp-track" aria-label={`XP ${totalXp}`}>
                  <span style={{ width: `${progress}%` }} />
                </div>
                <div className="xp-copy">
                  <span>{current.xp.toLocaleString()}</span>
                  <span>{next ? `${next.xp.toLocaleString()} XP → ${next.title}` : 'MAX LEVEL'}</span>
                </div>

                <div className="achievement-stats">
                  <div><span>已解鎖</span><strong>{unlocked.length}</strong></div>
                  <div><span>總成就</span><strong>{evaluated.length}</strong></div>
                  <div><span>稀有 / 史詩+</span><strong>{unlocked.filter((item) => ['rare', 'epic', 'legendary'].includes(item.rarity)).length}</strong></div>
                </div>

                <div className="achievement-rule">
                  <strong>解鎖規則</strong>
                  <p>只讀取 `verifiedSnapshot`。README、commit 數量或單純 PR 宣稱不會自動解鎖研究成就。</p>
                </div>
              </aside>

              <div className="achievement-content">
                <nav className="achievement-tabs" aria-label="成就分類">
                  {categories.map(([id, label]) => {
                    const count = id === 'all' ? evaluated.length : evaluated.filter((item) => item.category === id).length;
                    return (
                      <button key={id} type="button" className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>
                        <span>{label}</span><small>{count}</small>
                      </button>
                    );
                  })}
                </nav>

                <div className="achievement-grid">
                  {visible.map((achievement) => (
                    <article key={achievement.id} className={`achievement-card rarity-${achievement.rarity} ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                      <div className="achievement-card-top">
                        <PixelGlyph glyph={achievement.glyph} rarity={achievement.rarity} locked={!achievement.unlocked} />
                        <div className="achievement-card-heading">
                          <span>{rarityLabels[achievement.rarity]}</span>
                          <h3>{achievement.unlocked || achievement.category !== 'secret' ? achievement.title : '???'}</h3>
                        </div>
                        <span className="achievement-xp">+{achievement.xp} XP</span>
                      </div>
                      <p>{achievement.unlocked || achievement.category !== 'secret' ? achievement.subtitle : '隱藏條件尚未達成'}</p>
                      <div className="achievement-evidence">
                        <span>{achievement.unlocked ? 'EVIDENCE VERIFIED' : 'LOCK CONDITION'}</span>
                        <small>{achievement.unlocked || achievement.category !== 'secret' ? achievement.evidence : '條件達成後顯示。'}</small>
                      </div>
                      <div className="achievement-status">
                        <span className={achievement.unlocked ? 'is-unlocked' : 'is-locked'}>{achievement.unlocked ? '✓ 已解鎖' : '◆ 尚未解鎖'}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
