
# Dashboard v2 Testing

CI runs deterministic data compilation, watch-policy drift checks, state validation, Node unit tests, production build and bundle budgets, Playwright responsive E2E at 1470×956 / 1512×982 / 1280×800 / 390×844 in zh-Hant and English, keyboard/dialog checks, live-failure fallback checks, critical accessibility scanning with axe, geometry assertions, and screenshot artifact capture.

`npm run validate:data` fails on duplicate lineage/node IDs, missing completed/failed evidence references, illegal terminal transitions, unknown tracks, orphan/cyclic structural dependencies, control-plane zh/en key drift, incomplete registry source coverage, or non-reproducible snapshot hash.
