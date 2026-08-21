/**
 * Treat external sheet content as structured text, never HTML. These helpers
 * strip markup, collapse whitespace, cap length, and constrain URLs to safe
 * schemes so a malicious cell can never inject markup or a `javascript:` link.
 */

const DANGEROUS_URL_SCHEME = /^\s*(javascript|data|vbscript|file):/i
const SAFE_ABSOLUTE_URL = /^(https?:|mailto:|tel:)/i
const SITE_RELATIVE_URL = /^(\/[^/]|\.\.?\/|#)/
const BARE_DOMAIN = /^[\w-]+(\.[\w-]+)+(\/|$)/

const DEFAULT_TEXT_MAX = 500
const DEFAULT_MULTILINE_MAX = 2000

export function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '')
}

/** Single-line text: strip tags, collapse whitespace, trim, cap length. */
export function sanitizeText(value: string, maxLength = DEFAULT_TEXT_MAX): string {
  return stripTags(value).replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

/** Multi-line text: strip tags, keep paragraph breaks, cap length. */
export function sanitizeMultiline(
  value: string,
  maxLength = DEFAULT_MULTILINE_MAX,
): string {
  return stripTags(value)
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength)
}

/**
 * Return a safe URL or `undefined`. Absolute http(s)/mailto/tel and
 * site-relative links pass through; bare domains are promoted to https;
 * `javascript:`/`data:`/`vbscript:`/`file:` and anything else are rejected.
 */
export function sanitizeUrl(value: string): string | undefined {
  const cleaned = stripTags(value).trim()
  if (!cleaned || DANGEROUS_URL_SCHEME.test(cleaned)) {
    return undefined
  }
  if (SAFE_ABSOLUTE_URL.test(cleaned) || SITE_RELATIVE_URL.test(cleaned)) {
    return cleaned
  }
  if (BARE_DOMAIN.test(cleaned)) {
    return `https://${cleaned}`
  }
  return undefined
}

/** Parse an optional non-negative integer; `undefined` when absent/invalid. */
export function sanitizeInteger(value: string): number | undefined {
  const cleaned = stripTags(value).trim()
  if (!/^-?\d+$/.test(cleaned)) {
    return undefined
  }
  const parsed = Number.parseInt(cleaned, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}
