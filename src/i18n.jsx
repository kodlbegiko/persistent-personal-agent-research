import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { verifiedSnapshot } from './data/researchState.js';

export const LANG_ZH = 'zh-Hant';
export const LANG_EN = 'en';

const dictionary = {
  [LANG_ZH]: {
    brandSubtitle: '持續型個人 AI 代理研究',
    researchSnapshot: '研究證據快照',
    githubLive: 'GitHub 即時資料',
    updating: '更新中…',
    unavailable: '未取得',
    syncing: '同步中',
    resync: '重新同步',
    liveFailure: '{count} 個 repository 無法取得即時資料；已保留已驗證快照。',
    nav: {
      overview: '總覽', northStar: '北極星', tracks: '研究軌道', gates: '研究門檻',
      benchmarks: '比較與基準', blockers: '阻礙', activity: '最新動態', evidence: '證據邊界',
    },
    repositories: '程式碼庫',
    evidenceNote: '本站不以任意百分比代表「JARVIS 完成度」；距離以必要能力、整合層與 MVJ 門檻的實際證據計算。',
    distanceQuestion: '距離北極星還有多遠？',
    distanceStage: '目前仍在「子系統證據 → 首次整合」階段',
    evidenceTracks: '已有研究證據的軌道',
    integratedTracks: '已整合軌道',
    mvjGates: 'MVJ 必要門檻完成',
    criticalPath: '現在的關鍵路徑',
    viewIssue: '查看 Issue',
    metrics: {
      tracks: '研究軌道', evidence: '已有研究證據', integrated: '已整合軌道', blockers: '已驗證阻礙', issues: '總 Repo 未結 Issues',
      evidenceDetail: '不等同已驗證完成', integratedDetail: '目前尚未形成完整閉環', blockerDetail: '依證據快照', githubLive: 'GitHub 即時', snapshotFallback: '快照備援',
    },
    tracks: { title: '研究軌道進度', desc: '每條軌道顯示證據成熟度，而不是主觀完成百分比。', legend: '0 未開始 → 6 獨立重現' },
    gates: { title: '研究門檻', desc: '只顯示已驗證的門檻快照。', track: '軌道', gate: '門檻', verdict: '裁決', boundary: '證據邊界' },
    blockers: { title: '當前阻礙', desc: '依對北極星的依賴關係排序。', source: '來源' },
    benchmarks: { title: '關鍵基準與比較', desc: '比較結果會連同宣稱邊界一起顯示，避免把特定 benchmark 的優勢擴張成 SOTA。', answerable: '可回答', noEvidence: '無證據' },
    claims: { title: '宣稱邊界', desc: '哪些可以說、哪些現在還不能說。', supported: '目前有證據支持', unsupported: '目前禁止擴張宣稱' },
    milestones: { title: 'MVJ 關鍵里程碑', desc: 'Issue 狀態來自總 repo 的 GitHub 即時資料；若 API 不可用則顯示快照。', required: 'MVJ 必要' },
    activity: { title: '最新 GitHub 動態', desc: '這是即時活動訊號，不等於研究門檻自動升級。', live: '重新整理即時更新', loading: '正在取得 GitHub 即時資料…', empty: '目前無法取得即時活動；已驗證快照仍可使用。' },
    repoStatus: { title: 'Repository 狀態', desc: '即時 repo metadata、branch 與最近 PR。', branches: '分支', openIssues: '未結 Issues + PRs', default: '預設分支', lastPush: '最後推送', latestPr: '最新 PR', openRepo: '開啟 Repository', unavailable: '即時 metadata 無法取得。' },
    footer: { title: 'Evidence-first 儀表板', desc: '研究進度只在證據邊界允許時升級。', snapshot: '已驗證快照', live: 'GitHub 即時' },
    language: { label: '語言', zh: '繁體中文', en: 'English' },
    maturityStage: '成熟度階段 {stage} / {total}',
    stage: '階段',
    status: {
      DEVELOPMENT_EVIDENCE: '開發證據', PROTECTED_VALIDATION_FAILED: '保護驗證失敗', RECOVERY_LINEAGES_FAILED_OR_INVALID: '復原 LINEAGE 失敗或無效', PAAV_NOT_ESTABLISHED_PARE_RECOVERY_ADMITTED: 'PAAV 尚未建立；PARE 復原證據已採納', SCOPED: '已界定', NOT_STARTED: '未開始',
      PASS: '通過', FAIL: '失敗', COMPLETE: '完成', 'FAIL CLOSED': '封閉式失敗', PROHIBITED: '禁止', open: '未結', closed: '已結', merged: '已合併', unknown: '未知',
    },
    timeline: {
      launcher: '北極星路徑', nodes: '{done}/{total} 個節點', next: '下一步', pending: '待確認',
      eyebrow: 'JARVIS 推進路徑', title: '從現在走到北極星',
      intro: '這不是成就收藏，而是一條可追溯的研究路徑：每個已完成節點保留達成時間與證據，未完成節點顯示前置條件。',
      achieved: '已達成', current: '目前目標', blocked: '阻塞', failed: '未通過', future: '尚未開始',
      verifiedDate: '首次可驗證日期', achievedAt: '達成時間', terminalAt: '終端證據時間', time: '時間', inProgress: '進行中', notAchieved: '尚未達成',
      prereq: '前置條件', none: '無', evidence: '證據', unlock: '解鎖條件', waiting: '等待前置研究完成',
      phaseSummary: '{done}/{total} 已達成', failedCount: '{count} 未通過',
      northStar: '北極星', completed: '已達成', total: '全部節點', failedStat: '未通過', blockedStat: '阻塞', currentPosition: '現在所在位置', waitingNext: '等待下一個可驗證節點', recent: '最近達成',
      ruleTitle: '時間與完成規則', rule: '只記錄可回溯的 terminal / frozen evidence。若只能證明日期、不足以證明分鐘級時間，就只顯示日期，不補猜。', close: '關閉北極星路徑', phaseAria: '研究階段摘要', legendAria: '路徑狀態圖例', openAria: '開啟北極星研究路徑', mvjRequired: 'MVJ 必要',
    },
  },
  [LANG_EN]: {
    brandSubtitle: 'Persistent Personal Agent Research',
    researchSnapshot: 'Verified research snapshot',
    githubLive: 'GitHub live data',
    updating: 'Updating…',
    unavailable: 'Unavailable',
    syncing: 'Syncing',
    resync: 'Resync',
    liveFailure: '{count} repositories could not load live data; the verified snapshot remains in place.',
    nav: {
      overview: 'Overview', northStar: 'North Star', tracks: 'Research Tracks', gates: 'Research Gates',
      benchmarks: 'Benchmarks', blockers: 'Blockers', activity: 'Activity Feed', evidence: 'Evidence Boundary',
    },
    repositories: 'Repositories',
    evidenceNote: 'This dashboard does not use an arbitrary percentage as “JARVIS completion.” Distance is measured through required capabilities, integration layers, and evidence-backed MVJ gates.',
    distanceQuestion: 'How far are we from the North Star?',
    distanceStage: 'Current stage: subsystem evidence → first trusted integration',
    evidenceTracks: 'Tracks with research evidence',
    integratedTracks: 'Integrated tracks',
    mvjGates: 'Required MVJ gates completed',
    criticalPath: 'Current critical path',
    viewIssue: 'View Issue',
    metrics: {
      tracks: 'Research tracks', evidence: 'Tracks with evidence', integrated: 'Integrated tracks', blockers: 'Verified blockers', issues: 'Open umbrella-repo issues',
      evidenceDetail: 'Not equivalent to validated', integratedDetail: 'No complete closed loop yet', blockerDetail: 'From verified snapshot', githubLive: 'GitHub live', snapshotFallback: 'Snapshot fallback',
    },
    tracks: { title: 'Research Track Progress', desc: 'Each track shows evidence maturity, not a subjective completion percentage.', legend: '0 Not started → 6 Independently reproduced' },
    gates: { title: 'Research Gates', desc: 'Only verified gate snapshots are shown.', track: 'Track', gate: 'Gate', verdict: 'Verdict', boundary: 'Evidence boundary' },
    blockers: { title: 'Current Blockers', desc: 'Ranked by dependency on the North Star.', source: 'Source' },
    benchmarks: { title: 'Key Benchmarks & Comparisons', desc: 'Results are displayed with their claim boundaries so a benchmark-specific advantage is not inflated into a SOTA claim.', answerable: 'answerable', noEvidence: 'no evidence' },
    claims: { title: 'Claim Boundary', desc: 'What the evidence currently supports—and what it does not.', supported: 'Currently supported by evidence', unsupported: 'Claims currently not supported' },
    milestones: { title: 'Critical MVJ Milestones', desc: 'Issue state comes from live GitHub data for the umbrella repository; the snapshot is used if the API is unavailable.', required: 'MVJ required' },
    activity: { title: 'Latest GitHub Activity', desc: 'This is a live activity signal, not an automatic research-gate upgrade.', live: 'LIVE ON REFRESH', loading: 'Loading GitHub live data…', empty: 'Live activity is unavailable; the verified snapshot remains usable.' },
    repoStatus: { title: 'Repository Status', desc: 'Live repository metadata, branches, and most recent PR.', branches: 'Branches', openIssues: 'Open issues + PRs', default: 'Default', lastPush: 'Last push', latestPr: 'Latest PR', openRepo: 'Open Repository', unavailable: 'Live metadata unavailable.' },
    footer: { title: 'Evidence-first dashboard', desc: 'Research progress advances only when the evidence boundary permits it.', snapshot: 'Verified snapshot', live: 'Live GitHub' },
    language: { label: 'Language', zh: '繁體中文', en: 'English' },
    maturityStage: 'Maturity stage {stage} of {total}',
    stage: 'Stage',
    status: {
      DEVELOPMENT_EVIDENCE: 'DEVELOPMENT EVIDENCE', PROTECTED_VALIDATION_FAILED: 'PROTECTED VALIDATION FAILED', RECOVERY_LINEAGES_FAILED_OR_INVALID: 'RECOVERY LINEAGES FAILED OR INVALID', PAAV_NOT_ESTABLISHED_PARE_RECOVERY_ADMITTED: 'PAAV NOT ESTABLISHED; PARE RECOVERY ADMITTED', SCOPED: 'SCOPED', NOT_STARTED: 'NOT STARTED',
      PASS: 'PASS', FAIL: 'FAIL', COMPLETE: 'COMPLETE', 'FAIL CLOSED': 'FAIL CLOSED', PROHIBITED: 'PROHIBITED', open: 'OPEN', closed: 'CLOSED', merged: 'MERGED', unknown: 'UNKNOWN',
    },
    timeline: {
      launcher: 'North Star Path', nodes: '{done}/{total} nodes', next: 'Next', pending: 'TBD',
      eyebrow: 'JARVIS ADVANCEMENT PATH', title: 'From Here to the North Star',
      intro: 'This is not a badge collection. It is a traceable research path: completed nodes preserve evidence and completion time, while unfinished nodes expose prerequisites and unlock conditions.',
      achieved: 'Achieved', current: 'Current target', blocked: 'Blocked', failed: 'Failed', future: 'Not started',
      verifiedDate: 'First verifiable date', achievedAt: 'Achieved at', terminalAt: 'Terminal evidence time', time: 'Time', inProgress: 'In progress', notAchieved: 'Not achieved',
      prereq: 'Prerequisites', none: 'None', evidence: 'Evidence', unlock: 'Unlock condition', waiting: 'Waiting for prerequisite research',
      phaseSummary: '{done}/{total} achieved', failedCount: '{count} failed',
      northStar: 'NORTH STAR', completed: 'Achieved', total: 'Total nodes', failedStat: 'Failed', blockedStat: 'Blocked', currentPosition: 'Current position', waitingNext: 'Waiting for the next verifiable node', recent: 'Most recently achieved',
      ruleTitle: 'Evidence-time rule', rule: 'Only traceable terminal or frozen evidence is recorded as completion. If evidence establishes only a date—not minute-level timing—the dashboard shows only the date and does not invent a timestamp.', close: 'Close North Star path', phaseAria: 'Research phase summary', legendAria: 'Path status legend', openAria: 'Open North Star research path', mvjRequired: 'MVJ REQUIRED',
    },
  },
};

