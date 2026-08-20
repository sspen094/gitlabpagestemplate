# Success criteria template

Copy from [`../vendor/agent-product-manager/templates/success-criteria/`](../vendor/agent-product-manager/templates/success-criteria/) when starting a new slice:

```text
docs/requirements/slices/<slice-id>/success-criteria/
  README.md
  closeout.md
  traceability.md              # Cursor creates at task sync (AC → SC-xx → PASS/FAIL)
  reference-scenario.md          # when UI / mockup review applies
  <screen>-mockup-checklist.md   # when approved mockups in input-files/
```

## Traceability (`traceability.md`)

**PM agent:** numbered acceptance criteria + **SC-xx** drafts only — do **not** author `traceability.md`.

**Cursor (task sync):** create `traceability.md`; fill **Verify (planned)**; set **Result** = `planned`. Update PASS/FAIL/N/A + **Evidence** at closeout.

## Checklist format

Each criterion gets a stable id (`SC-01`, `SC-02`, …):

```markdown
## SC-01 Short title
- [ ] Human-readable acceptance statement
- verify: pytest path, validation script, or doc anchor (Cursor fills at build)
- evidence: screenshot or report path (filled at closeout)
```

Agents evaluating `/v` or `/v+codex` mark each item **PASS**, **FAIL**, or **N/A** in verification reports and update `traceability.md`.

## Slice closeout

Requirements are not done until SC-xx are evaluated, **traceability.md** is all PASS or N/A, **and** regression tests in `regression-plan.md` have been **executed**. See [`../vendor/agent-product-manager/regression-and-closeout.md`](../vendor/agent-product-manager/regression-and-closeout.md).

## Related

- Traceability template: [`../vendor/agent-product-manager/templates/success-criteria/traceability.md`](../vendor/agent-product-manager/templates/success-criteria/traceability.md)
- Requirements template: [`../vendor/agent-product-manager/slice-requirements-template.md`](../vendor/agent-product-manager/slice-requirements-template.md)
- Task template final phase: [`_TEMPLATE-slice-tasks.md`](_TEMPLATE-slice-tasks.md)
- Slice-plan skill: [`skills/slice-plan-SKILL.md.template`](skills/slice-plan-SKILL.md.template)
- Verify-codex skill: [`skills/verify-codex-SKILL.md.template`](skills/verify-codex-SKILL.md.template)
