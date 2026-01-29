import { Elysia, t } from 'elysia'
import { requireAuth } from '../../guards/auth.guard'
import { bearer } from '@elysiajs/bearer'
import { assertAuth } from '../../utils/assertAuth'
import {
  ContributorModel,
  ParamsContributorModel,
  QueryContributorTypeModel,
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
        body: ContributorModel,
        detail: {
          tags: ['Contributor'],
          summary: 'Create a New Contributor',
        },
      }
    )

    .get(
      '/',
      async ({ query }) => {
        const res =
          await ContributorController.getAllContributorController(query)
        return res
      },
      {
        query: QueryContributorTypeModel,
        detail: {
          tags: ['Contributor'],
          summary: 'Get All Contributors',
        },
      }
    )

    .get(
      '/:contributorId',
      async ({ params }) => {
        const res =
          await ContributorController.getContributorByIdController(params)
        return res
      },
      {
        beforeHandle: requireAuth('READ_CONTRIBUTOR'),
        params: ParamsContributorModel,
        detail: {
          tags: ['Contributor'],
          summary: 'Get Contributor by Id',
        },
      }
    )

    .patch(
      '/:contributorId',
      async ({ body, store, params }) => {
        const res = await ContributorController.updateContributorController(
          params,
          body,
          assertAuth(store)
        )
        return res
      },
      {
        beforeHandle: requireAuth('UPDATE_CONTRIBUTOR'),
        body: t.Partial(ContributorModel),
        params: ParamsContributorModel,
        detail: {
          tags: ['Contributor'],
          summary: 'Update Contributor by Id',
        },
      }
    )

    .delete(
      '/:contributorId',
      async ({ params }) => {
        const res =
          await ContributorController.deleteContributorController(params)
        return res
      },
      {
        beforeHandle: requireAuth('DELETE_CONTRIBUTOR'),
        params: ParamsContributorModel,
        detail: {
          tags: ['Contributor'],
          summary: 'Delete Contributor by Id',
        },
      }
    )
)
