import type { ComponentType } from 'react'

/**
 * Module definition model (product §8.1). Shared by static modules now and
 * updatable modules later (Slice 04 hydrates `dataSource`; this slice only
 * reserves the fields and fallback).
 */

export type ModuleMode = 'static' | 'updatable'

/** Reserved Google Sheets pointer. Not fetched in Slice 02. */
export type DataSourceRef = {
  kind: 'sheets'
  publishedUrl?: string
  tab?: string
}

export type ModuleConfig = Record<string, unknown>

export type ModuleFallback = {
  /** `t()` key for fallback copy. */
  messageKey?: string
  /** Literal fallback copy when no key is set. */
  message?: string
}

export type ModuleInstance = {
  id: string
  type: string
  mode: ModuleMode
  config: ModuleConfig
  dataSource?: DataSourceRef
  fallback?: ModuleFallback
}

export type PageDefinition = {
  id: string
  path: string
  modules: ModuleInstance[]
}

export type ValidationCode =
  | 'missing-id'
  | 'missing-type'
  | 'invalid-mode'
  | 'unknown-type'
  | 'missing-config'
  | 'updatable-unhydrated'

export type ValidationIssue = {
  code: ValidationCode
  message: string
}

export type PreparedModule = {
  instance: ModuleInstance
  valid: boolean
  issues: ValidationIssue[]
  renderMode: 'component' | 'fallback'
}

export type ModuleComponentProps = {
  instance: ModuleInstance
}

export type ModuleComponent = ComponentType<ModuleComponentProps>
