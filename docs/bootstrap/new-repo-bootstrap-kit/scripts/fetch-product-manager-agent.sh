#!/usr/bin/env bash
# Install agent-product-manager into a product repo (or refresh vendor checkout).
#
# Usage: fetch-product-manager-agent.sh [DEST]
# Default DEST: docs/product-manager-agent
#
# Auth (private GitLab) — pick one before running:
#   1. Vendor copy (no network): kit includes committed vendor/agent-product-manager/
#   2. SSH: set REPO_URL_SSH in vendor/agent-product-manager.ref
#   3. HTTPS token: export GITLAB_TOKEN or GITLAB_DEPLOY_TOKEN (read_repository)
#   4. Git credential helper already configured for REPO_URL
#
# Project ID is NOT required for this script — only for GitLab API / MCP / Duo later.

set -euo pipefail

DEST="${1:-docs/product-manager-agent}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
REF_FILE="${KIT_ROOT}/vendor/agent-product-manager.ref"
VENDOR_DIR="${KIT_ROOT}/vendor/agent-product-manager"

if [[ ! -f "${REF_FILE}" ]]; then
  echo "error: missing ${REF_FILE}" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "${REF_FILE}"

REF="${REF:-main}"

install_from_dir() {
  local src="$1"
  local label="$2"
  if [[ ! -f "${src}/AGENTS.md" ]]; then
    echo "error: ${src} does not look like agent-product-manager (missing AGENTS.md)" >&2
    exit 1
  fi
  mkdir -p "$(dirname "${DEST}")"
  if [[ -e "${DEST}" ]]; then
    echo "Replacing existing ${DEST}"
    rm -rf "${DEST}"
  fi
  mkdir -p "${DEST}"
  # rsync if available, else cp -R
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --exclude '.git' --exclude '.env.local' "${src}/" "${DEST}/"
  else
    cp -R "${src}/." "${DEST}/"
    rm -rf "${DEST}/.git" "${DEST}/.env.local" 2>/dev/null || true
  fi
  echo "Installed agent-product-manager → ${DEST} (${label})"
  echo "Next: fill project-connection.md, replace MFGCIDashboard placeholders in implementation-catalog.md"
}

clone_url() {
  if [[ -n "${REPO_URL_SSH:-}" ]]; then
    echo "${REPO_URL_SSH}"
    return
  fi
  if [[ -z "${REPO_URL:-}" ]]; then
    echo "error: set REPO_URL or REPO_URL_SSH in ${REF_FILE}" >&2
    exit 1
  fi
  local token="${GITLAB_TOKEN:-${GITLAB_DEPLOY_TOKEN:-}}"
  if [[ -n "${token}" ]]; then
    # https://host/group/repo.git → https://oauth2:TOKEN@host/group/repo.git
    echo "${REPO_URL}" | sed -E "s#^https://#https://oauth2:${token}@#"
    return
  fi
  echo "${REPO_URL}"
}

# ── 1. Local vendor copy (default — committed in bootstrap kit) ──
if [[ -f "${VENDOR_DIR}/AGENTS.md" ]]; then
  echo "Using kit vendor copy: ${VENDOR_DIR}"
  install_from_dir "${VENDOR_DIR}" "vendor copy, ref ${REF}"
  exit 0
fi

# ── 2. Git clone (needs auth for private GitLab) ──
if [[ -z "${REPO_URL:-}" && -z "${REPO_URL_SSH:-}" ]]; then
  echo "error: no vendor copy at ${VENDOR_DIR} and no REPO_URL in ${REF_FILE}" >&2
  exit 1
fi

CLONE_URL="$(clone_url)"
TMP="$(mktemp -d)"
trap 'rm -rf "${TMP}"' EXIT

echo "Fetching agent-product-manager (${REF})"
if ! git clone --depth 1 --branch "${REF}" "${CLONE_URL}" "${TMP}/agent-product-manager" 2>"${TMP}/clone.err"; then
  echo "error: git clone failed (private GitLab needs auth)." >&2
  cat "${TMP}/clone.err" >&2
  echo "" >&2
  echo "Fix one of:" >&2
  echo "  • Ensure kit vendor/agent-product-manager/ exists (committed in agent-cursor-bootstrap)" >&2
  echo "  • export GITLAB_TOKEN=<read_repository PAT>  (or GITLAB_DEPLOY_TOKEN)" >&2
  echo "  • Set REPO_URL_SSH in ${REF_FILE} and use SSH keys" >&2
  echo "  • Configure git credential helper for ${REPO_URL:-SSH}" >&2
  echo "" >&2
  echo "Project ID is not used for git clone — only for GitLab API / MCP later." >&2
  exit 1
fi

rm -rf "${TMP}/agent-product-manager/.git"
rm -f "${TMP}/agent-product-manager/.env.local"
install_from_dir "${TMP}/agent-product-manager" "git clone ${REF}"
