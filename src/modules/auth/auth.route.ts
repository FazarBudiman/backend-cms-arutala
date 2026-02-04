import { Elysia } from 'elysia'
import { AuthController } from './auth.controller'
import { SignInModel } from './auth.model'
import { jwtPlugin } from '../../plugins/jwt/jwt.plugin'

const { NODE_ENV } = process.env

export const auth = (app: Elysia) =>
  app.group('/auth', (app) =>
    app
      .use(jwtPlugin)
      .post(
        '/sign-in',
        async ({ body, accessToken, refreshToken, cookie }) => {
          const res = await AuthController.signInController(
            body,
            accessToken,
            refreshToken
          )

          const { data } = res
          cookie.refresh_token.set({
            value: data.refresh_token,
            httpOnly: true,
            secure: NODE_ENV === 'production',
            // sameSite: 'strict',
            sameSite: 'none',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })

          return res
        },
        {
          body: SignInModel,
          detail: {
            tags: ['Auth'],
            summary: 'Sign In',
          },
        }
      )

      .put(
        '/refresh',
        async ({ cookie, accessToken, refreshToken }) => {
          const token = cookie.refresh_token.value

          const res = AuthController.refreshController(
            token,
            accessToken,
            refreshToken
          )
          return res
        },
        {
          detail: {
            tags: ['Auth'],
            summary: 'Refresh Access Token',
          },
        }
      )
      .delete(
        '/sign-out',
        async ({ cookie }) => {
          const token = cookie.refresh_token.value
          const res = await AuthController.signOutController(token)
          return res
        },
        {
          detail: {
            tags: ['Auth'],
            summary: 'Sign Out',
          },
        }
      )
  )
