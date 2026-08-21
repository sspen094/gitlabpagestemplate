import type { FeedRow } from './types.ts'

/**
 * Minimal RFC-4180-ish CSV reader for published Google Sheets output.
 * Handles quoted fields, escaped quotes (`""`), and CRLF/CR line endings.
 * The first non-empty line is the header; blank lines are skipped.
 */
export function parseCsv(text: string): FeedRow[] {
  const cells = splitCells(text)
  if (cells.length === 0) {
    return []
  }

  const header = cells[0].map((key) => key.trim())
  const rows: FeedRow[] = []

  for (let i = 1; i < cells.length; i += 1) {
    const line = cells[i]
    if (isBlankLine(line)) {
      continue
    }

    const row: FeedRow = {}
    header.forEach((key, index) => {
      if (key) {
        row[key] = (line[index] ?? '').trim()
      }
    })
    rows.push(row)
  }

  return rows
}

function isBlankLine(line: readonly string[]): boolean {
  return line.every((cell) => cell.trim() === '')
}

function splitCells(text: string): string[][] {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i]

    if (inQuotes) {
      if (char === '"') {
        if (normalized[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  row.push(field)
  rows.push(row)

  return rows
}
