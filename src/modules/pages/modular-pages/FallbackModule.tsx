import { t } from '../../text/t-lookup/index.ts'
import type { PreparedModule } from './types.ts'

const DEFAULT_FALLBACK_KEY = 'modules.fallback.invalid'

export function FallbackModule({ prepared }: { prepared: PreparedModule }) {
  const custom = prepared.instance.fallback
  const message = custom?.message
    ? custom.message
    : t(custom?.messageKey ?? fallbackKey(prepared))

  return (
    <section
      className="module-fallback"
      aria-label={message}
      data-module-id={prepared.instance.id}
      data-module-type="fallback"
      data-module-render="fallback"
      aria-live="polite"
    >
      <p>{message}</p>
    </section>
  )
}

function fallbackKey(prepared: PreparedModule): string {
  if (prepared.issues.some((issue) => issue.code === 'unknown-type')) {
    return 'modules.fallback.unknownType'
  }
  if (prepared.issues.some((issue) => issue.code === 'updatable-unhydrated')) {
    return 'modules.fallback.unhydrated'
  }
  return DEFAULT_FALLBACK_KEY
}
