# Mockup verification (DP pattern)

Project-wide pattern for slices where **approved mockups in `input-files/`** define visual acceptance. Cursor merges this at `/v` or `/v+codex`. `agent-product-manager` cites it in requirements and authors matching **SC-xx** rows.

---

## When this applies

- Owner states UI **must match** supplied mockup(s).
- Mockup is in `input-files/` and listed in requirements as an acceptance reference.
- Does **not** apply when requirements cite an existing list/form pattern only.

---

## Checklist (PM authors as SC-xx; Cursor verifies at closeout)

- [ ] **Reference scenario** documented — stable data/fixture so review shows intended populated state, not arbitrary live data.
- [ ] **Permission profiles** that change the UI are listed and verified separately.
- [ ] **Mockup element checklist** covers chrome, titles, summary areas, sections, panels, tables, controls, icons, empty states.
- [ ] **Side-by-side review** at required viewport(s) — rendered UI vs approved image.
- [ ] **Visual fidelity** — hierarchy, density, spacing, header treatment, colors/states; plain table-only rendition fails when mockup shows richer structure.
- [ ] **Empty state** verified separately from populated mockup alignment.
- [ ] **Evidence paths** — screenshot locations in verification report or build evidence.
- [ ] **Layers separated** — API/permission tests, automated layout smoke, and manual mockup review recorded separately; passing one does not pass others.

Optional pixel-diff is supplemental — does not replace checklist-based human review.

---

## PM deliverables

| File | Purpose |
|------|---------|
| `input-files/ui-<screen>-mockup.png` | Approved reference (one per page/state) |
| `success-criteria/reference-scenario.md` | RS-01 fixture description |
| `success-criteria/<screen>-mockup-checklist.md` | Element-level SC rows |
| `success-criteria/closeout.md` | Aggregates SC-xx PASS/FAIL |

Template: [templates/success-criteria/mockup-checklist.md](../templates/success-criteria/mockup-checklist.md)
