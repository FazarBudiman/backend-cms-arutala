// import { Elysia } from 'elysia'
// import { bearer } from '@elysiajs/bearer'
// import { jwtPlugin } from '../plugins/jwt.plugin'
// import { Role } from '../types/role.type'
// import { UnauthorizedError, ForbiddenError } from '../exceptions/auth.error'
// import { AccessTokenPayload } from '../types/jwtPayload.type'

// export const requireAuth = (roles?: Role | Role[]) =>
//   new Elysia()
//     .use(bearer())
//     .use(jwtPlugin)
//     .onBeforeHandle(async ({ bearer, accessToken }) => {
//       if (!bearer) {
//         throw new UnauthorizedError('Missing access token')
//       }

//       const payload = (await accessToken.verify(bearer)) as
//         | AccessTokenPayload
//         | false
//       if (!payload) {
//         throw new UnauthorizedError('Invalid or expired token')
//       }

//       // Role validation (optional)
//       if (roles) {
//         const allowedRoles = Array.isArray(roles) ? roles : [roles]

//         if (!allowedRoles.includes(payload.user_role)) {
//           throw new ForbiddenError('Insufficient permissions')
//         }
//       }
//     })

import { Role } from '../types/role.type'
import { UnauthorizedError, ForbiddenError } from '../exceptions/auth.error'
import { AccessTokenPayload } from '../types/jwtPayload.type'

export const requireAuth =
  (roles?: Role | Role[]) =>
  async ({ bearer, accessToken }: any) => {
    if (!bearer) {
      throw new UnauthorizedError('Missing access token')
    }

    const payload = (await accessToken.verify(bearer)) as
      | AccessTokenPayload
      | false

    if (!payload) {
      throw new UnauthorizedError('Invalid or expired token')
    }

    if (roles) {
      const allowedRoles = Array.isArray(roles) ? roles : [roles]

      if (!allowedRoles.includes(payload.user_role)) {
        throw new ForbiddenError('Insufficient permissions')
      }
    }
  }
