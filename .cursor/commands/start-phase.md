# Start the next phase (`/start-phase`)

Use when **HANDOFF** says the slice plan is approved and the human wants to begin (or continue) build work. One `/start-phase` cycle handles **one entire phase** (every remaining unchecked task in that phase), not a single checkbox.

## Preconditions

1. Read first ~120 lines of `HANDOFF.md`.
2. Read `.cursor/active-slice` — use `SLICE_ID`, `MODULE_ID`, `FEATURE_NAME`, `BRANCH`.
3. Read `docs/project-files/project-plan/slices/<SLICE_ID>-tasks.md`.
4. Confirm task file **Status** is plan-approved (or build in progress). If still awaiting plan approval, **stop** and ask the human.

## Branch

If current git branch ≠ `BRANCH` from `active-slice`:

```powershell
git checkout <BRANCH>
```

If the branch does not exist, stop and ask before creating it.

Do **not** commit unless the human asks.

## Phase selection

1. Find the **earliest incomplete** phase in `*-tasks.md`.
2. **Implementation phases** (Phase 1, 2, …): select **all remaining unchecked** tasks in that phase. Include any already-implemented-but-unchecked tasks so they can be verified and closed with the rest.
3. Skip **Manual confirmation** and **Final** until all implementation phases are done.
4. When Manual confirmation or Final is next, that whole phase is the unit of work — still subject to the verbal-gate and Final rules below.
5. Do **not** pull in tasks from a later phase in the same cycle.

## Gate 1 — plan before implementation

On the initial `/start-phase` invocation:

1. Read the selected phase's requirements, acceptance criteria, SC-xx links, and relevant existing architecture.
2. Present a short plan in broad strokes using **architecture and requirements language**, not line-by-line coding detail.
3. Include:
   - phase name and the full list of remaining task checkbox text;
   - requirement or acceptance-criteria outcomes for the phase;
   - architecture/components affected and their responsibilities;
   - a small implementation sequence covering the phase;
   - intended automated and manual verification for the phase as a whole.
4. End by asking for explicit permission to implement **this entire phase**.
5. **Stop. Do not edit files, change task checkboxes, or implement until permission is given.**

Keep this plan compact enough for the human to evaluate quickly.

## Gate 2 — implement after permission

When the human approves the plan:

1. Implement **all remaining tasks** in the approved phase (and finish any already-started tasks in that phase).
2. Run focused automated checks appropriate to the changed surface.
3. Do **not** mark phase task checkboxes complete yet.
4. Report the implementation outcome and any deviations from the approved plan.
5. End with the required **Manual check** section below (one check covering the phase) and ask the human to perform or authorize the proposed verification.
6. Stop and wait for verification. Do not automatically continue to the next phase.

## Gate 3 — verify and close the phase

When the human provides verification results or authorizes agent-run verification:

1. Run any authorized verification and evaluate the applicable expected result.
2. If verification fails:
   - keep failed checkboxes unchecked;
   - explain the failure;
   - fix only within the approved phase when authorized, then repeat Gate 2 for the failed work.
3. If verification passes:
   - mark **all verified tasks in this phase** `- [x]` with today's date and concise evidence;
   - refresh `HANDOFF.md` Focus / Next steps for the next session;
   - report the **phase** closed and stop.
4. Do not select or plan the next phase until the human invokes `/start-phase` again.

## Manual check (required after implementation)

After implementing the selected phase, tell the human **how to manually exercise what changed**. Pick the best fit; be concrete (commands, URLs, expected result). Do not invent a UI/API surface that does not exist yet. One Manual check section should cover the whole phase (multiple steps if needed).

| Surface | When to use | What to include |
|---------|-------------|-----------------|
| **Frontend** | SPA/UI changed or newly wired | How to start (`npm run dev`), route to open, clicks to try, what should appear |
| **Unit / component** | Logic with no page yet | Exact `npm test` path(s) and expected output |
| **Sheets mapping** | Published Google Sheets data | Sheet URL/tab, expected rows, and how the page should fail gracefully if data is missing |
| **Not manually reachable** | Internal-only wiring with no test hook | Say **No practical manual check yet**, why, and the automated proof that covers it |

Format the closing section like:

```markdown
## Manual check
**Surface:** Frontend | Unit / component | Sheets mapping | Not manually reachable
…
```

Keep it short (about 5–15 lines). Prefer copy-pasteable commands for this OS (PowerShell on Windows).

## Gates (do not violate)

- Do **not** implement on the initial `/start-phase` invocation; plan and ask permission first.
- Do **not** check off a task until its proposed verification passes.
- Do **not** continue to the next phase by default; one cycle closes one phase.
- Do **not** start **Final** until **Manual confirmation** is walked and the human gives **verbal confirmation**.
- Do **not** invent scope outside `active-slice` unless `SCOPE_OVERRIDE=true`.
- UI for this product: match existing investigation widget style when requirements say so.
- Do **not** skip the **Manual check** section after implementation.

## Default human one-liner (also in HANDOFF)

```text
/start-phase
```
