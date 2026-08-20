# Cleanup mode (`/cleanup`)

Quick hygiene pass before commit or PR.

## Steps

1. Run unit/component tests (fast scope):

   ```powershell
   npm test
   ```

2. When lint/format scripts exist in `package.json`:

   ```powershell
   npm run lint
   npm run format
   ```

3. Confirm the static site still builds:

   ```powershell
   npm run build
   ```

4. Report any failures with minimal fixes — no drive-by refactors.

Do not commit unless the human asked.
