# Start the next task (`/start-phase`)

Use when **HANDOFF** says the slice plan is approved and the human wants to begin (or continue) build work. One `/start-phase` cycle normally handles **one task checkbox**, not an entire phase.

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

## Task selection

1. Find the **first unchecked** task in the earliest incomplete **implementation** phase (Phase 1, 2, …). Skip Manual confirmation and Final until earlier phases are done.
2. Select only that checkbox by default.
3. Select the next few adjacent checkboxes only when they are architecturally inseparable or implementing them separately would create an invalid intermediate state. Do not group tasks merely for convenience or speed.
4. Keep the selected work small enough to plan, implement, and verify within the current context window.

## Gate 1 — plan before implementation

On the initial `/start-phase` invocation:

1. Read the selected task's requirements, acceptance criteria, SC-xx links, and relevant existing architecture.
2. Present a short plan in broad strokes using **architecture and requirements language**, not line-by-line coding detail.
3. Include:
   - selected task checkbox text (and phase);
   - requirement or acceptance-criteria outcome;
   - architecture/components affected and their responsibilities;
   - a small implementation sequence;
   - intended automated and manual verification;
   - if tasks are grouped, the architectural reason they must be done together.
4. End by asking for explicit permission to implement this task or task group.
5. **Stop. Do not edit files, change task checkboxes, or implement until permission is given.**

Keep this plan compact enough for the human to evaluate quickly.

## Gate 2 — implement after permission

When the human approves the plan:

1. Implement only the approved task or task group.
2. Run focused automated checks appropriate to the changed surface.
3. Do **not** mark the selected task checkbox complete yet.
4. Report the implementation outcome and any deviations from the approved plan.
5. End with the required **Manual check** section below and ask the human to perform or authorize the proposed verification.
6. Stop and wait for verification. Do not automatically continue to the next checkbox.

## Gate 3 — verify and close the task

When the human provides verification results or authorizes agent-run verification:

1. Run any authorized verification and evaluate the applicable expected result.
2. If verification fails:
   - keep the checkbox unchecked;
   - explain the failure;
   - fix only within the approved task scope when authorized, then repeat Gate 2.
3. If verification passes:
   - mark only the verified task checkbox(es) `- [x]` with today's date and concise evidence;
   - refresh `HANDOFF.md` Focus / Next steps for the next session;
   - report the task closed and stop.
4. Do not select or plan the next task until the human invokes `/start-phase` again.

## Manual check (required after implementation)

After implementing the selected task(s), tell the human **how to manually exercise what changed**. Pick the best fit; be concrete (commands, URLs, expected result). Do not invent a UI/API surface that does not exist yet.

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
- Do **not** continue through a phase by default; one cycle closes one checkbox or an explicitly justified task group.
- Do **not** start **Final** until **Manual confirmation** is walked and the human gives **verbal confirmation**.
- Do **not** invent scope outside `active-slice` unless `SCOPE_OVERRIDE=true`.
- UI for this product: match existing investigation widget style when requirements say so.
- Do **not** skip the **Manual check** section after implementation.

## Default human one-liner (also in HANDOFF)

```text
/start-phase
```
