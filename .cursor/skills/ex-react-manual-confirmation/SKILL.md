---
name: ex-react-manual-confirmation
description: Keep the Manual confirmation Change checklist in slice *-tasks.md current during human review. Use when the slice is in Manual confirmation, the human reports review bugs or change requests, HANDOFF says Manual confirmation is next, or before recording the verbal gate / starting Final.
---

# Ex-React — Manual confirmation checklist

**Authority:** `docs/project-files/project-plan/slices/<SLICE_ID>-tasks.md` → **Manual confirmation phase** → **Change checklist**.

While Manual confirmation is active, the checklist is the living record of review work. **Any** human suggestion to change something (tweak, defect, env/SQL blocker, “while testing I saw…”) must become a checklist item in that same turn. Do not only fix issues in chat or code — **log them on the checklist first (or in the same turn as the fix).**

## When this skill applies

Apply whenever **any** of these are true:

- Active slice Status / HANDOFF says Manual confirmation (implementation phases done, Final not started)
- Human reports UI/API/env/SQL review problems during that phase
- Human asks for a change, tweak, or “while testing I saw…”
- Agent discovers a defect while helping with Manual confirmation smoke
- About to ask for / record **verbal confirmation**

## Mandatory loop (every review turn)

1. **Read** the slice `*-tasks.md` Manual confirmation **Change checklist**.
2. **Add or update checklist items** before or with the fix:
   - New human request / defect → new `- [ ]` item (remove the `_(none yet…)_` placeholder when adding the first real item).
   - Fixing an open item → mark `- [x]` and append `— **YYYY-MM-DD**`.
   - Deferred / N/A → keep or check the item and add indented `- **Note:** …`.
3. **Implement** (or explicitly defer with Note).
4. **Reply** with the fix **and** mention the checklist update (item summary + done/open).
5. **Do not start Final** until Phase closeout items are walked and verbal confirmation is recorded on the checklist.

## Checklist item format

```markdown
- [ ] Short imperative description of the change or defect
- [x] Short imperative description — **YYYY-MM-DD**
- [x] Deferred item — **YYYY-MM-DD**
  - **Note:** Deferred — rationale / follow-up slice if any
```

Good item text (specific, actionable):

- `Navbar dropdown does not close on second click of the same section`
- `Card grid shows fallback copy when the published sheet URL 404s`
- `t() key about.contact.email is missing from the text catalog`

Bad item text:

- `Fix stuff`
- `SSH issue`
- `_(none yet — populated during Manual confirmation)_` left in place after real work started

## What counts as a checklist item

Log **all** of these during Manual confirmation:

| Kind | Example |
|------|---------|
| Human-requested product change | “Prod confirm modal copy should say …” |
| Review defect | Widget 503 / wrong status / parse error |
| Env/SQL prerequisite discovered in review | Missing tables, wrong key path, passphrase-blocked key |
| Agent-found defect while assisting review | Concatenated `docker inspect` JSON |
| Explicit deferral | Out of scope → Note + leave open or check with deferral Note |

Do **not** invent cosmetic checklist noise. Do **not** skip logging because the fix was “obvious,” “just env,” or “small.” If the human asked to change it during Manual confirmation, it belongs on the list.

## Verbal gate (unchanged)

- Walk every checklist item with the human (done, N/A, or carried forward).
- Record verbal confirmation on **Phase closeout** with date + paraphrase.
- Only then start Final.

## Related

- Slice plan structure: [`ex-react-slice-plan/SKILL.md`](../ex-react-slice-plan/SKILL.md)
- Build loop: [`ex-react-core/SKILL.md`](../ex-react-core/SKILL.md)
- Template: `docs/project-files/project-plan/slices/_TEMPLATE-slice-tasks.md`
