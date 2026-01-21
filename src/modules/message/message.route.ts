import { Elysia } from 'elysia'
import { MessageController } from './message.controller'
import { MessageCreateModel, MessageUpdateModel } from './message.model'
import { requireAuth } from '../../guards/auth.guard'
import { bearer } from '@elysiajs/bearer'
import { assertAuth } from '../../utils/assertAuth'

export const message = new Elysia().group('/messages', (app) =>
  app
    .post(
      '/',
      async (ctx) => {
        const { body, set } = ctx
        const res = await MessageController.addMessageController(body)
        set.status = 201
        return res
      },
      {
        body: MessageCreateModel,
        detail: {
          tags: ['Message'],
          summary: 'Create a New Message',
        },
      }
    )

    .use(bearer())
    .get(
      '/',
      async () => {
        const res = await MessageController.getAllMessageController()
        return res
      },
      {
        beforeHandle: requireAuth('READ_MESSAGE'),
        detail: {
          tags: ['Message'],
          summary: 'Get All Message',
        },
      }
    )

    .put(
      '/:messageId',
      async ({ params, body, store }) => {
        const res = await MessageController.updateMessageController(
          body,
          params.messageId,
          assertAuth(store)
        )
        return res
      },
      {
        beforeHandle: requireAuth('UPDATE_MESSAGE'),
        body: MessageUpdateModel,
        detail: {
          tags: ['Message'],
          summary: 'Update Message by Id',
        },
      }
    )

    .delete(
      '/:messageId',
      async ({ params }) => {
        const res = await MessageController.deleteMessageController(
          params.messageId
        )
        return res
      },
      {
        beforeHandle: requireAuth('DELETE_MESSAGE'),
        detail: {
          tags: ['Message'],
          summary: 'Delete Message by Id',
        },
      }
    )
)
