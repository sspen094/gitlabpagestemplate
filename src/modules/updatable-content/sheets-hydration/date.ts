/**
 * Normalize a sheet date cell to `YYYY-MM-DD`.
 *
 * A Google Sheets date column exports in its display format, so editors should
 * not have to retype dates as ISO text. Slash dates are read as month/day
 * (Sheets' US default) unless the first part is above 12, which can only be a
 * day. Anything unrecognised returns `undefined` so the row is dropped.
 */

const ISO = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
const SLASHED = /^(\d{1,4})[/.-](\d{1,2})[/.-](\d{2,4})$/
const DAY_FIRST_NAMED = /^(\d{1,2})\s+([a-z]+),?\s+(\d{4})$/i
const MONTH_FIRST_NAMED = /^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i

const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

export function parseSheetDate(value: string): string | undefined {
  const cleaned = value.trim()
  if (!cleaned) {
    return undefined
  }

  const iso = ISO.exec(cleaned)
  if (iso) {
    return toIso(Number(iso[1]), Number(iso[2]), Number(iso[3]))
  }

  const slashed = SLASHED.exec(cleaned)
  if (slashed) {
    return fromSlashed(slashed)
  }

  const dayFirst = DAY_FIRST_NAMED.exec(cleaned)
  if (dayFirst) {
    return toIso(
      Number(dayFirst[3]),
      monthFromName(dayFirst[2]),
      Number(dayFirst[1]),
    )
  }

  const monthFirst = MONTH_FIRST_NAMED.exec(cleaned)
  if (monthFirst) {
    return toIso(
      Number(monthFirst[3]),
      monthFromName(monthFirst[1]),
      Number(monthFirst[2]),
    )
  }

  return undefined
}

function fromSlashed(parts: RegExpExecArray): string | undefined {
  const first = Number(parts[1])
  const second = Number(parts[2])
  const third = Number(parts[3])

  if (parts[1].length === 4) {
    return toIso(first, second, third)
  }

  const year = third < 100 ? 2000 + third : third
  return first > 12
    ? toIso(year, second, first)
    : toIso(year, first, second)
}

function monthFromName(name: string): number {
  const lower = name.toLowerCase()
  return MONTH_NAMES.findIndex((month) => month.startsWith(lower.slice(0, 3))) + 1
}

function toIso(year: number, month: number, day: number): string | undefined {
  if (
    !Number.isInteger(year) ||
    year < 1000 ||
    year > 9999 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth(year, month)
  ) {
    return undefined
  }
  return `${year}-${pad(month)}-${pad(day)}`
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
