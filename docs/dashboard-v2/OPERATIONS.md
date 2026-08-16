
# Dashboard v2 Operations

1. Keep child research repositories read-only from the umbrella workflow.
2. Run discovery/audit against the registry and versioned watch policy.
3. Admit only traceable terminal/frozen/admissible evidence.
4. Run `npm run validate:data && npm run test:unit && npm run build` before PR publication.
5. Preserve each substantive verified snapshot in `dashboard/state/history/` and its diff in `dashboard/state/diffs/`.
6. Merge only with clean CI. Production must be built from exact `main`; the compiler reads `VERCEL_GIT_COMMIT_SHA` or `GITHUB_SHA` for visible source identity.
7. If `EXPECTED_WATCH_POLICY_HASH` differs from the repository policy hash, `POLICY_DRIFT` fails closed.
