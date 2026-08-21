import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from 'react'
import { Link, useLocation } from 'react-router'
import { useText } from '../../text/t-lookup/index.ts'
import { isHrefActive, isSectionActive } from './active.ts'
import { collectElements, moveFocus } from './keyboard.ts'
import { defaultNav } from './nav-config.ts'
import type { NavItem, NavLinkItem, NavSectionItem } from './types.ts'
import { MobileNavbar } from './MobileNavbar.tsx'
import { useIsMobile } from './useIsMobile.ts'

const TOP_SELECTOR = '[data-nav-top="true"]'
const SUB_SELECTOR = '[data-nav-sub="true"]'

export function Navbar({
  items = defaultNav,
}: {
  items?: readonly NavItem[]
}) {
  const t = useText()
  const { pathname } = useLocation()
  const isMobile = useIsMobile()
  const navRef = useRef<HTMLElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [pathForOpen, setPathForOpen] = useState(pathname)
  if (pathForOpen !== pathname) {
    setPathForOpen(pathname)
    setOpenId(null)
  }

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenId(null)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function focusTopLevel(current: HTMLElement, delta: number) {
    moveFocus(collectElements(navRef.current, TOP_SELECTOR), current, delta)
  }

  if (isMobile) {
    return <MobileNavbar items={items} />
  }

  return (
    <nav ref={navRef} className="navbar" aria-label={t('nav.chrome.label')}>
      <ul className="navbar__list">
        {items.map((item) =>
          item.kind === 'section' ? (
            <NavSection
              key={item.id}
              item={item}
              currentPath={pathname}
              open={openId === item.id}
              onOpen={() => setOpenId(item.id)}
              onClose={() => setOpenId(null)}
              focusTopLevel={focusTopLevel}
            />
          ) : (
            <li key={item.id} className="navbar__item">
              <NavLink
                item={item}
                currentPath={pathname}
                topLevel
                onTopLevelKeyDown={(event) => {
                  handleTopLevelArrows(event, focusTopLevel)
                }}
              />
            </li>
          ),
        )}
      </ul>
    </nav>
  )
}

function handleTopLevelArrows(
  event: KeyboardEvent<HTMLElement>,
  focusTopLevel: (current: HTMLElement, delta: number) => void,
) {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusTopLevel(event.currentTarget, 1)
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusTopLevel(event.currentTarget, -1)
  }
}

function NavSection({
  item,
  currentPath,
  open,
  onOpen,
  onClose,
  focusTopLevel,
}: {
  item: NavSectionItem
  currentPath: string
  open: boolean
  onOpen: () => void
  onClose: () => void
  focusTopLevel: (current: HTMLElement, delta: number) => void
}) {
  const t = useText()
  const reactId = useId()
  const menuId = `${reactId}-menu`
  const triggerRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const pendingFocus = useRef<'first' | 'last' | null>(null)
  const sectionActive = isSectionActive(currentPath, item)
  const label = t(item.labelKey)
  const triggerActive = Boolean(item.href && isHrefActive(currentPath, item.href))
  const triggerClass = triggerActive ? 'navbar__link is-active' : 'navbar__link'

  useEffect(() => {
    if (!open || !pendingFocus.current) {
      return
    }
    const subs = collectElements(menuRef.current, SUB_SELECTOR)
    const target =
      pendingFocus.current === 'last' ? subs[subs.length - 1] : subs[0]
    pendingFocus.current = null
    target?.focus()
  }, [open])

  function openAndFocus(which: 'first' | 'last') {
    pendingFocus.current = which
    if (open) {
      const subs = collectElements(menuRef.current, SUB_SELECTOR)
      const target = which === 'last' ? subs[subs.length - 1] : subs[0]
      pendingFocus.current = null
      target?.focus()
      return
    }
    onOpen()
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        openAndFocus('first')
        break
      case 'ArrowUp':
        event.preventDefault()
        openAndFocus('last')
        break
      case 'ArrowRight':
        event.preventDefault()
        focusTopLevel(event.currentTarget, 1)
        break
      case 'ArrowLeft':
        event.preventDefault()
        focusTopLevel(event.currentTarget, -1)
        break
      case 'Escape':
        event.preventDefault()
        onClose()
        break
      case ' ':
        event.preventDefault()
        if (open) {
          onClose()
        } else {
          openAndFocus('first')
        }
        break
      default:
        break
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const subs = collectElements(menuRef.current, SUB_SELECTOR)
    const current = event.target
    if (!(current instanceof HTMLElement)) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveFocus(subs, current, 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveFocus(subs, current, -1)
        break
      case 'Home':
        event.preventDefault()
        subs[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        subs[subs.length - 1]?.focus()
        break
      case 'Escape':
        event.preventDefault()
        onClose()
        triggerRef.current?.focus()
        break
      case 'ArrowRight':
        event.preventDefault()
        onClose()
        if (triggerRef.current) {
          focusTopLevel(triggerRef.current, 1)
        }
        break
      case 'ArrowLeft':
        event.preventDefault()
        onClose()
        if (triggerRef.current) {
          focusTopLevel(triggerRef.current, -1)
        }
        break
      default:
        break
    }
  }

  const triggerAria = {
    'aria-haspopup': 'true' as const,
    'aria-expanded': open,
    'aria-controls': menuId,
    'data-nav-top': 'true',
    onKeyDown: handleTriggerKeyDown,
  }

  return (
    <li
      className={[
        'navbar__item navbar__item--dropdown',
        sectionActive ? 'is-active' : '',
        open ? 'is-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-nav-id={item.id}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      {item.href ? (
        <Link
          className={triggerClass}
          to={item.href}
          ref={triggerRef as Ref<HTMLAnchorElement>}
          aria-current={triggerActive ? 'page' : undefined}
          {...triggerAria}
        >
          {label}
        </Link>
      ) : (
        <button
          type="button"
          className={`${triggerClass} navbar__link--label`}
          ref={triggerRef as Ref<HTMLButtonElement>}
          {...triggerAria}
        >
          {label}
        </button>
      )}
      <ul
        ref={menuRef}
        id={menuId}
        className="navbar__dropdown"
        role="menu"
        aria-label={label}
        hidden={!open}
        onKeyDown={handleMenuKeyDown}
      >
        {item.children.map((child) => (
          <li key={child.id} role="none">
            <NavLink item={child} currentPath={currentPath} menuItem />
          </li>
        ))}
      </ul>
    </li>
  )
}

function NavLink({
  item,
  currentPath,
  topLevel = false,
  menuItem = false,
  onTopLevelKeyDown,
}: {
  item: NavLinkItem
  currentPath: string
  topLevel?: boolean
  menuItem?: boolean
  onTopLevelKeyDown?: (event: KeyboardEvent<HTMLAnchorElement>) => void
}) {
  const t = useText()
  const active = isHrefActive(currentPath, item.href)

  return (
    <Link
      className={active ? 'navbar__link is-active' : 'navbar__link'}
      to={item.href}
      data-nav-id={item.id}
      data-nav-top={topLevel ? 'true' : undefined}
      data-nav-sub={menuItem ? 'true' : undefined}
      role={menuItem ? 'menuitem' : undefined}
      aria-current={active ? 'page' : undefined}
      onKeyDown={onTopLevelKeyDown}
    >
      {t(item.labelKey)}
    </Link>
  )
}
