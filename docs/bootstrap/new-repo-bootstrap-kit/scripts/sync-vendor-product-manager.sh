#!/usr/bin/env bash
# Refresh vendor/agent-product-manager snapshot in agent-cursor-bootstrap (maintainers only).
# Usage: from agent-cursor-bootstrap repo root:
#   export GITLAB_TOKEN=glpat-…   # if cloning fresh
#   bash new-repo-bootstrap-kit/scripts/sync-vendor-product-manager.sh
#
# Or sync from a local clone:
#   AGENT_PM_SRC=../agent-product-manager bash new-repo-bootstrap-kit/scripts/sync-vendor-product-manager.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
KIT_ROOT="${REPO_ROOT}/new-repo-bootstrap-kit"
DEST="${KIT_ROOT}/vendor/agent-product-manager"
REF_FILE="${KIT_ROOT}/vendor/agent-product-manager.ref"
SRC="${AGENT_PM_SRC:-}"

if [[ -n "${SRC}" && -f "${SRC}/AGENTS.md" ]]; then
  echo "Syncing from local path: ${SRC}"
  rsync -a --delete --exclude '.git' --exclude '.env.local' "${SRC}/" "${DEST}/"
else
  bash "${KIT_ROOT}/scripts/fetch-product-manager-agent.sh" "${DEST}"
fi

# Record snapshot metadata (not used by fetch — documentation only)
REF="$(grep '^REF=' "${REF_FILE}" | cut -d= -f2-)"
DATE="$(date -u +%Y-%m-%d)"
cat > "${KIT_ROOT}/vendor/SNAPSHOT.md" <<EOF
# Vendor snapshot

| Field | Value |
|-------|-------|
| **Source** | agent-product-manager |
| **Pin (ref file)** | ${REF} |
| **Updated** | ${DATE} |
| **Refresh** | \`bash new-repo-bootstrap-kit/scripts/sync-vendor-product-manager.sh\` |

Committed copy in \`vendor/agent-product-manager/\` lets Phase 4 install without GitLab auth.
Product repos pull from GitLab only when vendor is missing (see fetch script).
EOF

echo "Vendor snapshot updated at ${DEST}"
echo "Commit vendor/agent-product-manager/ and vendor/SNAPSHOT.md in agent-cursor-bootstrap."
