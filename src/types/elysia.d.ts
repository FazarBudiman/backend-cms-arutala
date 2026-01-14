import 'elysia'
import { AuthUser } from './auth.type'

declare module 'elysia' {
  interface Store {
    user?: AuthUser
  }
}
