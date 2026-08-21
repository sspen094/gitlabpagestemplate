import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useText } from '../../text/t-lookup/index.ts'
import { isHrefActive, isSectionActive } from './active.ts'
import { defaultNav } from './nav-config.ts'
import type { NavItem, NavLinkItem, NavSectionItem } from './types.ts'

export function MobileNavbar({
  items = defaultNav,
}: {
  items?: readonly NavItem[]
}) {
  const t = useText()
  const { pathname } = useLocation()
  const panelId = useId()
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [pathForOpen, setPathForOpen] = useState(pathname)
  if (pathForOpen !== pathname) {
    setPathForOpen(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) {
      return
    }

    closeRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        hamburgerRef.current?.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <nav className="navbar navbar--mobile" aria-label={t('nav.chrome.label')}>
      <button
        ref={hamburgerRef}
        type="button"
        className="navbar__menu-button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t('nav.chrome.openMenu')}
        onClick={() => setOpen(true)}
      >
        <span className="navbar__menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <div
        className="navbar__backdrop"
        hidden={!open}
        onClick={() => setOpen(false)}
      />
      <div
        id={panelId}
        className="navbar__drawer"
        role={open ? 'dialog' : undefined}
        aria-modal={open ? true : undefined}
        aria-label={t('nav.chrome.menu')}
        hidden={!open}
      >
        <button
          ref={closeRef}
          type="button"
          className="navbar__drawer-close"
          aria-label={t('nav.chrome.closeMenu')}
          onClick={() => setOpen(false)}
        >
          {t('nav.chrome.closeMenu')}
        </button>
        <ul className="navbar__drawer-list">
          {items.map((item) =>
            item.kind === 'section' ? (
              <MobileSection key={item.id} item={item} currentPath={pathname} />
            ) : (
              <li key={item.id}>
                <MobileLink item={item} currentPath={pathname} />
              </li>
            ),
          )}
        </ul>
      </div>
    </nav>
  )
}

function MobileSection({
  item,
  currentPath,
}: {
  item: NavSectionItem
  currentPath: string
}) {
  const t = useText()
  const sectionActive = isSectionActive(currentPath, item)

  return (
    <li
      className={
        sectionActive
          ? 'navbar__drawer-section is-active'
          : 'navbar__drawer-section'
      }
      data-nav-id={item.id}
    >
      {item.href ? (
        <Link
          className={
            isHrefActive(currentPath, item.href)
              ? 'navbar__link is-active'
              : 'navbar__link'
          }
          to={item.href}
          aria-current={
            isHrefActive(currentPath, item.href) ? 'page' : undefined
          }
        >
          {t(item.labelKey)}
        </Link>
      ) : (
        <span className="navbar__link navbar__link--label">{t(item.labelKey)}</span>
      )}
      <ul className="navbar__drawer-sublist">
        {item.children.map((child) => (
          <li key={child.id}>
            <MobileLink item={child} currentPath={currentPath} />
          </li>
        ))}
      </ul>
    </li>
  )
}

function MobileLink({
  item,
  currentPath,
}: {
  item: NavLinkItem
  currentPath: string
}) {
  const t = useText()
  const active = isHrefActive(currentPath, item.href)

  return (
    <Link
      className={active ? 'navbar__link is-active' : 'navbar__link'}
      to={item.href}
      data-nav-id={item.id}
      aria-current={active ? 'page' : undefined}
    >
      {t(item.labelKey)}
    </Link>
  )
}
