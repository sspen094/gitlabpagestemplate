/**
 * Event shape and date primitives shared by the calendar layouts. Kept out of
 * `CalendarModule.tsx` so the component file only exports components.
 *
 * Event config stays column-shaped (`date` + title) so a published sheet's date
 * column and display column map straight onto any layout.
 */
export type CalendarEvent = {
  key: string
  date: string
  title: string
  detail: string
  time: string
  location: string
  link: string
}

export type CalendarMonth = {
  year: number
  monthIndex: number
}

export const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/

const DEFAULT_UPCOMING_COUNT = 5
const MAX_UPCOMING_COUNT = 24

export function isoDate(year: number, monthIndex: number, day: number): string {
  const paddedMonth = String(monthIndex + 1).padStart(2, '0')
  return `${year}-${paddedMonth}-${String(day).padStart(2, '0')}`
}

/** Stepping covers January of this year through December of next year. */
export function steppingYearRange(today: Date = new Date()): {
  startYear: number
  endYear: number
} {
  const startYear = today.getFullYear()
  return { startYear, endYear: startYear + 1 }
}

export function shiftMonth(
  month: CalendarMonth,
  delta: number,
): CalendarMonth {
  const value = new Date(month.year, month.monthIndex + delta, 1)
  return { year: value.getFullYear(), monthIndex: value.getMonth() }
}

export function clampMonthToSteppingRange(
  month: CalendarMonth,
  today: Date = new Date(),
): CalendarMonth {
  const { startYear, endYear } = steppingYearRange(today)
  if (month.year < startYear) {
    return { year: startYear, monthIndex: 0 }
  }
  if (month.year > endYear) {
    return { year: endYear, monthIndex: 11 }
  }
  return month
}

export function canStepMonth(
  month: CalendarMonth,
  delta: number,
  today: Date = new Date(),
): boolean {
  const next = shiftMonth(month, delta)
  const { startYear, endYear } = steppingYearRange(today)
  return next.year >= startYear && next.year <= endYear
}

export function readUpcomingCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 1) {
    return DEFAULT_UPCOMING_COUNT
  }
  return Math.min(MAX_UPCOMING_COUNT, Math.floor(value))
}

/**
 * Dated events from `today` forward, soonest first. When every event is in the
 * past the most recent ones are shown instead, so the cards are never empty.
 */
export function selectUpcomingEvents(
  events: readonly CalendarEvent[],
  count: number,
  today: Date = new Date(),
): CalendarEvent[] {
  const dated = events.filter((event) => ISO_DAY.test(event.date))
  if (dated.length === 0) {
    return events.slice(0, count)
  }

  const sorted = [...dated].sort((left, right) =>
    left.date.localeCompare(right.date),
  )
  const cutoff = isoDate(today.getFullYear(), today.getMonth(), today.getDate())
  const upcoming = sorted.filter((event) => event.date >= cutoff)

  return upcoming.length > 0 ? upcoming.slice(0, count) : sorted.slice(-count)
}