const trackTranslations = {
  'RT-01': {
    zh: { name: '個人狀態', subtitle: '個人狀態與證據維護', detail: 'Candidate-v6 的 scientific Gate E 要求已完成；formal Gate E 仍因完整性條件維持 fail-closed。現有 lineage 中，Gate F 不可採納為正式進度。' },
    en: { name: 'Personal State', subtitle: 'Personal state and evidence maintenance', detail: 'Candidate-v6 scientific Gate E requirements are complete; formal Gate E remains integrity fail-closed. Gate F is not admissible as formal progress in the current lineage.' },
  },
  'RT-02': {
    zh: { name: '主動介入決策', subtitle: '主動介入決策規格', detail: 'Gate B–E 保留有界 evidence；Gate F 與 Candidate-v3–v9 的後續 recovery lineage 均未建立 protected generalization。Candidate-v9 在首個 formal H1 DEV-OOD holdout 未達門檻，protected evaluation 未執行。' },
    en: { name: 'Proactivity', subtitle: 'Specification-grounded intervention decisions', detail: 'Gates B–E retain bounded evidence; Gate F and Candidate-v3–v9 recovery lineages have not established protected generalization. Candidate-v9 missed thresholds on its first formal H1 DEV-OOD holdout and protected evaluation was not executed.' },
  },
  'RT-03': {
    zh: { name: '行動驗證', subtitle: '行動結果驗證與恢復', detail: 'Issue #2 已界定研究 protocol；implementation 與 protected evaluation 尚未開始。' },
    en: { name: 'Action Verification', subtitle: 'Action-outcome verification and recovery', detail: 'The research protocol is scoped in Issue #2; implementation and protected evaluation have not started.' },
  },
  'RT-04': {
    zh: { name: '長期連續性', subtitle: '跨會話長期連續性', detail: '目前受第一個 closed-loop benchmark 阻塞。' },
    en: { name: 'Long-Horizon', subtitle: 'Long-term continuity across sessions', detail: 'Blocked on the first closed-loop benchmark.' },
  },
  'RT-05': {
    zh: { name: '多模態脈絡', subtitle: '多模態證據 → 可信狀態', detail: '需要 evidence-to-state policy 與 closed-loop state mutation semantics。' },
    en: { name: 'Multimodal', subtitle: 'Multimodal evidence → trusted state', detail: 'Requires an evidence-to-state policy and closed-loop state mutation semantics.' },
  },
  'RT-06': {
    zh: { name: '跨裝置連續性', subtitle: '跨裝置一致狀態', detail: '需要 RT-01 state contract 與 closed-loop MVP。' },
    en: { name: 'Cross-device', subtitle: 'Consistent state across devices', detail: 'Requires the RT-01 state contract and a closed-loop MVP.' },
  },
  'RT-07': {
    zh: { name: '實體世界', subtitle: '實體世界行動能力', detail: '屬於後期研究軌道；高後果實體行動仍維持人類授權。' },
    en: { name: 'Physical World', subtitle: 'Physical-world action capability', detail: 'Late-stage research track; high-consequence physical actions remain human-authorized.' },
  },
};

