import { Static, t } from 'elysia'

export const UserUploadModel = t.Object({
  profile: t.File({
    type: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: '5m', // Batasi maksimal 2MB
    error:
      'File harus berupa gambar (JPG, PNG, WEBP) dengan ukuran maksimal 5MB',
  }),
})

export type UserUploadProps = Static<typeof UserUploadModel>

export const UserRole = {
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const

export const UserCreateModel = t.Object({
  username: t.String(
    t.RegExp(/^[^\s]{8,}$/, {
      error: 'Username minimal 8 karakter dan tidak boleh mengandung spasi',
    })
  ),
  password: t.String(
    t.RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/, {
      error:
        'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol',
    })
  ),
  userRole: t.Enum(UserRole, {
    error: 'Role User tidak valid',
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
