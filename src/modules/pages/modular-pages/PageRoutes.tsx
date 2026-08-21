import { Route, Routes } from 'react-router'
import { t } from '../../text/t-lookup/index.ts'
import { defaultPages } from './pages-config.ts'
import { PageComposer } from './pipeline.tsx'
import type { PageDefinition } from './types.ts'

export function PageRoutes({
  pages = defaultPages,
}: {
  pages?: readonly PageDefinition[]
}) {
  return (
    <Routes>
      {pages.map((page) => (
        <Route
          key={page.id}
          path={page.path}
          element={
            <PageComposer
              modules={page.modules}
              appearance={page.appearance}
            />
          }
        />
      ))}
      <Route
        path="*"
        element={
          <p data-page="not-found">{t('app.notFound.body')}</p>
        }
      />
    </Routes>
  )
}
