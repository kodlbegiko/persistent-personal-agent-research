
# Live vs Verified

`LIVE`, `SHARED`, `CACHED`, `DEPLOYMENT_SNAPSHOT`, `RATE_LIMIT_PAUSED`, `STALE`, and `ERROR` are transport/freshness states only. They never change a research gate.

The preferred path is browser → same-origin `/api/research-pulse` → GitHub. The function keeps any optional GitHub token server-side, uses CDN cache headers and ETag conditional requests, and filters using the single lineage registry. Client fallback is the public GitHub events endpoint, then the build-time `live-events.json`, then local cache.

GitHub public Events is near-live rather than guaranteed real-time. If a previous event disappears while the 100-event window is full, the UI reports `ACTIVITY_GAP_POSSIBLE` rather than claiming completeness.
