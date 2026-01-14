import { Elysia } from 'elysia'
import { MessageController } from './messages.controller'
import { MessageCreateModels } from './messages.model'
import { requireAuth } from '../../guards/auth.guard'
import bearer from '@elysiajs/bearer'

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

    // .use(requireAuth(['ADMIN', 'SUPER_ADMIN']))
    .use(bearer())
    // .use(jwtPlugin())
    .get(
      '/',
      async () => {
        const res = await MessageController.getMessages()
        return res
      },
      {
        beforeHandle: requireAuth(['SUPER_ADMIN']),
      }
    )
)
