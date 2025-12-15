import { lazy, Suspense, useEffect, useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Providers } from './core/providers'
import { router } from './core/router'

const ReactQueryDevtoolsProduction = lazy(async () =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
)

export const App = () => {
  const [showDevtools, setShowDevtools] = useState(false)

  useEffect(() => {
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  return (
    <Providers>
      <TanStackRouterDevtools router={router} initialIsOpen={false} />
      <ReactQueryDevtools initialIsOpen={false} />
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </Providers>
  )
}
