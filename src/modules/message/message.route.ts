import { Elysia } from 'elysia'
import { MessageController } from './message.controller'
import {
  MessageModel,
  MessageUpdateModel,
  ParamsMessageModel,
} from './message.model'
import { requireAuth } from '../../guards/auth.guard'
import { bearer } from '@elysiajs/bearer'
import { assertAuth } from '../../utils/assertAuth'

export const message = new Elysia().group('/messages', (app) =>
  app
    .post(
      '/',
      async ({ body, set }) => {
        const res = await MessageController.addMessageController(body)
        set.status = 201
        return res
      },
      {
        body: MessageModel,
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

    .get(
      '/:messageId',
      async ({ params }) => {
        const res = await MessageController.getMessageByIdController(params)
        return res
      },
      {
        beforeHandle: requireAuth('READ_MESSAGE'),
        params: ParamsMessageModel,
        detail: {
          tags: ['Message'],
          summary: 'Get Message by Id',
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
        params: ParamsMessageModel,
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
        params: ParamsMessageModel,
        detail: {
          tags: ['Message'],
          summary: 'Delete Message by Id',
        },
      }
    )
)
