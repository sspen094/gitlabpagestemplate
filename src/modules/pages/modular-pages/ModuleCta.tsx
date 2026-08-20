import { Link } from 'react-router'

export function ModuleCta({ href, label }: { href: string; label: string }) {
  if (/^https?:\/\//i.test(href)) {
    return (
      <a className="module-cta" href={href}>
        {label}
      </a>
    )
  }

  return (
    <Link className="module-cta" to={href}>
      {label}
    </Link>
  )
}
