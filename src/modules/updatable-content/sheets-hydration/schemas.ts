import type { FeedRow } from '../../data-sources/feed-client/index.ts'
import { parseSheetDate } from './date.ts'
import {
  sanitizeInteger,
  sanitizeMultiline,
  sanitizeText,
  sanitizeUrl,
} from './sanitize.ts'

/**
 * Schemas for the four updatable data types (requirements §4). Each type has an
 * explicit field allow-list; unknown columns are ignored and rows missing a
 * required field are dropped so malformed data can never reach render.
 */

export type UpdatableType =
  | 'text-block'
  | 'card-list'
  | 'event-list'
  | 'contact-info'

export type TextBlock = {
  text: string
}

export type Card = {
  /** Optional: a row carrying only a description still renders as a card. */
  title: string
  subtitle?: string
  description?: string
  link?: string
  imageUrl?: string
  sortOrder?: number
}

export type EventItem = {
  title: string
  date: string
  time?: string
  location?: string
  description?: string
  link?: string
}

export type ContactType = 'email' | 'phone' | 'url' | 'plain'

export type ContactEntry = {
  label: string
  value: string
  type: ContactType
}

/** Accepted column names per type. Anything else is discarded before parsing. */
export const ALLOWED_FIELDS: Record<UpdatableType, readonly string[]> = {
  'text-block': ['text'],
  'card-list': ['title', 'subtitle', 'description', 'link', 'imageUrl', 'sortOrder'],
  'event-list': ['title', 'date', 'time', 'location', 'description', 'link'],
  'contact-info': ['label', 'value', 'type'],
}

const CONTACT_TYPES: ReadonlySet<ContactType> = new Set([
  'email',
  'phone',
  'url',
  'plain',
])

export function pickAllowedFields(row: FeedRow, type: UpdatableType): FeedRow {
  const allowed = ALLOWED_FIELDS[type]
  const picked: FeedRow = {}
  for (const field of allowed) {
    if (field in row) {
      picked[field] = row[field]
    }
  }
  return picked
}

export function parseTextBlock(row: FeedRow): TextBlock | null {
  const clean = pickAllowedFields(row, 'text-block')
  const text = sanitizeMultiline(clean.text ?? '')
  if (!text) {
    return null
  }
  return { text }
}

export function parseCard(row: FeedRow): Card | null {
  const clean = pickAllowedFields(row, 'card-list')
  const title = sanitizeText(clean.title ?? '')
  const description = sanitizeMultiline(clean.description ?? '')
  if (!title && !description) {
    return null
  }
  const card: Card = { title }
  assignText(card, 'subtitle', clean.subtitle)
  if (description) {
    card.description = description
  }
  assignUrl(card, 'link', clean.link)
  assignUrl(card, 'imageUrl', clean.imageUrl)
  const sortOrder = sanitizeInteger(clean.sortOrder ?? '')
  if (sortOrder !== undefined) {
    card.sortOrder = sortOrder
  }
  return card
}

export function parseEvent(row: FeedRow): EventItem | null {
  const clean = pickAllowedFields(row, 'event-list')
  const title = sanitizeText(clean.title ?? '')
  const date = parseSheetDate(sanitizeText(clean.date ?? '', 40))
  if (!title || !date) {
    return null
  }
  const event: EventItem = { title, date }
  assignText(event, 'time', clean.time)
  assignText(event, 'location', clean.location)
  assignMultiline(event, 'description', clean.description)
  assignUrl(event, 'link', clean.link)
  return event
}

export function parseContact(row: FeedRow): ContactEntry | null {
  const clean = pickAllowedFields(row, 'contact-info')
  const label = sanitizeText(clean.label ?? '')
  const value = sanitizeText(clean.value ?? '')
  if (!label || !value) {
    return null
  }
  return { label, value, type: resolveContactType(clean.type, value) }
}

function resolveContactType(raw: string | undefined, value: string): ContactType {
  const declared = sanitizeText(raw ?? '', 10).toLowerCase()
  if (CONTACT_TYPES.has(declared as ContactType)) {
    return declared as ContactType
  }
  if (value.includes('@')) {
    return 'email'
  }
  if (sanitizeUrl(value)) {
    return 'url'
  }
  return 'plain'
}

function assignText<T>(target: T, key: keyof T, raw: string | undefined): void {
  const value = sanitizeText(raw ?? '')
  if (value) {
    target[key] = value as T[keyof T]
  }
}

function assignMultiline<T>(
  target: T,
  key: keyof T,
  raw: string | undefined,
): void {
  const value = sanitizeMultiline(raw ?? '')
  if (value) {
    target[key] = value as T[keyof T]
  }
}

function assignUrl<T>(target: T, key: keyof T, raw: string | undefined): void {
  const value = sanitizeUrl(raw ?? '')
  if (value) {
    target[key] = value as T[keyof T]
  }
}
