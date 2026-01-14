import { UnauthorizedError } from '../exceptions/auth.error'
import { type Role, Roles } from '../types/role.type'

export function assertValidRole(value: unknown): asserts value is Role {
  if (typeof value !== 'string' || !Roles.includes(value as Role)) {
    throw new UnauthorizedError('Invalid role in token')
  }
}
