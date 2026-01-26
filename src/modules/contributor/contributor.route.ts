import { Elysia, t } from 'elysia'
import { requireAuth } from '../../guards/auth.guard'
import { bearer } from '@elysiajs/bearer'
import { assertAuth } from '../../utils/assertAuth'
import {
  ContributorCreateModel,
  ContributorUpdateModel,
} from './contributor.model'
import { ContributorController } from './contributor.controller'

export const contributor = new Elysia().group('/contributors', (app) =>
  app
    .use(bearer())
    .post(
      '/',
      async ({ body, store, set }) => {
        const res = await ContributorController.addContributorController(
          body,
          assertAuth(store)
        )
        set.status = 201
        return res
      },
      {
        beforeHandle: requireAuth('CREATE_CONTRIBUTOR'),
        body: ContributorCreateModel,
        detail: {
          tags: ['Contributor'],
          summary: 'Create a New Contributor',
        },
      }
    )

    .get(
      '/',
      async ({ query }) => {
        const { type } = query
        const res =
          await ContributorController.getAllContributorController(type)
        return res
      },
      {
        query: t.Object({
          type: t.Optional(
            t.Union([t.Literal('internal'), t.Literal('external')])
          ),
        }),
        detail: {
          tags: ['Contributor'],
          summary: 'Get All Contributors',
        },
      }
    )

    .put(
      '/:contributorId',
      async ({ body, store, params }) => {
        const res = await ContributorController.updateContributorController(
          params.contributorId,
          body,
          assertAuth(store)
        )
        return res
      },
      {
        beforeHandle: requireAuth('UPDATE_CONTRIBUTOR'),
        body: ContributorUpdateModel,
        detail: {
          tags: ['Contributor'],
          summary: 'Update Contributor by Id',
        },
      }
    )

    .delete(
      '/:contributorId',
      async ({ params }) => {
        const res = await ContributorController.deleteContributorController(
          params.contributorId
        )
        return res
      },
      {
        beforeHandle: requireAuth('DELETE_CONTRIBUTOR'),
        detail: {
          tags: ['Contributor'],
          summary: 'Delete Contributor by Id',
        },
      }
    )
)
