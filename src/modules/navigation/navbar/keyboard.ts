export function collectElements(
  root: HTMLElement | null,
  selector: string,
): HTMLElement[] {
  if (!root) {
    return []
  }
  return Array.from(root.querySelectorAll<HTMLElement>(selector))
}

export function moveFocus(
  items: readonly HTMLElement[],
  current: HTMLElement | null,
  delta: number,
): void {
  if (items.length === 0) {
    return
  }
  const index = current ? items.indexOf(current) : -1
  const from = index === -1 ? 0 : index
  const next = items[(from + delta + items.length) % items.length]
  next?.focus()
}
