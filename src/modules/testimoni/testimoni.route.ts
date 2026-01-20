import bearer from '@elysiajs/bearer'
import Elysia, { t } from 'elysia'
import { assertAuth } from '../../utils/assertAuth'
import { TestimoniController } from './testimoni.controller'
import { requireAuth } from '../../guards/auth.guard'
import { TestimoniCreateModel, TestimoniUpdateModel } from './testimoni.model'

export const testimoni = new Elysia().group('/testimonies', (app) =>
  app
    .use(bearer())
    .post(
      '/',
      async ({ body, store, set }) => {
        const res = await TestimoniController.addTestimoniController(
          body,
          assertAuth(store)
        )
        set.status = 201
        return res
      },
      {
        beforeHandle: requireAuth(['ADMIN', 'SUPER_ADMIN']),
        body: TestimoniCreateModel,
        detail: {
          tags: ['Testimoni'],
          summary: 'Create a New Testimoni',
        },
      }
    )
    .get(
      '/',
      async ({ query }) => {
        const { category } = query
        const res =
          await TestimoniController.getAllTestimoniController(category)
        return res
      },
      {
        query: t.Object({
          category: t.Optional(
            t.Union([t.Literal('siswa'), t.Literal('talent')])
          ),
        }),
        detail: {
          tags: ['Testimoni'],
          summary: 'Get All Testimoni with Query Parameter',
        },
      }
    )
    .put(
      '/:testimoniId',
      async ({ body, store, params }) => {
        const res = await TestimoniController.updateTestimoniController(
          body,
          params.testimoniId,
          assertAuth(store)
        )
        return res
      },
      {
        beforeHandle: requireAuth(['ADMIN', 'SUPER_ADMIN']),
        body: TestimoniUpdateModel,
        detail: {
          tags: ['Testimoni'],
          summary: 'Update Testimoni by Id',
        },
      }
    )
    .delete(
      '/:testimoniId',
      async ({ params }) => {
        const res = await TestimoniController.deleteTestimoniController(
          params.testimoniId
        )
        return res
      },
      {
        beforeHandle: requireAuth(['ADMIN', 'SUPER_ADMIN']),
        detail: {
          tags: ['Testimoni'],
          summary: 'Delete Testimoni by Id',
        },
      }
    )
)
