import { verifiedSnapshot } from './researchState.js';

const recoveryRepo = {
  key: 'pare',
  owner: 'kodlbegiko',
  repo: 'personal-agent-recovery-engine',
  label: 'RT-03 Recovery Engine',
  accent: 'violet',
};

if (!verifiedSnapshot.repositories.some((repo) => repo.key === recoveryRepo.key)) {
  verifiedSnapshot.repositories.push(recoveryRepo);
}
