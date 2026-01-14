import { Static, t } from 'elysia'

export const UserCreateModel = t.Object({
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
  userRole: t.Union([t.Literal('ADMIN'), t.Literal('SUPER_ADMIN')], {
    error: 'Role tidak valid. Pilih antara ADMIN atau SUPER_ADMIN',
  }),
  urlProfile: t.Optional(
    t.String({
      format: 'uri',
      error:
        'URL profil harus berupa format URL yang valid (misal: https://...)',
    })
  ),
})

export type UserCreateProps = Static<typeof UserCreateModel>