const gateDetailTranslations = {
  'RT-02|Gate B': { zh: 'Specification consistency 與 bounded-state audit 已通過。', en: 'Specification consistency and bounded-state audit passed.' },
  'RT-02|Gate C': { zh: 'Oracle 與 benchmark validity 在 deterministic generated contexts 下通過。', en: 'Oracle and benchmark validity passed under deterministic generated contexts.' },
  'RT-02|Gate D': { zh: 'Baseline evaluation / integrity 已在 frozen protocol 下完成。', en: 'Baseline evaluation and integrity checks completed under the frozen protocol.' },
  'RT-02|Gate E': { zh: 'C5 通過 preregistered bounded synthetic validation；這不代表 protected/OOD 或真實世界 generalization。', en: 'C5 passed the preregistered bounded synthetic validation; this does not establish protected/OOD or real-world generalization.' },
  'RT-02|Gate F': { zh: 'C5 在 protected/OOD validation terminal FAIL：macro-F1 0.0476、24 組 action-changing protected counterfactual 中 0 組成功，且預測 collapse 為全數 IGNORE。', en: 'C5 terminally failed protected/OOD validation: macro-F1 0.0476, 0/24 action-changing protected counterfactual pairs, and an IGNORE-only prediction collapse.' },
  'RT-01|Gate E (scientific)': { zh: 'Candidate-v6 scientific requirements 已完成。', en: 'Candidate-v6 scientific requirements are complete.' },
  'RT-01|Gate E (formal)': { zh: '歷史完整性條件使 authoritative current lineage 無法 formal completion。', en: 'A historical integrity criterion prevents formal completion in the authoritative current lineage.' },
  'RT-01|Gate F': { zh: 'Authoritative PR 狀態仍禁止 sealed-final formal progress，直到合法宣告 clean-integrity lineage；後續 branch activity 未經 admissibility audit 不計入正式進度。', en: 'The authoritative PR status keeps sealed-final formal progress prohibited pending a legally declared clean-integrity lineage; later branch activity is not counted without an admissibility audit.' },
};

const blockerTranslations = {
  'PSE → PDA Integration Contract': {
    zh: { title: 'PSE → PDA 整合契約', text: '尚未 freeze StateSnapshot → InterventionDecision 的正式 contract；因此兩條研究線還不能形成閉環。' },
    en: { title: 'PSE → PDA Integration Contract', text: 'The formal StateSnapshot → InterventionDecision contract has not been frozen, so the two research lines cannot yet form a closed loop.' },
  },
  'PDA protected/OOD recovery': {
    zh: { title: 'PDA protected/OOD 復原路線', text: 'C5 在 Gate F terminal FAIL。若要取得 protected generalization evidence，必須建立新的 development/candidate lineage，並在候選者選定後凍結全新的 protected evaluation；既有 Gate-F set 不得用來調參後重複宣稱通過。' },
    en: { title: 'PDA protected/OOD recovery', text: 'C5 terminally failed Gate F. To obtain protected-generalization evidence, a new development/candidate lineage is required, followed by a fresh protected evaluation frozen after candidate selection. The existing Gate-F set cannot be used for tuning and then reused to claim a pass.' },
  },
  'Action Verification': {
    zh: { title: '行動驗證', text: '尚未建立「做了動作」與「任務真的成功」之間的驗證層，會阻塞 closed-loop benchmark。' },
    en: { title: 'Action Verification', text: 'There is not yet a verification layer between “an action was executed” and “the task actually succeeded,” which blocks the closed-loop benchmark.' },
  },
  'PSE formal integrity lineage': {
    zh: { title: 'PSE formal integrity lineage', text: 'Gate E formal 維持 fail-closed；在合法的新 integrity lineage 完成並通過 admissibility audit 前，不得把 Gate F 當正式進度。' },
    en: { title: 'PSE formal integrity lineage', text: 'Formal Gate E remains fail-closed. Gate F cannot count as formal progress until a valid new integrity lineage exists and passes an admissibility audit.' },
  },
};

const milestoneTranslations = {
  1: { zh: '凍結整合契約 v0.1', en: 'Freeze integration contracts v0.1' },
  2: { zh: '行動驗證研究 protocol', en: 'Action Verification research protocol' },
  3: { zh: '第一個 closed-loop 整合 benchmark', en: 'First closed-loop integration benchmark' },
  4: { zh: '長期連續性 benchmark', en: 'Long-horizon continuity benchmark' },
  5: { zh: '多模態脈絡 evidence-to-state', en: 'Multimodal context evidence-to-state' },
  6: { zh: '跨裝置連續性', en: 'Cross-device continuity' },
  7: { zh: '前沿 baseline 更新', en: 'Frontier baseline refresh' },
  8: { zh: 'Minimum Viable JARVIS 門檻', en: 'Minimum Viable JARVIS gate' },
};

const phaseTranslations = {
  'phase-0': { zh: { title: '任務建立', description: '把電影式 JARVIS 願景轉成可驗證的 Persistent Personal Agent 研究任務。' }, en: { title: 'Mission', description: 'Translate the cinematic JARVIS vision into a verifiable Persistent Personal Agent research program.' } },
  'phase-1': { zh: { title: '核心狀態與主動性', description: '先讓系統知道「現在什麼是真的」，再建立「現在該不該介入」的可稽核決策層。' }, en: { title: 'Core State + Proactivity', description: 'First establish what is true now, then build an auditable decision layer for whether and how the agent should intervene.' } },
  'phase-2': { zh: { title: '第一個可信閉環', description: '把 PSE 與 PDA 接起來，再加入執行結果驗證，形成 State → Decision → Action → Verification → State。' }, en: { title: 'First Trusted Closed Loop', description: 'Connect PSE and PDA, then add outcome verification to form State → Decision → Action → Verification → State.' } },
  'phase-3': { zh: { title: '長期連續與環境感知', description: '讓 agent 從單次閉環進化到跨時間、跨感官、跨裝置的持續存在。' }, en: { title: 'Long-Horizon + Context Continuity', description: 'Evolve the agent from a single closed loop into a persistent system spanning time, modalities, and devices.' } },
  'phase-4': { zh: { title: 'Minimum Viable JARVIS', description: '第一個可被嚴格驗收的整合式 Persistent Personal Agent，而不是只看起來像 JARVIS 的 demo。' }, en: { title: 'Minimum Viable JARVIS', description: 'The first rigorously testable integrated Persistent Personal Agent—not merely a demo that looks like JARVIS.' } },
  'phase-5': { zh: { title: '實體世界 → 北極星', description: 'MVJ 之後再把可信 agent 延伸到穿戴式與實體世界；高後果行動維持人類授權。' }, en: { title: 'Physical World → North Star', description: 'After MVJ, extend the trusted agent into wearables and the physical world while keeping high-consequence actions human-authorized.' } },
};

