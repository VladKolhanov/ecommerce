import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { HomePage } from '~/pages/home'
import { PlaceholderPage } from '~/pages/placeholder'

export const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const placeholderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/placeholder',
  component: PlaceholderPage,
})

const routeTree = rootRoute.addChildren([indexRoute, placeholderRoute])

export const router = createRouter({ routeTree })
