import { UnauthorizedError } from '../exceptions/auth.error'
import { AuthUser } from '../types/auth.type'

export const assertAuth = (store: { user?: AuthUser }): AuthUser => {
  if (!store.user) {
    throw new UnauthorizedError('Auth context missing')
  }
  return store.user
}
