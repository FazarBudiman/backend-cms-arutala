import { jwt } from '@elysiajs/jwt'
import { Elysia } from 'elysia'

const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env

export const jwtPlugin = new Elysia()
  .use(
    jwt({
      name: 'accessToken',
      secret: ACCESS_TOKEN_KEY!,
      exp: '60m',
    })
  )
  .use(
    jwt({
      name: 'refreshToken',
      secret: REFRESH_TOKEN_KEY!,
      exp: '7d',
    })
  )
