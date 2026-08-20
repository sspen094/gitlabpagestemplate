import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))

describe('static build output', () => {
  it(
    'emits HTML/JS/CSS only and prefixes assets with BASE_URL',
    () => {
    const outDir = mkdtempSync(join(tmpdir(), 'ex-react-dist-'))
    try {
      const viteCli = join(repoRoot, 'node_modules/vite/bin/vite.js')
      execFileSync(
        process.execPath,
        [viteCli, 'build', '--outDir', outDir, '--emptyOutDir'],
        {
          cwd: repoRoot,
          env: { ...process.env, BASE_URL: '/smoke-repo/' },
          stdio: 'pipe',
        },
      )
      const html = readFileSync(join(outDir, 'index.html'), 'utf8')
      expect(html).toContain('/smoke-repo/assets/')
      expect(html).toContain('<div id="root"></div>')
      expect(html).not.toMatch(/express|fastapi|listen\(\d+/i)
    } finally {
      rmSync(outDir, { recursive: true, force: true })
    }
    },
    60_000,
  )
})
