# Research Dashboard

This repository hosts a zero-cost static dashboard for the Persistent Personal Agent / JARVIS research program.

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

## Cost

The implementation requires no paid API or backend:

- static React/Vite frontend;
- public GitHub REST API for live metadata;
- five-minute browser cache to reduce anonymous API usage;
- GitHub Actions for build verification;
- GitHub Pages for hosting.

## Local development

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
```

## Deployment

`main` is deployed through `.github/workflows/deploy-pages.yml`.

The expected project URL is:

`https://kodlbegiko.github.io/persistent-personal-agent-research/`

If GitHub Pages is not yet enabled for the repository, the first deployment may require Pages to be enabled in repository settings with **GitHub Actions** as the source.
