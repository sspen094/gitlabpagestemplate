/** Normalize a GitHub Pages (or local) public path for Vite `base`. */
export function normalizePagesBase(raw: string | undefined): string {
  const value = raw?.trim() ?? ''
  if (value === '' || value === '/') {
    return '/'
  }
  if (value === './') {
    return './'
  }
  let base = value
  if (!base.startsWith('/')) {
    base = `/${base}`
  }
  if (!base.endsWith('/')) {
    base = `${base}/`
  }
  return base
}
