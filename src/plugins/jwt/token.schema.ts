import { t, Static } from 'elysia'

export const AccessTokenSchema = t.Object({
  user_id: t.String(),
  user_role: t.Union([t.Literal('ADMIN'), t.Literal('SUPER_ADMIN')]),
  user_permissions: t.Array(t.String()),
})

export type AccessTokenPayload = Static<typeof AccessTokenSchema>
