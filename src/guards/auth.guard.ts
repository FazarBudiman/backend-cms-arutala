import { ForbiddenError, UnauthorizedError } from '../exceptions/auth.error'
import { AuthUser } from '../types/auth.type'
import { AccessTokenPayload } from '../plugins/jwt/token.schema'

export const requireAuth = (permission: string) => async (ctx: any) => {
  // Authentication
  const { bearer, accessToken, store } = ctx
  if (!bearer) {
    throw new UnauthorizedError('Missing access token')
  }

  const payload = (await accessToken.verify(bearer)) as
    | AccessTokenPayload
    | false

  if (!payload) {
    throw new UnauthorizedError('Invalid or expired token')
  }

  if (!payload.user_permissions.includes(permission)) {
    throw new ForbiddenError('Insufficient permissions')
  }

  // Set Context for User Authenticated
  const user: AuthUser = {
    user_id: payload.user_id,
    user_role: payload.user_role,
    user_permissions: payload.user_permissions,
  }

  store.user = user
}
