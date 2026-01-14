import { Elysia } from 'elysia'
import { MessageController } from './message.controller'
import { MessageCreateModels } from './message.model'
import { requireAuth } from '../../guards/auth.guard'
import { bearer } from '@elysiajs/bearer'

export const message = new Elysia().group('/messages', (app) =>
  app
    .post(
      '/',
      async (ctx) => {
        const { body, set } = ctx
        const res = await MessageController.addMessage(body)
        set.status = 201
        return res
      },
      {
        body: MessageCreateModels,
      }
    )

    .use(bearer())
    .get(
      '/',
      async () => {
        const res = await MessageController.getMessages()
        return res
      },
      {
        beforeHandle: requireAuth(['ADMIN', 'SUPER_ADMIN']),
      }
    )
)