const nodeTranslations = {
  'mission-established': {
    zh: { title: 'Persistent Personal Agent 研究任務建立', description: '正式建立總研究 repo，定義 JARVIS-class 北極星、研究治理與子研究整合方向。', evidenceLabel: '任務 commit 824eb647' },
    en: { title: 'Persistent Personal Agent Research Mission Established', description: 'Established the umbrella research repository and defined the JARVIS-class North Star, research governance, and subsystem-integration direction.', evidenceLabel: 'Mission commit 824eb647' },
  },
  'pse-gate-e-scientific': {
    zh: { title: 'PSE Candidate-v6 scientific Gate E 完成', description: 'Personal State Engine 在 frozen development/protected evidence 上完成 Candidate-v6 scientific selection；形式完整性仍另有 blocker。', dependsOn: ['PSE benchmark / evaluator / A-MEM 比較'], note: '只有日期層級的 authoritative terminal evidence，因此不補猜分鐘級完成時間。', evidenceLabel: 'PSE Draft PR #2 authoritative Candidate-v6 terminal' },
    en: { title: 'PSE Candidate-v6 Scientific Gate E Completed', description: 'The Personal State Engine completed Candidate-v6 scientific selection on frozen development/protected evidence; formal integrity remains separately blocked.', dependsOn: ['PSE benchmark / evaluator / A-MEM comparison'], note: 'The authoritative terminal evidence establishes only the date, so no minute-level completion time is invented.', evidenceLabel: 'PSE Draft PR #2 authoritative Candidate-v6 terminal' },
  },
  'pse-integrity-lineage': {
    zh: { title: '建立合法的 PSE clean-integrity lineage', description: '解決歷史 SEALED-PATH-METADATA-001 導致的 formal Gate E fail-closed；任何 sealed-final 結果必須先通過 admissibility audit。', dependsOn: ['PSE Candidate-v6 scientific Gate E'], unlockCondition: '在接觸任何新的 protected/sealed surface 前宣告並 freeze 全新 integrity contract / lineage。', note: '這是研究完整性 blocker，不會因 branch 上出現 sealed-final workflow 就自動視為解除。', evidenceLabel: 'PSE PR #2 完整性邊界' },
    en: { title: 'Establish a Valid PSE Clean-Integrity Lineage', description: 'Resolve the formal Gate-E fail-closed state caused by historical SEALED-PATH-METADATA-001; any sealed-final result must first pass an admissibility audit.', dependsOn: ['PSE Candidate-v6 scientific Gate E'], unlockCondition: 'Declare and freeze a new integrity contract/lineage before touching any new protected or sealed surface.', note: 'This is a research-integrity blocker. A sealed-final workflow appearing on a branch does not automatically clear it.', evidenceLabel: 'PSE PR #2 integrity boundary' },
  },
  'pda-gate-b': {
    zh: { title: 'PDA Gate B — 規格一致性', description: 'PDA-SPEC-v2 的 bounded-state exhaustive audit 通過，建立 deterministic、fail-closed 的介入規格。', evidenceLabel: 'PDA Draft PR #7 terminal Gate-B evidence' },
    en: { title: 'PDA Gate B — Specification Consistency', description: 'The PDA-SPEC-v2 bounded-state exhaustive audit passed, establishing a deterministic, fail-closed intervention specification.', evidenceLabel: 'PDA Draft PR #7 terminal Gate-B evidence' },
  },
  'pda-gate-c': {
    zh: { title: 'PDA Gate C — Oracle / Benchmark Validity', description: 'benchmark_v2 完成 oracle、leakage、counterfactual、temporal 與 coverage 驗證。', dependsOn: ['PDA Gate B'], evidenceLabel: 'PDA Draft PR #8 Gate-C PASS' },
    en: { title: 'PDA Gate C — Oracle / Benchmark Validity', description: 'benchmark_v2 completed oracle, leakage, counterfactual, temporal, and coverage validation.', dependsOn: ['PDA Gate B'], evidenceLabel: 'PDA Draft PR #8 Gate-C PASS' },
  },
  'pda-gate-d': {
    zh: { title: 'PDA Gate D — Baseline Integrity', description: '凍結並驗證 deterministic comparison baselines，保留失敗 baseline 與 dependency amendment。', dependsOn: ['PDA Gate C'], evidenceLabel: 'PDA Draft PR #10 Gate-D PASS' },
    en: { title: 'PDA Gate D — Baseline Integrity', description: 'Frozen and validated deterministic comparison baselines while preserving failed baselines and the dependency amendment.', dependsOn: ['PDA Gate C'], evidenceLabel: 'PDA Draft PR #10 Gate-D PASS' },
  },
  'pda-gate-e': {
    zh: { title: 'PDA Gate E — Bounded Validation 通過', description: 'C5_semantic_factor_linear 在凍結 synthetic validation 上通過 preregistered criteria；macro-F1 0.6937，對 B5 delta +0.4791。', dependsOn: ['PDA Gate D'], note: '這個 PASS 只適用於 modeled / synthetic representation，不延伸成 OOD、真人偏好或真實世界能力。', evidenceLabel: 'PDA Draft PR #12 terminal Gate-E PASS' },
    en: { title: 'PDA Gate E — Bounded Validation PASS', description: 'C5_semantic_factor_linear passed the frozen synthetic validation under preregistered criteria; macro-F1 0.6937 with a +0.4791 delta over B5.', dependsOn: ['PDA Gate D'], note: 'This PASS applies only to the modeled/synthetic representation and does not establish OOD, human-preference, or real-world capability.', evidenceLabel: 'PDA Draft PR #12 terminal Gate-E PASS' },
  },
  'pda-gate-f': {
    zh: { title: 'PDA Gate F — Protected / OOD Validation', description: 'C5 在一次性 protected set 上失敗：macro-F1 0.0476，預測 collapse 為 IGNORE=120，action-changing counterfactual 0/24。', dependsOn: ['PDA Gate E'], note: '這個 protected set 已退休為 C5 confirmatory evidence；不得拿來調 C5 後再重複宣稱 Gate F PASS。', evidenceLabel: 'PDA Draft PR #14 terminal Gate-F FAIL' },
    en: { title: 'PDA Gate F — Protected / OOD Validation', description: 'C5 failed on the one-shot protected set: macro-F1 0.0476, predictions collapsed to IGNORE=120, and action-changing counterfactual pairs scored 0/24.', dependsOn: ['PDA Gate E'], note: 'This protected set is retired as confirmatory evidence for C5 and cannot be used to tune C5 and then reused to claim a Gate-F pass.', evidenceLabel: 'PDA Draft PR #14 terminal Gate-F FAIL' },
  },
  'pda-recovery': {
    zh: { title: 'PDA Protected/OOD 復原 Lineage', description: '若要補齊可信主動性，需要新的 development/candidate lineage，再於候選者固定後建立全新的 protected evaluation。', dependsOn: ['保留 Gate F 負面結果'], unlockCondition: '建立新 candidate lineage，且 fresh protected set 必須在新候選者 freeze 後才產生。', evidenceLabel: 'Gate-F terminal recovery rule' },
    en: { title: 'PDA Protected/OOD Recovery Lineage', description: 'Credible proactivity recovery requires a new development/candidate lineage and a fresh protected evaluation created only after the new candidate is frozen.', dependsOn: ['Gate F negative result preserved'], unlockCondition: 'Create a new candidate lineage; the fresh protected set must be generated only after the new candidate is frozen.', evidenceLabel: 'Gate-F terminal recovery rule' },
  },
  'pda-candidate-v9-development-fail': {
    zh: { title: 'Candidate-v9 Development — FAIL', description: 'Frozen V9-B 通過 pre-freeze validation，但第一個 formal H1 DEV-OOD holdout 未達 preregistered generalization 門檻：macro-F1 0.5772、ACT recall 0.2367。H2–H13 未執行；protected evaluation 不具資格且未執行。', dependsOn: ['Candidate-v8 immutable terminal lineage'], note: 'CANDIDATE_V9 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED；不得用 H1 結果救援後重跑 qualification。', evidenceLabel: 'PDA Candidate-v9 terminal development evidence' },
    en: { title: 'Candidate-v9 Development — FAIL', description: 'Frozen V9-B passed pre-freeze validation, but the first formal H1 DEV-OOD holdout missed preregistered generalization thresholds: macro-F1 0.5772 and ACT recall 0.2367. H2–H13 were not executed; protected evaluation was not eligible or executed.', dependsOn: ['Candidate-v8 immutable terminal lineage'], note: 'CANDIDATE_V9 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED; H1 outcomes cannot be used to rescue and rerun qualification.', evidenceLabel: 'PDA Candidate-v9 terminal development evidence' },
  },
  'pda-candidate-v3-confirmatory-fail': {
    zh: { title: 'Candidate-v3 Fresh Confirmatory — FAIL', description: '在 600 筆 fresh protected confirmatory evaluation 中，macro-F1 0.0476，WAIT=600/600，counterfactual exact-pair 0/120；Candidate-v3 lineage 因 terminal FAIL 終止。', dependsOn: ['Candidate-v3 frozen', 'historical Gate F FAIL preserved'], note: 'FRESH CONFIRMATORY FAIL — CANDIDATE_V3_LINEAGE_TERMINATED', evidenceLabel: 'PDA Candidate-v3 terminal 2a9e2f08' },
    en: { title: 'Candidate-v3 Fresh Confirmatory — FAIL', description: 'On the 600-example fresh protected confirmatory evaluation, macro-F1 was 0.0476, WAIT=600/600, and counterfactual exact-pair was 0/120; the Candidate-v3 lineage terminated with a terminal FAIL.', dependsOn: ['Candidate-v3 frozen', 'historical Gate F FAIL preserved'], note: 'FRESH CONFIRMATORY FAIL — CANDIDATE_V3_LINEAGE_TERMINATED', evidenceLabel: 'PDA Candidate-v3 terminal 2a9e2f08' },
  },
  'pda-candidate-v4-confirmatory-fail': {
    zh: { title: 'Candidate-v4 Fresh Confirmatory — FAIL', description: '在 600 筆 fresh protected confirmatory evaluation 中，macro-F1 0.0846，WAIT=544、SUGGEST=56，counterfactual exact-pair 0.0；Candidate-v4 lineage 因 terminal FAIL 終止。', dependsOn: ['Candidate-v4 development freeze ffb79eef', 'Candidate-v3 lineage terminated'], note: 'FRESH CONFIRMATORY FAIL — CANDIDATE V4 LINEAGE TERMINATED', evidenceLabel: 'PDA Candidate-v4 terminal 370aac30' },
    en: { title: 'Candidate-v4 Fresh Confirmatory — FAIL', description: 'On the 600-example fresh protected confirmatory evaluation, macro-F1 was 0.0846, WAIT=544, SUGGEST=56, and counterfactual exact-pair was 0.0; the Candidate-v4 lineage terminated with a terminal FAIL.', dependsOn: ['Candidate-v4 development freeze ffb79eef', 'Candidate-v3 lineage terminated'], note: 'FRESH CONFIRMATORY FAIL — CANDIDATE V4 LINEAGE TERMINATED', evidenceLabel: 'PDA Candidate-v4 terminal 370aac30' },
  },
  'pda-candidate-v5-integrity-invalid': {
    zh: { title: 'Candidate-v5 Integrity Terminal — INVALID', description: 'development 前因非預期 connector overfetch 暴露歷史 protected individual rows；未建立 Candidate-v5 corpus、candidate freeze、protected seed、dataset 或 scoring，因此此 execution lineage 以 integrity INVALID 終止。', dependsOn: ['Candidate-v4 lineage terminated', 'historical protected quarantine'], note: 'FRESH CONFIRMATORY INVALID — EVALUATION INTEGRITY FAILURE；保留為 invalidated evidence，不得重解釋成 performance 結果。', evidenceLabel: 'PDA Candidate-v5 integrity terminal 0af794aa' },
    en: { title: 'Candidate-v5 Integrity Terminal — INVALID', description: 'Historical protected individual rows were exposed by unintended connector overfetch before development. No Candidate-v5 corpus, candidate freeze, protected seed, dataset, or scoring was produced, so the execution lineage terminated as integrity INVALID.', dependsOn: ['Candidate-v4 lineage terminated', 'historical protected quarantine'], note: 'FRESH CONFIRMATORY INVALID — EVALUATION INTEGRITY FAILURE; preserved as invalidated evidence and not reinterpreted as a performance result.', evidenceLabel: 'PDA Candidate-v5 integrity terminal 0af794aa' },
  },
  'pda-candidate-v6-development-fail': {
    zh: { title: 'Candidate-v6 Development — FAIL', description: 'validation macro-F1 0.9972，但 mandatory safety gates 未通過：DEV-OOD forbidden ACT=1、counterfactual forbidden ACT=4。Protected evaluation 從未建立或執行。', dependsOn: ['Fresh clean execution context', 'Candidate-v5 invalid lineage preserved'], note: 'CANDIDATE_V6 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED；freeze-manifest chronology deviation 保留，未授權 protected progression。', evidenceLabel: 'PDA Candidate-v6 terminal f7bb15ab' },
    en: { title: 'Candidate-v6 Development — FAIL', description: 'Validation macro-F1 was 0.9972, but mandatory safety gates failed: DEV-OOD forbidden ACT=1 and counterfactual forbidden ACT=4. Protected evaluation was never created or run.', dependsOn: ['Fresh clean execution context', 'Candidate-v5 invalid lineage preserved'], note: 'CANDIDATE_V6 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED; the freeze-manifest chronology deviation is preserved and protected progression was not authorized.', evidenceLabel: 'PDA Candidate-v6 terminal f7bb15ab' },
  },
  'pda-candidate-v7-development-fail': {
    zh: { title: 'Candidate-v7 Development — FAIL', description: 'Frozen V7-B 在 preregistered validation 達 macro-F1 1.0、ACT recall 1.0、forbidden ACT=0，但多個 post-freeze development holdouts 失敗；DEV-OOD ACT recall 降至 0.07，counterfactual exact-pair 0.10，protected evaluation 未執行。', dependsOn: ['Candidate-v7 freeze 545af659', 'Candidate-v6 terminal lineage preserved'], note: 'CANDIDATE_V7 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED；candidate 在 first holdout 前已 freeze，不得用 holdout 結果回頭修正。', evidenceLabel: 'PDA Candidate-v7 terminal 83e41d91' },
    en: { title: 'Candidate-v7 Development — FAIL', description: 'Frozen V7-B reached macro-F1 1.0, ACT recall 1.0, and forbidden ACT=0 on preregistered validation, but multiple post-freeze development holdouts failed. DEV-OOD ACT recall fell to 0.07, counterfactual exact-pair was 0.10, and protected evaluation was not executed.', dependsOn: ['Candidate-v7 freeze 545af659', 'Candidate-v6 terminal lineage preserved'], note: 'CANDIDATE_V7 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED; the candidate was frozen before the first holdout and holdout outcomes cannot be used for retroactive repair.', evidenceLabel: 'PDA Candidate-v7 terminal 83e41d91' },
  },
  'pda-candidate-v8-development-fail': {
    zh: { title: 'Candidate-v8 Development — FAIL', description: 'Frozen V8-C 在 validation qualified（macro-F1 0.9917；ACT recall/precision 1.0/1.0；forbidden/false ACT=0/0），但第一個 formal H1 DEV-OOD holdout 因 frozen parser 產生 invalid structured state 而 terminal；未授權 repair、rerun 或 protected evaluation。', dependsOn: ['Candidate-v8 freeze d4077860', 'Candidate-v7 immutable terminal lineage'], note: 'CANDIDATE_V8 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · FROZEN_CANDIDATE_SEMANTIC_FAILURE_NOT_INFRASTRUCTURE_ONLY · protected_executed=false', evidenceLabel: 'PDA Candidate-v8 terminal 887903e8' },
    en: { title: 'Candidate-v8 Development — FAIL', description: 'Frozen V8-C qualified on validation (macro-F1 0.9917; ACT recall/precision 1.0/1.0; forbidden/false ACT=0/0), but the first formal H1 DEV-OOD holdout terminated on an invalid structured state emitted by the frozen parser. No repair, rerun, or protected evaluation was authorized.', dependsOn: ['Candidate-v8 freeze d4077860', 'Candidate-v7 immutable terminal lineage'], note: 'CANDIDATE_V8 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · FROZEN_CANDIDATE_SEMANTIC_FAILURE_NOT_INFRASTRUCTURE_ONLY · protected_executed=false', evidenceLabel: 'PDA Candidate-v8 terminal 887903e8' },
  },
  'pda-candidate-v10-development-fail': {
    zh: { title: 'Candidate-v10 Development — FAIL', description: 'Candidate-v10 在 candidate freeze 前即失敗：V10-A/B/C 均未通過全部 preregistered architecture qualification gates。所有架構都未達 lexical novelty、contradiction detection 與 contradiction false-certainty 要求；V10-B 另未通過 supersession 與 counterfactual directional/ACT-disable。H1–H15 與 protected evaluation 均未執行。', dependsOn: ['Candidate-v9 terminal lineage preserved', 'Candidate-v10 preregistration'], note: 'CANDIDATE_V10 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · PRE_FREEZE_ARCHITECTURE_QUALIFICATION · no candidate freeze · protected_executed=false', evidenceLabel: 'PDA Candidate-v10 terminal 0bed7520' },
    en: { title: 'Candidate-v10 Development — FAIL', description: 'Candidate-v10 failed before candidate freeze because V10-A/B/C each missed one or more preregistered architecture-qualification gates. All architectures failed lexical novelty, contradiction detection, and contradiction false-certainty requirements; V10-B also failed supersession and counterfactual directional/ACT-disable checks. H1–H15 and protected evaluation were not executed.', dependsOn: ['Candidate-v9 terminal lineage preserved', 'Candidate-v10 preregistration'], note: 'CANDIDATE_V10 DEVELOPMENT FAIL — NO CANDIDATE QUALIFIED · PRE_FREEZE_ARCHITECTURE_QUALIFICATION · no candidate freeze · protected_executed=false', evidenceLabel: 'PDA Candidate-v10 terminal 0bed7520' },
  },
  'pda-v7r-independent-requalification-fail': {
    zh: { title: 'Candidate-v7 Independent Requalification (V7R) — FAIL', description: 'Frozen V7A-01 完成 5/5 次獨立 preregistered qualification，共 1,750 筆 fresh protected examples；research integrity PASS、candidate 未變更、protected-example access NONE，但 fresh OOD macro-F1 0.615642、ACT recall 0.38、Lexical 0.082051、Scope 0.060109、counterfactual exact-pair 0.291429，未達多項事前門檻。這是有效 scientific FAIL，不是 infrastructure invalidity。', dependsOn: ['Frozen V7A-01 immutable candidate', 'Independent V7R preregistration'], note: 'V7R REQUALIFICATION FAIL — CANDIDATE_V7_QUALIFICATION_LINEAGE_TERMINATED · Fresh Confirmatory NOT_AUTHORIZED · Gate G NOT_EXECUTED', evidenceLabel: 'PDA V7R terminal a247c8b9' },
    en: { title: 'Candidate-v7 Independent Requalification (V7R) — FAIL', description: 'Frozen V7A-01 completed 5/5 independently preregistered qualification runs over 1,750 fresh protected examples. Research integrity passed, the candidate was unchanged, and protected-example access was NONE, but fresh OOD macro-F1 0.615642, ACT recall 0.38, Lexical 0.082051, Scope 0.060109, and counterfactual exact-pair 0.291429 missed multiple preregistered thresholds. This is a valid scientific FAIL, not infrastructure invalidity.', dependsOn: ['Frozen V7A-01 immutable candidate', 'Independent V7R preregistration'], note: 'V7R REQUALIFICATION FAIL — CANDIDATE_V7_QUALIFICATION_LINEAGE_TERMINATED · Fresh Confirmatory NOT_AUTHORIZED · Gate G NOT_EXECUTED', evidenceLabel: 'PDA V7R terminal a247c8b9' },
  },
  'pare-v03-protected-recovery': {
    zh: { title: 'PARE v0.3 Protected Recovery Evidence', description: '72 筆 protected；Candidate-v2 86.11% vs B0 61.11%，差異 +25.00 pp，bootstrap 95% CI [+15.28, +34.72]。這只支持 benchmark-specific recovery/state-repair evidence。', dependsOn: ['Independent PARE lineage'], note: 'BENCHMARK-SPECIFIC ONLY；duplicate side-effect 2.78%；PAAV / RT-03 Action Verification 尚未建立。', evidenceLabel: 'PARE v0.3 terminal cfa1a4b2' },
    en: { title: 'PARE v0.3 Protected Recovery Evidence', description: '72 protected examples; Candidate-v2 86.11% vs B0 61.11%, a +25.00 pp difference with bootstrap 95% CI [+15.28, +34.72]. This supports benchmark-specific recovery/state-repair evidence only.', dependsOn: ['Independent PARE lineage'], note: 'BENCHMARK-SPECIFIC ONLY; duplicate side-effect 2.78%; PAAV / RT-03 Action Verification is not established.', evidenceLabel: 'PARE v0.3 terminal cfa1a4b2' },
  },
  'integration-contract': {
    zh: { title: '凍結 PSE → PDA 整合契約 v0.1', description: '正式定義 StateSnapshot、InterventionDecision、ActionAttempt、VerificationRecord，以及 disputed/no-evidence 的 fail-closed semantics。', dependsOn: ['RT-01 state semantics', 'RT-02 bounded decision semantics'], unlockCondition: '完成 Issue #1 acceptance checklist 並 freeze contract identity。', note: '這是目前 umbrella architecture 的 critical path；PDA protected/OOD recovery 仍需平行處理。' },
    en: { title: 'Freeze PSE → PDA Integration Contract v0.1', description: 'Formally define StateSnapshot, InterventionDecision, ActionAttempt, VerificationRecord, and fail-closed semantics for disputed/no-evidence states.', dependsOn: ['RT-01 state semantics', 'RT-02 bounded decision semantics'], unlockCondition: 'Complete the Issue #1 acceptance checklist and freeze the contract identity.', note: 'This is the umbrella architecture’s current critical path; PDA protected/OOD recovery must proceed in parallel.' },
  },
  'action-verification': {
    zh: { title: 'Action Verification 取得 development evidence', description: '證明 agent 不只「做了動作」，還能驗證目標真的完成，並處理 inconclusive / recovery / rollback。', dependsOn: ['Integration Contract v0.1'], unlockCondition: 'Issue #2 protocol + implementation + development evidence。' },
    en: { title: 'Action Verification Reaches Development Evidence', description: 'Demonstrate that the agent can verify the intended outcome—not merely execute an action—and handle inconclusive results, recovery, and rollback.', dependsOn: ['Integration Contract v0.1'], unlockCondition: 'Issue #2 protocol + implementation + development evidence.' },
  },
  'closed-loop-benchmark': {
    zh: { title: '第一個 Closed-loop 整合 Benchmark', description: '第一次完整驗證 State → Proactivity → Action → Verification → State Update 的可重現閉環。', dependsOn: ['Integration Contract v0.1', 'RT-03 Action Verification', '可採納的 proactivity policy'], unlockCondition: 'Issue #3 benchmark freeze、execution、verification 與 fail-closed result。' },
    en: { title: 'First Closed-loop Integration Benchmark', description: 'First reproducible end-to-end validation of State → Proactivity → Action → Verification → State Update.', dependsOn: ['Integration Contract v0.1', 'RT-03 Action Verification', 'admissible proactivity policy'], unlockCondition: 'Issue #3 benchmark freeze, execution, verification, and fail-closed result.' },
  },
  'long-horizon': {
    zh: { title: '長期連續性', description: '跨會話、跨天持續追蹤任務、依賴、等待與重新規劃，而不遺失限制或提早宣告完成。', dependsOn: ['第一個 Closed-loop Benchmark'], unlockCondition: 'Issue #4 protected long-horizon continuity evidence。' },
    en: { title: 'Long-Horizon Continuity', description: 'Track tasks, dependencies, waits, and replanning across sessions and days without losing constraints or declaring completion prematurely.', dependsOn: ['First Closed-loop Benchmark'], unlockCondition: 'Issue #4 protected long-horizon continuity evidence.' },
  },
  'multimodal': {
    zh: { title: '多模態脈絡 → 可信狀態', description: '把視覺、語音、螢幕與事件等多模態觀察轉成有 provenance、confidence 與更新規則的 world/personal state。', dependsOn: ['Closed-loop state mutation semantics'], unlockCondition: 'Issue #5 evidence-to-state policy + benchmark。' },
    en: { title: 'Multimodal Context → Trusted State', description: 'Convert visual, voice, screen, and event observations into world/personal state with provenance, confidence, and update rules.', dependsOn: ['Closed-loop state mutation semantics'], unlockCondition: 'Issue #5 evidence-to-state policy + benchmark.' },
  },
  'cross-device': {
    zh: { title: '跨裝置連續性', description: 'Mac、手機、穿戴裝置共享同一可信 state 與 action history，而不是各自形成互相衝突的 AI。', dependsOn: ['RT-01 state contract', 'Closed-loop agent'], unlockCondition: 'Issue #6 consistency / conflict / handoff evidence。' },
    en: { title: 'Cross-device Continuity', description: 'Mac, phone, and wearable surfaces share one trusted state and action history instead of diverging into conflicting agents.', dependsOn: ['RT-01 state contract', 'Closed-loop agent'], unlockCondition: 'Issue #6 consistency / conflict / handoff evidence.' },
  },
  'mvj': {
    zh: { title: 'Minimum Viable JARVIS 門檻', description: '整合 persistent state、proactivity、action verification、long-horizon、multimodal 與 cross-device 的最低可信版本。', dependsOn: ['Issues #1–#6 必要證據', 'PDA protected recovery 或同等可採納 robustness evidence'], unlockCondition: 'Issue #8 的所有 acceptance criteria 以 admissible evidence 通過。' },
    en: { title: 'Minimum Viable JARVIS Gate', description: 'The minimum credible integration of persistent state, proactivity, action verification, long-horizon continuity, multimodal context, and cross-device continuity.', dependsOn: ['Required evidence from Issues #1–#6', 'PDA protected recovery or equivalent admissible robustness evidence'], unlockCondition: 'All Issue #8 acceptance criteria pass with admissible evidence.' },
  },
  'physical-world': {
    zh: { title: '實體世界 Agent Evidence', description: '讓 agent 能安全地理解並控制可驗證的實體裝置／機器人任務，包含權限、失敗偵測與人類介入邊界。', dependsOn: ['Minimum Viable JARVIS'], unlockCondition: 'RT-07 development → protected validation evidence。' },
    en: { title: 'Physical-World Agent Evidence', description: 'Enable the agent to safely understand and control verifiable physical-device or robotics tasks with permissions, failure detection, and human-intervention boundaries.', dependsOn: ['Minimum Viable JARVIS'], unlockCondition: 'RT-07 development → protected validation evidence.' },
  },
  'north-star': {
    zh: { title: 'JARVIS-class 持續型個人 AI 代理', description: '長期存在、理解你與環境、知道何時介入、能執行並驗證、跨裝置延續，且在安全授權下逐步進入實體世界。', dependsOn: ['MVJ', 'RT-07', '獨立重現 / 真實世界可靠性 / 安全證據'], unlockCondition: '北極星 acceptance criteria 必須以跨場景、可重現、可稽核 evidence 達成，而非單一 demo。' },
    en: { title: 'JARVIS-class Persistent Personal Agent', description: 'A long-lived agent that understands you and the environment, knows when to intervene, can act and verify outcomes, persists across devices, and progressively enters the physical world under safe authorization.', dependsOn: ['MVJ', 'RT-07', 'independent reproduction / real-world reliability / safety evidence'], unlockCondition: 'North Star acceptance criteria must be met with cross-scenario, reproducible, auditable evidence—not a single demo.' },
  },
};

