# Vendor — agent-product-manager (committed snapshot)

This folder contains a **committed copy** of [**agent-product-manager**](https://srvirqisgitlab1.rossvideo.com/manufacturing-data-infrastructure-and-applications/agent-product-manager) so new repos can install the PM agent **without GitLab auth at Phase 4**.

Canonical source repo: **agent-product-manager** (edit there; refresh this snapshot when releasing bootstrap).

| File | Purpose |
|------|---------|
| [`agent-product-manager/`](agent-product-manager/) | PM agent files (AGENTS.md, templates, traceability, …) |
| [`agent-product-manager.ref`](agent-product-manager.ref) | Pin used when **pull** fallback runs |
| [`SNAPSHOT.md`](SNAPSHOT.md) | Last vendor refresh date (maintainers) |

---

## Org default — Phase 4 install

**One command** (product repo root):

```bash
bash docs/bootstrap/new-repo-bootstrap-kit/scripts/fetch-product-manager-agent.sh docs/product-manager-agent
```

The script:

1. **Copies from `vendor/agent-product-manager/`** when present (**default — no token**)
2. **Pulls from GitLab** only if vendor is missing — set `GITLAB_TOKEN` (read_repository) or use SSH per [`.ref`](agent-product-manager.ref)

**Project ID is not required** for install — only for GitLab API / MCP later (`project-connection.md`).

---

## Pull only when needed

| Situation | Action |
|-----------|--------|
| Normal bootstrap (kit includes vendor) | Run fetch script — **local copy only** |
| `vendor/agent-product-manager` empty or missing | `export GITLAB_TOKEN=glpat-…` then run fetch script |
| Need newer PM agent than bootstrap pin | Pull with token, or ask maintainers to refresh vendor snapshot |

---

## Kit maintainers — refresh vendor snapshot

When **agent-product-manager** changes, update the committed copy before tagging bootstrap:

```bash
# From local clone (no token)
AGENT_PM_SRC=../agent-product-manager \
  bash new-repo-bootstrap-kit/scripts/sync-vendor-product-manager.sh

# Or pull from GitLab
export GITLAB_TOKEN=glpat-…
bash new-repo-bootstrap-kit/scripts/sync-vendor-product-manager.sh
```

Commit `vendor/agent-product-manager/` and `vendor/SNAPSHOT.md`.

Bump `REF` in `agent-product-manager.ref` when pinning to a tag.

---

## Credentials summary

| Credential | Install PM agent? | API / MCP later? |
|------------|-------------------|------------------|
| GitLab project ID | No | Yes |
| `GITLAB_TOKEN` | Only if vendor empty / pull | Optional |
| Vendor copy in kit | **Yes — default** | N/A |
