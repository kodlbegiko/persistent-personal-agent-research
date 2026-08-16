import { useMemo } from 'react';

const STAGE_COPY = {
  'zh-Hant': {
    eyebrow: '白話進度',
    title: '現在做到哪裡？',
    summary: '目前已經有「理解你的狀態」與「判斷何時介入」的研究基礎，但還沒有形成一個能長期、可靠、自主完成事情的 JARVIS 閉環。',
    currentFocus: '目前最重要的事',
    currentFocusText: '先把「理解你現在的狀態」和「判斷現在該不該幫忙」真正接起來，然後再驗證它在陌生情境下也能可靠運作。',
    noFakePercent: '研究不是線性的百分比，所以這裡不顯示容易誤導的「完成 XX%」，改用每一層能力是否已被證明來看。',
    metrics: {
      tracks: '總能力線',
      evidence: '已有開發證據',
      integrated: '已完成整合',
      gates: '正式可用門檻',
    },
    metricHelp: {
      tracks: '整個 JARVIS 被拆成 7 條研究能力線',
      evidence: '至少進入「已有研究證據」階段',
      integrated: '已經接進完整系統的能力',
      gates: '完整閉環必須通過的正式門檻；0/8 不代表成果為零',
    },
    flowTitle: '把 JARVIS 拆成 5 個一般人看得懂的能力層',
    flowDesc: '越往右越接近真正能長期替你做事的個人 AI。',
    statuses: {
      evidence: '已有基礎證據',
      caution: '有進展，但還不可靠',
      waiting: '尚未建立',
      future: '尚未開始',
    },
    steps: [
      {
        number: '01',
        title: '理解你現在的狀態',
        subtitle: '知道你現在需要什麼、有哪些限制',
        detail: '已累積 Personal State 研究證據；但形式完整性仍有 blocker，所以不能說這一層已完全完成。',
        tone: 'evidence',
      },
      {
        number: '02',
        title: '判斷現在該不該主動幫忙',
        subtitle: '知道什麼時候要提醒、建議或先不要打擾',
        detail: '在規則與部分測試中有成果，但陌生／受保護情境曾失敗，代表泛化能力還沒有被證明。',
        tone: 'caution',
      },
      {
        number: '03',
        title: '做完後確認真的有完成',
        subtitle: '不是只「執行」，還要知道結果對不對',
        detail: 'Action Verification 還沒有被科學建立；目前的 recovery 證據不能替代真正的結果驗證。',
        tone: 'waiting',
      },
      {
        number: '04',
        title: '長期記住、跨裝置、看懂更多訊號',
        subtitle: '跨會話、多模態、Mac／手機等裝置持續一致',
        detail: 'Long-Horizon、Multimodal、Cross-device 都還在等待前面的閉環能力先成立。',
        tone: 'future',
      },
      {
        number: '05',
        title: '進入實體世界執行',
        subtitle: '讓 AI 從螢幕走到真實世界',
        detail: '這是後期能力，目前尚未開始；高後果實體行動仍會保留人類授權。',
        tone: 'future',
      },
    ],
    nowTitle: '一句話看現在',
    done: '已經做到',
    doneText: '研究任務已建立，而且前 2 條核心能力線已經累積可驗證的開發證據。',
    blocked: '現在卡住',
    blockedText: '最主要不是「沒有做東西」，而是還沒證明它在陌生情境、研究完整性與行動結果驗證上足夠可靠。',
    next: '下一步',
    nextText: '先完成 Personal State → Proactivity 的整合契約，形成第一個可驗證閉環，再往長期記憶、跨裝置與實體世界推進。',
    technical: '技術上的當前 critical path',
  },
  en: {
    eyebrow: 'PLAIN-LANGUAGE PROGRESS',
    title: 'Where are we now?',
    summary: 'There is now research groundwork for understanding your state and deciding when to intervene, but there is not yet a reliable, long-running JARVIS closed loop that can autonomously finish real tasks.',
    currentFocus: 'Most important work now',
    currentFocusText: 'Connect “understand your current state” to “decide whether to help now”, then prove that the combined system remains reliable in unfamiliar situations.',
    noFakePercent: 'Research is not a linear percentage, so this view avoids a misleading “XX% complete” and instead shows which capability layers have actually been demonstrated.',
    metrics: {
      tracks: 'Capability tracks',
      evidence: 'With development evidence',
      integrated: 'Integrated',
      gates: 'Formal readiness gates',
    },
    metricHelp: {
      tracks: 'JARVIS is split into 7 research capability tracks',
      evidence: 'Tracks that have reached at least development-evidence level',
      integrated: 'Capabilities integrated into the full system',
      gates: 'Formal closed-loop gates; 0/8 does not mean zero research progress',
    },
    flowTitle: 'JARVIS in 5 capability layers',
    flowDesc: 'Moving right means getting closer to a personal AI that can reliably work for you over time.',
    statuses: {
      evidence: 'Foundational evidence',
      caution: 'Progress, not reliable yet',
      waiting: 'Not established',
      future: 'Not started',
    },
    steps: [
      {
        number: '01',
        title: 'Understand your current state',
        subtitle: 'Know what you need now and what constraints apply',
        detail: 'Personal State research evidence exists, but a formal integrity blocker remains, so this layer is not fully complete.',
        tone: 'evidence',
      },
      {
        number: '02',
        title: 'Decide whether to help proactively',
        subtitle: 'Know when to remind, suggest, act, or stay quiet',
        detail: 'Some bounded tests passed, but protected / unfamiliar-context evaluations failed, so generalization is not established.',
        tone: 'caution',
      },
      {
        number: '03',
        title: 'Verify that the action actually worked',
        subtitle: 'Do not merely execute — confirm the real outcome',
        detail: 'Action Verification is not scientifically established. Recovery evidence does not substitute for outcome verification.',
        tone: 'waiting',
      },
      {
        number: '04',
        title: 'Remember long-term, span devices, understand more signals',
        subtitle: 'Long-horizon continuity, multimodal input, and cross-device state',
        detail: 'Long-Horizon, Multimodal, and Cross-device work is waiting on a trustworthy closed loop first.',
        tone: 'future',
      },
      {
        number: '05',
        title: 'Act in the physical world',
        subtitle: 'Move from screens into real-world action',
        detail: 'This is a later-stage capability and has not started. High-consequence physical actions remain human-authorized.',
        tone: 'future',
      },
    ],
    nowTitle: 'Current state in one glance',
    done: 'What exists',
    doneText: 'The research mission is established, and the first 2 core capability tracks have accumulated verifiable development evidence.',
    blocked: 'What is blocking progress',
    blockedText: 'The main gap is not lack of work; it is lack of proof that the system is reliable under unfamiliar contexts, research-integrity constraints, and real action-result verification.',
    next: 'Next move',
    nextText: 'Finish the Personal State → Proactivity integration contract, build the first verifiable closed loop, then expand toward long-term continuity, cross-device operation, and the physical world.',
    technical: 'Technical critical path',
  },
};

