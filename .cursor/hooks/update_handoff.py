#!/usr/bin/env python3
"""Cursor stop hook — refresh HANDOFF.md timestamp and one-line git state. Prints {} only."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
HANDOFF = REPO_ROOT / "HANDOFF.md"


def git_one_liner() -> str:
    try:
        branch = subprocess.check_output(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=REPO_ROOT,
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode != 0:
            return f"On `{branch}`; git status unavailable"
        lines = [line for line in result.stdout.splitlines() if line.strip()]
        if not lines:
            return f"On `{branch}`; clean working tree"
        modified = sum(1 for line in lines if line[0] in "MADRCU" or line[1:2] == "M")
        untracked = sum(1 for line in lines if line.startswith("??"))
        parts = [f"On `{branch}`"]
        if modified:
            parts.append(f"{modified} changed")
        if untracked:
            parts.append(f"{untracked} untracked")
        return "; ".join(parts)
    except (OSError, subprocess.SubprocessError):
        return "git state unknown"


def update_handoff() -> None:
    if not HANDOFF.exists():
        return
    text = HANDOFF.read_text(encoding="utf-8")
    today = date.today().isoformat()
    text = re.sub(
        r"^\*\*Last updated:\*\*.*$",
        f"**Last updated:** {today} (stop hook)",
        text,
        count=1,
        flags=re.MULTILINE,
    )
    text = re.sub(
        r"^\*\*Updated by:\*\*.*$",
        "**Updated by:** Cursor stop hook",
        text,
        count=1,
        flags=re.MULTILINE,
    )
    text = re.sub(
        r"^\*\*Repository state:\*\*.*$",
        f"**Repository state:** {git_one_liner()}",
        text,
        count=1,
        flags=re.MULTILINE,
    )
    HANDOFF.write_text(text, encoding="utf-8")


def main() -> int:
    update_handoff()
    sys.stdout.write(json.dumps({}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
