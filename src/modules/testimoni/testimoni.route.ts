import bearer from '@elysiajs/bearer'
import Elysia, { t } from 'elysia'
import { assertAuth } from '../../utils/assertAuth'
import { TestimoniController } from './testimoni.controller'
import { requireAuth } from '../../guards/auth.guard'
import {
  ParamsTestimoniModel,
  QueryTestimoniModel,
  TestimoniModel,
} from './testimoni.model'

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
        beforeHandle: requireAuth('CREATE_TESTIMONI'),
        body: TestimoniModel,
        detail: {
          tags: ['Testimoni'],
          summary: 'Create a New Testimoni',
        },
      }
    )
    .get(
      '/',
      async ({ query }) => {
        const res = await TestimoniController.getAllTestimoniController(query)
        return res
      },
      {
        query: QueryTestimoniModel,
        detail: {
          tags: ['Testimoni'],
          summary: 'Get All Testimoni with Query Parameter',
        },
      }
    )

    .get(
      '/:testimoniId',
      async ({ params }) => {
        const res = await TestimoniController.getTestimoniByIdController(params)
        return res
      },
      {
        beforeHandle: requireAuth('READ_TESTIMONI'),
        params: ParamsTestimoniModel,
        detail: {
          tags: ['Testimoni'],
          summary: 'Get Testimoni by Id',
        },
      }
    )

    .patch(
      '/:testimoniId',
      async ({ body, store, params }) => {
        const res = await TestimoniController.updateTestimoniController(
          body,
          params,
          assertAuth(store)
        )
        return res
      },
      {
        beforeHandle: requireAuth('UPDATE_TESTIMONI'),
        body: t.Partial(TestimoniModel),
        params: ParamsTestimoniModel,
        detail: {
          tags: ['Testimoni'],
          summary: 'Update Testimoni by Id',
        },
      }
    )
    .delete(
      '/:testimoniId',
      async ({ params }) => {
        const res = await TestimoniController.deleteTestimoniController(params)
        return res
      },
      {
        beforeHandle: requireAuth('DELETE_TESTIMONI'),
        params: ParamsTestimoniModel,
        detail: {
          tags: ['Testimoni'],
          summary: 'Delete Testimoni by Id',
        },
      }
    )
)
