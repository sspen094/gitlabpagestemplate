import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { normalizePagesBase } from './vite.base.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    base: normalizePagesBase(process.env.BASE_URL ?? env.BASE_URL),
    test: {
      include: ['tests/unit/**/*.test.ts'],
    },
  }
})
