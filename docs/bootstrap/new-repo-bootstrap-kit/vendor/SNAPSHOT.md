# Vendor snapshot

| Field | Value |
|-------|-------|
| **Source** | agent-product-manager |
| **Pin (ref file)** | main |
| **Updated** | 2026-06-25 |
| **Refresh** | `bash new-repo-bootstrap-kit/scripts/sync-vendor-product-manager.sh` |

Committed copy in `vendor/agent-product-manager/` lets Phase 4 install without GitLab auth.
Product repos pull from GitLab only when vendor is missing (see fetch script).
