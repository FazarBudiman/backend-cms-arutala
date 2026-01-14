import { Role } from './role.type'

export interface AuthUser {
  user_id: string
  user_role: Role
}
