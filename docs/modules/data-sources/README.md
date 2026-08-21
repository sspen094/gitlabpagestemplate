# Module — data-sources

Published-feed client used by Sheets hydration. Not a user-facing feature on its own.

| Concern | Status | Notes |
|---------|--------|-------|
| feed-client | Shipped 2026-08-21 | CSV/JSON fetch that never throws; Google share links resolve to the CSV export endpoint by worksheet `gid`. See [sheets-hydration](../updatable-content/features/sheets-hydration/README.md). |
