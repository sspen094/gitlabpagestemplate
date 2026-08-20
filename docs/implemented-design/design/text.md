# Implemented design — text lookup

Cross-cutting notes for developer-authored copy. Feature as-built: [`docs/modules/text/features/t-lookup/README.md`](../../modules/text/features/t-lookup/README.md).

## Rules

- Static copy for UI components goes through `t()` / `useText()` with `[page].[section].[item]` keys.
- The single edit location is `src/modules/text/t-lookup/text-config.ts` (`defaultText`).
- Missing keys must not throw; default fallback echoes the key.
- An alternate tree can wrap the app (`TextProvider`) without changing call-site keys.

## Not this slice

- Document `<title>` in `index.html` is still a static HTML string.
- Published Google Sheets copy is Slice 04.
