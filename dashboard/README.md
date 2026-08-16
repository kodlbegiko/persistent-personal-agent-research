# Research Dashboard

This repository hosts a zero-cost static dashboard for the Persistent Personal Agent / JARVIS research program.

## Production

**Primary live URL:**

`https://jarvis-research-dashboard.vercel.app/`

The current production project is `jarvis-research-dashboard` on the connected Vercel team. GitHub Pages remains an optional backup deployment path and is intentionally manual until Pages is enabled in repository settings.

## Data model

The dashboard deliberately separates two kinds of data:

1. **Verified research evidence snapshot** — `src/data/researchState.js`
   - research gates
   - benchmark results
   - claim boundaries
   - blockers
   - maturity stages
   - North Star / MVJ dependencies

   This file must only be updated after evidence review. A commit, PR description, or README claim alone is not sufficient to advance a research gate.

2. **Live GitHub activity** — fetched in the browser from the public GitHub REST API
   - repository metadata
   - recent commits
   - pull requests
   - branches
   - umbrella-program issues

   Live activity is a signal of work, not proof that a scientific claim or gate has passed.

## North Star distance

The dashboard intentionally does **not** display a synthetic overall completion percentage. Instead it reports:

- research tracks with evidence;
- research tracks integrated into the closed loop;
- MVJ gates completed;
- current critical path;
- blockers and forbidden claim expansions.

This prevents unrelated maturity scales from being averaged into a misleading number.

## Cost model

The implementation does not require a paid API, model, GPU, database, or application backend:

- static React/Vite frontend;
- public GitHub REST API for live metadata;
- five-minute browser cache to reduce anonymous API usage;
- GitHub Actions for build verification;
- static Vercel production deployment using the connected account;
- optional GitHub Pages backup.

## Local development

```bash
npm install --no-audit --no-fund
npm run dev
```

Production build:

```bash
npm run build
```

Direct frontend dependencies are pinned in `package.json` to the versions validated by CI.

## Build evidence

The dashboard feature branch passed three consecutive GitHub-hosted `Dashboard CI` builds before merge. A retained build artifact from run `31879819090` had digest:

`sha256:85777fe92380a550830ff30a4609592aefcb62f3a235bfb596b915edf8df3c83`

The merged production source was introduced by commit `f38db4f52d2c39a2ebc6d5605ea1745b9c4f865e` and later received hosting-documentation cleanup commits.

## Optional GitHub Pages

`.github/workflows/deploy-pages.yml` is manual-only until the repository has GitHub Pages enabled with **GitHub Actions** as the source. This prevents a disabled Pages setting from producing false-red CI on normal research commits.

## Control Plane v2

The dashboard no longer treats `researchState.js` plus browser-side overlays as canonical state. `scripts/compile-dashboard-state.mjs` creates `dashboard/state/verified/current.json` before Vite starts, while legacy files are retained only under `dashboard/state/migration/` as deterministic migration input. Live activity is registry-driven and explicitly non-verifying.
