import bearer from '@elysiajs/bearer'
import Elysia from 'elysia'
import { requireAuth } from '../../guards/auth.guard'
import { AnalyticsController } from './analytics.controller'

export const analytics = new Elysia().group('/analytics', (app) =>
  app.use(bearer()).get(
    '/overview',
    () => {
      return AnalyticsController.getOverviewController()
    },
    {
      beforeHandle: requireAuth('READ_ANALYTICS'),
      detail: {
        tags: ['Analytics'],
        summary: 'Get Dashboard overview analytics',
      },
    }
  )
)
