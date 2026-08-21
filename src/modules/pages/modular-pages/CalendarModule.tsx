import { useState } from 'react'
import { t } from '../../text/t-lookup/index.ts'
import { ModuleFrame } from './ModuleFrame.tsx'
import {
  ISO_DAY,
  canStepMonth,
  clampMonthToSteppingRange,
  isoDate,
  readUpcomingCount,
  selectUpcomingEvents,
  shiftMonth,
  type CalendarEvent,
  type CalendarMonth,
} from './calendar-events.ts'
import { readCopy, readString } from './copy.ts'
import { ModuleHeading, NestedHeadingScope } from './heading-level.tsx'
import { MODULE_LAYOUTS, readLayoutOption } from './style.ts'
import type { ModuleComponentProps, ModuleInstance } from './types.ts'

export type CalendarLayout = 'list' | 'month' | 'hybrid'

const MONTH_LAYOUTS: ReadonlySet<string> = new Set(['month', 'grid'])
const HYBRID_LAYOUTS: ReadonlySet<string> = new Set(['hybrid', 'agenda'])
const ISO_MONTH = /^(\d{4})-(\d{2})$/

export function CalendarModule({ instance }: ModuleComponentProps) {
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const events = readCalendarEvents(instance)
  const layout = readCalendarLayout(instance)
  const headingId = title ? `${instance.id}-title` : `${instance.id}-calendar`

  return (
    <ModuleFrame
      instance={instance}
      className="module-calendar"
      labelledBy={headingId}
    >
      <ModuleHeading id={headingId}>{title || 'Calendar'}</ModuleHeading>
      {layout === 'hybrid' ? (
        <HybridCalendar instance={instance} events={events} />
      ) : layout === 'month' ? (
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

/**
 * Next-events cards next to the month grid. The grid keeps every event so the
 * month reads in full, while the cards answer "what is coming up".
 */
function HybridCalendar({
  instance,
  events,
}: {
  instance: ModuleInstance
  events: readonly CalendarEvent[]
}) {
  const upcoming = selectUpcomingEvents(
    events,
    readUpcomingCount(instance.config.upcomingCount),
  )
  const upcomingTitle =
    readCopy(instance.config.upcomingTitleKey, instance.config.upcomingTitle) ||
    t('modules.calendar.upcoming')

  return (
    <div className="module-calendar__hybrid">
      <NestedHeadingScope>
        <div className="module-calendar__upcoming">
          <ModuleHeading>{upcomingTitle}</ModuleHeading>
          <EventList events={upcoming} />
        </div>
      </NestedHeadingScope>
      <MonthGrid
        events={events}
        month={resolveCalendarMonth(
          instance.config.month,
          upcoming.length > 0 ? upcoming : events,
        )}
      />
    </div>
  )
}

function EventList({ events }: { events: readonly CalendarEvent[] }) {
  return (
    <ol className="module-calendar__list">
      {events.map((event) => (
        <li key={event.key} className="module-calendar__event">
          {event.date ? (
            <time dateTime={event.date}>
              {formatEventDate(event.date)}
              {event.time ? ` · ${event.time}` : ''}
            </time>
          ) : null}
          <p className="module-calendar__title">
            {event.link ? <a href={event.link}>{event.title}</a> : event.title}
          </p>
          {event.location ? (
            <p className="module-calendar__location">{event.location}</p>
          ) : null}
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
  const incoming = clampMonthToSteppingRange(month)
  const incomingKey = `${month.year}-${month.monthIndex}`
  const [viewed, setViewed] = useState(incoming)
  const [sourceKey, setSourceKey] = useState(incomingKey)
  if (sourceKey !== incomingKey) {
    setSourceKey(incomingKey)
    setViewed(incoming)
  }

  const byDay = groupEventsByDay(events, viewed)
  const firstOfMonth = new Date(viewed.year, viewed.monthIndex, 1)
  const dayCount = new Date(viewed.year, viewed.monthIndex + 1, 0).getDate()
  const cells: (number | null)[] = Array.from<null>({
    length: firstOfMonth.getDay(),
  }).fill(null)
  for (let day = 1; day <= dayCount; day += 1) {
    cells.push(day)
  }
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  const canPrev = canStepMonth(viewed, -1)
  const canNext = canStepMonth(viewed, 1)
  const caption = firstOfMonth.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="module-calendar__grid-wrap">
      <div className="module-calendar__month-nav">
        <button
          type="button"
          className="module-calendar__step"
          disabled={!canPrev}
          aria-label={t('modules.calendar.previousMonth')}
          onClick={() => setViewed(shiftMonth(viewed, -1))}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="module-calendar__step"
          disabled={!canNext}
          aria-label={t('modules.calendar.nextMonth')}
          onClick={() => setViewed(shiftMonth(viewed, 1))}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <table className="module-calendar__grid">
      <caption>
        {caption}
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
                  <time dateTime={isoDay(viewed, day)}>{day}</time>
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
    </div>
  )
}

function readCalendarLayout(instance: ModuleInstance): CalendarLayout {
  const layout = readLayoutOption(
    instance.style?.layout,
    instance.config.layout,
    MODULE_LAYOUTS.calendar ?? [],
    'list',
  )
  if (HYBRID_LAYOUTS.has(layout)) {
    return 'hybrid'
  }
  return MONTH_LAYOUTS.has(layout) ? 'month' : 'list'
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
        time: readString(item.time),
        location: readString(item.location),
        link: readString(item.link),
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
  return isoDate(month.year, month.monthIndex, day)
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