const claimTranslations = {
  supported: {
    zh: [
      'PSE Candidate-v6 在指定 adversarial-v7 no-evidence subset 的 false retrieval 低於 exact A-MEM。',
      'PDA-SPEC-v2 在已審核 bounded state space 中具 deterministic / invariant consistency evidence。',
      'PDA C5 在 Protocol-v2 Gate E 的 bounded synthetic validation 通過 preregistered criteria。',
      'PDA C5 在 Gate F protected/OOD validation terminal FAIL；此負面結果被保留並限制後續宣稱。',
      'PDA Candidate-v9 在 pre-freeze validation 通過，但首個 formal H1 DEV-OOD 僅 macro-F1 0.5772、ACT recall 0.2367，因此 terminal development FAIL；protected evaluation 未執行。',
    ],
    en: [
      'PSE Candidate-v6 has lower false retrieval than exact A-MEM on the specified adversarial-v7 no-evidence subset.',
      'PDA-SPEC-v2 has deterministic and invariant-consistency evidence within the audited bounded state space.',
      'PDA C5 passed preregistered criteria on the Protocol-v2 Gate-E bounded synthetic validation.',
      'PDA C5 terminally failed Gate-F protected/OOD validation; the negative result is preserved and constrains subsequent claims.',
      'PDA Candidate-v9 passed pre-freeze validation but terminally failed development on its first formal H1 DEV-OOD holdout at macro-F1 0.5772 and ACT recall 0.2367; protected evaluation was not executed.',
    ],
  },
  notSupported: {
    zh: [
      'PSE 已達 SOTA，或在所有情境都優於 A-MEM。',
      'PDA 已具 protected/OOD generalization 或真實世界脈絡能力。',
      'PDA 能產生普遍正確或符合人類偏好的主動行為。',
      'Candidate-v9 已建立 protected/OOD generalization、Gate G authorization、closed-loop readiness 或 production safety。',
      'Minimum Viable JARVIS 已經達成。',
    ],
    en: [
      'PSE is SOTA or universally better than A-MEM.',
      'PDA has protected/OOD generalization or real-world contextual competence.',
      'PDA produces universally correct or human-preferred proactive behavior.',
      'Candidate-v9 establishes protected/OOD generalization, Gate G authorization, closed-loop readiness, or production safety.',
      'Minimum Viable JARVIS has been achieved.',
    ],
  },
};

