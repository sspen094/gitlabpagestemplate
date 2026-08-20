import { ModuleFrame } from './ModuleFrame.tsx'
import { readCopy, readString } from './copy.ts'
import { ModuleHeading } from './heading-level.tsx'
import type { ModuleComponentProps, ModuleInstance } from './types.ts'

/**
 * Event config stays column-shaped (`date` + title) so Slice 04 can map a
 * published sheet's date column and display column straight onto either layout.
 */
export type CalendarEvent = {
  key: string
  date: string
  title: string
  detail: string
}

export type CalendarMonth = {
  year: number
  monthIndex: number
}

export type CalendarLayout = 'list' | 'month'

const MONTH_LAYOUTS: ReadonlySet<string> = new Set(['month', 'grid'])
const ISO_MONTH = /^(\d{4})-(\d{2})$/
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/

export function CalendarModule({ instance }: ModuleComponentProps) {
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const events = readCalendarEvents(instance)
  const layout = readCalendarLayout(instance.config.layout)
  const headingId = title ? `${instance.id}-title` : `${instance.id}-calendar`

  return (
    <ModuleFrame
      instance={instance}
      className="module-calendar"
      labelledBy={headingId}
    >
      <ModuleHeading id={headingId}>{title || 'Calendar'}</ModuleHeading>
      {layout === 'month' ? (
        <MonthGrid
          events={events}
          month={resolveCalendarMonth(instance.config.month, events)}
        />
      ) : (
        <EventList events={events} />
      )}
    </ModuleFrame>
  )
}

function EventList({ events }: { events: readonly CalendarEvent[] }) {
  return (
    <ol className="module-calendar__list">
      {events.map((event) => (
        <li key={event.key} className="module-calendar__event">
          {event.date ? (
            <time dateTime={event.date}>{formatEventDate(event.date)}</time>
          ) : null}
          <p className="module-calendar__title">{event.title}</p>
          {event.detail ? <p>{event.detail}</p> : null}
        </li>
      ))}
    </ol>
  )
}

function MonthGrid({
  events,
  month,
}: {
  events: readonly CalendarEvent[]
  month: CalendarMonth
}) {
  const byDay = groupEventsByDay(events, month)
  const firstOfMonth = new Date(month.year, month.monthIndex, 1)
  const dayCount = new Date(month.year, month.monthIndex + 1, 0).getDate()
  const cells: (number | null)[] = Array.from<null>({
    length: firstOfMonth.getDay(),
  }).fill(null)
  for (let day = 1; day <= dayCount; day += 1) {
    cells.push(day)
  }
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  return (
    <table className="module-calendar__grid">
      <caption>
        {firstOfMonth.toLocaleDateString(undefined, {
          month: 'long',
          year: 'numeric',
        })}
      </caption>
      <thead>
        <tr>
          {weekdayLabels().map((label) => (
            <th key={label} scope="col">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {chunkWeeks(cells).map((week, weekIndex) => (
          <tr key={`week-${weekIndex}`}>
            {week.map((day, dayIndex) =>
              day === null ? (
                <td key={`empty-${weekIndex}-${dayIndex}`} aria-hidden="true" />
              ) : (
                <td key={`day-${day}`} className="module-calendar__day">
                  <time dateTime={isoDay(month, day)}>{day}</time>
                  {(byDay.get(day) ?? []).map((event) => (
                    <p key={event.key} className="module-calendar__day-event">
                      {event.title}
                    </p>
                  ))}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function readCalendarLayout(value: unknown): CalendarLayout {
  return MONTH_LAYOUTS.has(readString(value)) ? 'month' : 'list'
}

function readCalendarEvents(instance: ModuleInstance): CalendarEvent[] {
  const raw = Array.isArray(instance.config.events)
    ? instance.config.events
    : []

  return raw.flatMap((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return []
    }
    const item = entry as Record<string, unknown>
    return [
      {
        key: readString(item.id) || `${instance.id}-event-${index}`,
        date: readString(item.date),
        title: readCopy(item.titleKey, item.title),
        detail: readCopy(item.detailKey, item.detail),
      },
    ]
  })
}

function resolveCalendarMonth(
  configured: unknown,
  events: readonly CalendarEvent[],
): CalendarMonth {
  const fromConfig = ISO_MONTH.exec(readString(configured))
  if (fromConfig) {
    return {
      year: Number(fromConfig[1]),
      monthIndex: Number(fromConfig[2]) - 1,
    }
  }

  for (const event of events) {
    const parsed = ISO_DAY.exec(event.date)
    if (parsed) {
      return { year: Number(parsed[1]), monthIndex: Number(parsed[2]) - 1 }
    }
  }

  const now = new Date()
  return { year: now.getFullYear(), monthIndex: now.getMonth() }
}

function groupEventsByDay(
  events: readonly CalendarEvent[],
  month: CalendarMonth,
): Map<number, CalendarEvent[]> {
  const byDay = new Map<number, CalendarEvent[]>()

  for (const event of events) {
    const parsed = ISO_DAY.exec(event.date)
    if (!parsed) {
      continue
    }
    if (
      Number(parsed[1]) !== month.year ||
      Number(parsed[2]) - 1 !== month.monthIndex
    ) {
      continue
    }
    const day = Number(parsed[3])
    const existing = byDay.get(day)
    if (existing) {
      existing.push(event)
    } else {
      byDay.set(day, [event])
    }
  }

  return byDay
}

function chunkWeeks(cells: readonly (number | null)[]): (number | null)[][] {
  const weeks: (number | null)[][] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }
  return weeks
}

/** February 2026 starts on a Sunday, so it yields locale weekday labels in order. */
function weekdayLabels(): string[] {
  return Array.from({ length: 7 }, (_unused, offset) =>
    new Date(2026, 1, 1 + offset).toLocaleDateString(undefined, {
      weekday: 'short',
    }),
  )
}

function isoDay(month: CalendarMonth, day: number): string {
  const paddedMonth = String(month.monthIndex + 1).padStart(2, '0')
  return `${month.year}-${paddedMonth}-${String(day).padStart(2, '0')}`
}

function formatEventDate(date: string): string {
  const parsed = ISO_DAY.exec(date)
  if (!parsed) {
    return date
  }
  const value = new Date(
    Number(parsed[1]),
    Number(parsed[2]) - 1,
    Number(parsed[3]),
  )
  if (Number.isNaN(value.getTime())) {
    return date
  }
  return value.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
