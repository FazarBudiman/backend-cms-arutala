import bearer from '@elysiajs/bearer'
import Elysia from 'elysia'
import { requireAuth } from '../../guards/auth.guard'
import {
  ArticleCoverUploadModel,
  ArticleModel,
  ArticleUpdateModel,
  ParamsArticleModel,
} from './article.model'
import { ArticleController } from './article.controller'
import { assertAuth } from '../../utils/assertAuth'

export const article = new Elysia().group('/article', (app) =>
  app
    .use(bearer())
    .post(
      '/',
      async ({ body, store, set }) => {
        const res = await ArticleController.addArticleController(
          body,
          assertAuth(store)
        )
        set.status = 201
        return res
      },
      {
        beforeHandle: requireAuth('CREATE_ARTICLE'),
        body: ArticleModel,
        detail: {
          tags: ['Article'],
          summary: 'Create a New Article',
        },
      }
    )
    .post(
      '/upload',
      async ({ body }) => {
        const res = await ArticleController.uploadCoverArticleController(body)
        return res
      },
      {
        beforeHandle: requireAuth('CREATE_ARTICLE'),
        body: ArticleCoverUploadModel,
        detail: {
          tags: ['Article'],
          summary: 'Upload cover article',
        },
      }
    )
    .get(
      '/',
      async () => {
        const res = await ArticleController.getAllArticleController()
        return res
      },
      {
        beforeHandle: requireAuth('READ_ARTICLE'),
        detail: {
          tags: ['Article'],
          summary: 'Get All Article',
        },
      }
    )

    .get(
      '/:articleId',
      async ({ params }) => {
        const res = await ArticleController.getArticleByIdController(params)
        return res
      },
      {
        beforeHandle: requireAuth('READ_ARTICLE'),
        params: ParamsArticleModel,
        detail: {
          tags: ['Article'],
          summary: 'Get Article by Id',
        },
      }
    )
    .patch(
      '/:articleId',
      async ({ body, params, store }) => {
        const res = await ArticleController.updateArticleController(
          body,
          params,
          assertAuth(store)
        )
        return res
      },
      {
        beforeHandle: requireAuth('UPDATE_ARTICLE'),
        body: ArticleUpdateModel,
        params: ParamsArticleModel,
        detail: {
          tags: ['Article'],
          summary: 'Update Article by Id',
        },
      }
    )

    .delete(
      '/:articleId',
      async ({ params }) => {
        const res = await ArticleController.deleteArticleController(params)
        return res
      },
      {
        beforeHandle: requireAuth('DELETE_ARTICLE'),
        params: ParamsArticleModel,
        detail: {
          tags: ['Article'],
          summary: 'Delete Article by Id',
        },
      }
    )
)