function collectTimelineEvents(snapshot) {
  return (snapshot.advancementTimeline?.phases || [])
    .flatMap((phase) => phase.nodes || [])
    .filter((node) => node.achievedAt || node.terminalAt);
}

export default function PlainLanguageProgress({ snapshot, language = 'zh-Hant' }) {
  const copy = STAGE_COPY[language] || STAGE_COPY['zh-Hant'];
  const evidenceTracks = snapshot.tracks.filter((track) => track.stage >= 2).length;
  const integratedTracks = snapshot.tracks.filter((track) => track.stage >= 6).length;
  const timelineEvents = useMemo(() => collectTimelineEvents(snapshot), [snapshot]);
  const negativeEvents = timelineEvents.filter((node) => ['failed', 'blocked'].includes(node.status)).length;

  return (
    <section className="plain-progress section-block" aria-labelledby="plain-progress-title">
      <div className="plain-progress-intro">
        <div>
          <span className="plain-progress-eyebrow">{copy.eyebrow}</span>
          <h2 id="plain-progress-title">{copy.title}</h2>
          <p className="plain-progress-summary">{copy.summary}</p>
        </div>
        <div className="plain-progress-focus">
          <span>{copy.currentFocus}</span>
          <strong>{copy.currentFocusText}</strong>
        </div>
      </div>

      <div className="plain-progress-metrics" aria-label={copy.title}>
        <article>
          <span>{copy.metrics.tracks}</span>
          <strong>{snapshot.tracks.length}</strong>
          <small>{copy.metricHelp.tracks}</small>
        </article>
        <article>
          <span>{copy.metrics.evidence}</span>
          <strong>{evidenceTracks} / {snapshot.tracks.length}</strong>
          <div className="plain-mini-bar" aria-hidden="true"><i style={{ width: `${(evidenceTracks / snapshot.tracks.length) * 100}%` }} /></div>
          <small>{copy.metricHelp.evidence}</small>
        </article>
        <article>
          <span>{copy.metrics.integrated}</span>
          <strong>{integratedTracks} / {snapshot.tracks.length}</strong>
          <div className="plain-mini-bar" aria-hidden="true"><i style={{ width: `${Math.max(2, (integratedTracks / snapshot.tracks.length) * 100)}%` }} /></div>
          <small>{copy.metricHelp.integrated}</small>
        </article>
        <article>
          <span>{copy.metrics.gates}</span>
          <strong>{snapshot.northStar.mvjCompletedGates} / {snapshot.northStar.mvjRequiredGates}</strong>
          <small>{copy.metricHelp.gates}</small>
        </article>
      </div>

      <p className="plain-progress-percent-note">{copy.noFakePercent}</p>

      <div className="plain-progress-flow-head">
        <div>
          <h3>{copy.flowTitle}</h3>
          <p>{copy.flowDesc}</p>
        </div>
        <span className="plain-negative-evidence">{language === 'en' ? `${negativeEvents} negative / blocked evidence events preserved` : `已保留 ${negativeEvents} 筆失敗／阻塞證據`}</span>
      </div>

      <ol className="plain-progress-flow">
        {copy.steps.map((step, index) => (
          <li key={step.number} className={`plain-step tone-${step.tone}`}>
            <div className="plain-step-marker" aria-hidden="true"><span>{step.number}</span></div>
            <div className="plain-step-card">
              <div className="plain-step-status"><i aria-hidden="true" />{copy.statuses[step.tone]}</div>
              <h4>{step.title}</h4>
              <p className="plain-step-subtitle">{step.subtitle}</p>
              <p className="plain-step-detail">{step.detail}</p>
            </div>
            {index < copy.steps.length - 1 ? <span className="plain-step-connector" aria-hidden="true">→</span> : null}
          </li>
        ))}
      </ol>

      <div className="plain-progress-now">
        <h3>{copy.nowTitle}</h3>
        <div className="plain-now-grid">
          <article className="plain-now-card is-done"><span>{copy.done}</span><p>{copy.doneText}</p></article>
          <article className="plain-now-card is-blocked"><span>{copy.blocked}</span><p>{copy.blockedText}</p></article>
          <article className="plain-now-card is-next"><span>{copy.next}</span><p>{copy.nextText}</p><small>{copy.technical}: {snapshot.northStar.criticalPath}</small></article>
        </div>
      </div>
    </section>
  );
}
