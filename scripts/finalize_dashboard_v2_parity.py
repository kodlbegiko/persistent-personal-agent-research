from pathlib import Path

p = Path('src/i18n.jsx')
s = p.read_text()
anchor = "  'integration-contract': {\n"
if anchor not in s:
    raise SystemExit('node translation insertion anchor not found')

entries = """  'pda-candidate-v3-confirmatory-fail': {
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
  'pare-v03-protected-recovery': {
    zh: { title: 'PARE v0.3 Protected Recovery Evidence', description: '72 筆 protected；Candidate-v2 86.11% vs B0 61.11%，差異 +25.00 pp，bootstrap 95% CI [+15.28, +34.72]。這只支持 benchmark-specific recovery/state-repair evidence。', dependsOn: ['Independent PARE lineage'], note: 'BENCHMARK-SPECIFIC ONLY；duplicate side-effect 2.78%；PAAV / RT-03 Action Verification 尚未建立。', evidenceLabel: 'PARE v0.3 terminal cfa1a4b2' },
    en: { title: 'PARE v0.3 Protected Recovery Evidence', description: '72 protected examples; Candidate-v2 86.11% vs B0 61.11%, a +25.00 pp difference with bootstrap 95% CI [+15.28, +34.72]. This supports benchmark-specific recovery/state-repair evidence only.', dependsOn: ['Independent PARE lineage'], note: 'BENCHMARK-SPECIFIC ONLY; duplicate side-effect 2.78%; PAAV / RT-03 Action Verification is not established.', evidenceLabel: 'PARE v0.3 terminal cfa1a4b2' },
  },
"""

for node_id in [
    'pda-candidate-v3-confirmatory-fail',
    'pda-candidate-v4-confirmatory-fail',
    'pda-candidate-v5-integrity-invalid',
    'pda-candidate-v6-development-fail',
    'pda-candidate-v7-development-fail',
    'pda-candidate-v8-development-fail',
    'pare-v03-protected-recovery',
]:
    if f"  '{node_id}': {{" in s:
        raise SystemExit(f'{node_id} already mapped unexpectedly')

p.write_text(s.replace(anchor, entries + anchor, 1))
print('missing roadmap parity mappings staged')
