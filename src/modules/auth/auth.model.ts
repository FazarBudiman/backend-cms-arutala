import { Static, t } from 'elysia'

export const SignInModel = t.Object({
  username: t.RegExp(/^[^\s]{8,}$/, {
    error: 'Username minimal 8 karakter dan tidak boleh mengandung spasi',
  }),
  password: t.RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/,
    {
      error:
        'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol',
    }
  ),
})

export type SignInProps = Static<typeof SignInModel>

export const RefreshTokenModel = t.Object({
  refresh_token: t.String({
    error: 'Token harus berupa string',
  }),
})

export type RefreshTokenProps = Static<typeof RefreshTokenModel>
