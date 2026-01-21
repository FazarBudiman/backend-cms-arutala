import bearer from '@elysiajs/bearer'
import Elysia from 'elysia'
import { MitraController } from './mitra.controller'
import { MitraCreateModel, MitraUpdateModel } from './mitra.model'
import { requireAuth } from '../../guards/auth.guard'
import { assertAuth } from '../../utils/assertAuth'

export const mitra = new Elysia().group('/mitras', (app) =>
  app
    .use(bearer())
    .post(
      '/',
      async ({ body, store, set }) => {
        const res = await MitraController.addMitraController(
          body,
          assertAuth(store)
        )
        set.status = 201
        return res
      },
      {
        beforeHandle: requireAuth('CREATE_MITRA'),
        body: MitraCreateModel,
        detail: {
          tags: ['Mitra'],
          summary: 'Create a New Mitra',
        },
      }
    )
    .get(
      '/',
      async () => {
        const res = await MitraController.getAllMitraController()
        return res
      },
      {
        detail: {
          tags: ['Mitra'],
          summary: 'Get All Mitra',
        },
      }
    )
    .put(
      '/:mitraId',
      async ({ body, store, params }) => {
        const res = await MitraController.updateMitraController(
          params.mitraId,
          body,
          assertAuth(store)
        )
        return res
      },
      {
        beforeHandle: requireAuth('UPDATE_MITRA'),
        body: MitraUpdateModel,
        detail: {
          tags: ['Mitra'],
          summary: 'Update Mitra by Id',
        },
      }
    )
    .delete(
      '/:mitraId',
      async ({ params }) => {
        const res = await MitraController.deleteMitraController(params.mitraId)
        return res
      },
      {
        beforeHandle: requireAuth('DELETE_MITRA'),
        detail: {
          tags: ['Mitra'],
          summary: 'Delete Mitra by Id',
        },
      }
    )
)
