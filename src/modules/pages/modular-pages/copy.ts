import { t } from '../../text/t-lookup/index.ts'

export function hasCopy(key: unknown, literal: unknown): boolean {
  return (
    (typeof key === 'string' && key.trim() !== '') ||
    (typeof literal === 'string' && literal.trim() !== '')
  )
}

export function readCopy(key: unknown, literal: unknown): string {
  if (typeof key === 'string' && key.trim() !== '') {
    return t(key)
  }
  return typeof literal === 'string' ? literal : ''
}

export function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}
