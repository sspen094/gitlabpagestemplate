# Guides

Task-oriented walkthroughs for the two people who use this template: the **editor** who keeps content current, and the **developer** who forks and extends it.

Reference material lives elsewhere — these guides link to it rather than repeat it: [`configuration/`](../configuration/README.md) for env keys, [`modules/`](../modules/README.md) for as-built behavior, [`developer.md`](../developer.md) for repo layout and local setup.

## Editor

| Guide | Use it to |
|-------|-----------|
| [Update content with Google Sheets](editor-google-sheets.md) | Change approved page sections by typing in a spreadsheet — no code, no deploy |

## Developer

| Guide | Use it to |
|-------|-----------|
| [Add a page](add-a-page.md) | Register a route, compose it from modules, put it in the navbar |
| [Add a module](add-a-module.md) | Build a new module type and register it, or place an existing one |
| [Configure an updatable section](updatable-section.md) | Turn a static module instance into one that reads from a sheet |
| [Map a Google Sheets data source](google-sheets-source.md) | Point a worksheet at a module and get the URL/gid wiring right |
| [Rebrand and style](rebrand-and-style.md) | Change colors, type, and spacing centrally; pick per-page and per-module style options |
| [Fork, rename, and adapt](fork-and-rename.md) | Turn this template into a real site under your own name and domain |

## Order to read them

Forking for the first time: [Fork, rename, and adapt](fork-and-rename.md) → [Rebrand and style](rebrand-and-style.md) → [Add a page](add-a-page.md). Wiring live content: [Map a Google Sheets data source](google-sheets-source.md) → [Configure an updatable section](updatable-section.md), then hand the editor [Update content with Google Sheets](editor-google-sheets.md).

## What the sample site ships with

Every guide uses the shipped placeholder site as its worked example. Its routes are `/`, `/events`, `/about`, `/about/contact`, and `/about/members`, and its content is fictional — see [Fork, rename, and adapt](fork-and-rename.md#3-replace-the-placeholder-content) for the full list of what to replace.