function langKey(lang) {
  return lang === LANG_EN ? 'en' : 'zh';
}

function replaceVars(text, vars = {}) {
  return String(text).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

export function translate(lang, path, vars) {
  const parts = path.split('.');
  let value = dictionary[lang] || dictionary[LANG_ZH];
  for (const part of parts) value = value?.[part];
  return replaceVars(value ?? path, vars);
}

export function statusLabel(lang, value) {
  return dictionary[lang]?.status?.[value] || value;
}

export function getLocalizedSnapshot(lang) {
  const key = langKey(lang);
  const snapshot = verifiedSnapshot;
  const northStar = {
    ...snapshot.northStar,
    description: lang === LANG_EN
      ? 'Build a long-lived personal AI agent that understands current state, assists proactively under explicit permissions, acts and verifies outcomes, persists across devices, and progressively enters the physical world.'
      : '建立一個長期存在、理解目前狀態、能在明確權限下主動協助、執行並驗證結果，且可跨裝置延續並逐步進入實體世界的個人 AI 代理。',
  };

  const tracks = snapshot.tracks.map((track) => ({ ...track, ...(trackTranslations[track.id]?.[key] || {}) }));
  const gates = snapshot.gates.map((gate) => ({
    ...gate,
    verdictLabel: statusLabel(lang, gate.verdict),
    detail: gateDetailTranslations[`${gate.track}|${gate.gate}`]?.[key] || gate.detail,
  }));

  const benchmarks = {
    pse: {
      ...snapshot.benchmarks.pse,
      claim: lang === LANG_EN
        ? 'Benchmark-specific safety advantage only; overall superiority and SOTA are NOT supported.'
        : '僅支持此 benchmark 特定的安全優勢；不支持整體優越性或 SOTA 宣稱。',
    },
    pda: {
      ...snapshot.benchmarks.pda,
      values: lang === LANG_EN
        ? [['Raw combinations', '62,208'], ['Valid states', '41,472'], ['Nondeterministic outputs', '0'], ['Mandatory invariant violations', '0']]
        : [['原始組合數', '62,208'], ['有效狀態', '41,472'], ['非決定性輸出', '0'], ['強制 invariant 違反', '0']],
      claim: lang === LANG_EN
        ? 'Specification consistency and bounded Gate-E performance are supported; Gate-F protected/OOD generalization failed and real-world usefulness remains unestablished.'
        : '目前支持規格一致性與有界 Gate-E 表現；Gate-F protected/OOD generalization 已失敗，真實世界效用仍未建立。',
    },
  };

  const blockers = snapshot.blockers.map((blocker) => ({ ...blocker, ...(blockerTranslations[blocker.title]?.[key] || {}) }));
  const milestones = snapshot.milestones.map((milestone) => ({ ...milestone, title: milestoneTranslations[milestone.issue]?.[key] || milestone.title }));

  const phases = snapshot.advancementTimeline.phases.map((phase) => ({
    ...phase,
    ...(phaseTranslations[phase.id]?.[key] || {}),
    nodes: phase.nodes.map((node) => ({ ...node, ...(nodeTranslations[node.id]?.[key] || {}) })),
  }));

  return {
    ...snapshot,
    northStar,
    tracks,
    gates,
    benchmarks,
    blockers,
    claims: {
      supported: claimTranslations.supported[key],
      notSupported: claimTranslations.notSupported[key],
    },
    milestones,
    advancementTimeline: { ...snapshot.advancementTimeline, phases },
  };
}

const LanguageContext = createContext(null);

function resolveInitialLanguage() {
  if (typeof window === 'undefined') return LANG_ZH;
  const query = new URLSearchParams(window.location.search).get('lang');
  if (query === LANG_EN || query === 'en-US') return LANG_EN;
  if (query === LANG_ZH || query === 'zh-TW' || query === 'zh') return LANG_ZH;
  const saved = window.localStorage.getItem('jarvis-dashboard-language');
  if (saved === LANG_EN || saved === LANG_ZH) return saved;
  return LANG_ZH;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(resolveInitialLanguage);

  const setLanguage = (next) => {
    const normalized = next === LANG_EN ? LANG_EN : LANG_ZH;
    setLanguageState(normalized);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === LANG_EN ? 'JARVIS Research Dashboard' : 'JARVIS 研究儀表板';
    window.localStorage.setItem('jarvis-dashboard-language', language);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    window.history.replaceState({}, '', url);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (path, vars) => translate(language, path, vars),
    snapshot: getLocalizedSnapshot(language),
    locale: language === LANG_EN ? 'en-US' : 'zh-TW',
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
