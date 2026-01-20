import { Static, t } from 'elysia'

export const TestimoniCategory = {
  SISWA: 'SISWA',
  TALENT: 'TALENT',
} as const

export const TestimoniCreateModel = t.Object({
  authorName: t.String({
    minLength: 3,
    maxLength: 50,
    error:
      'Nama pemberi testimoni merupakan string dan harus diisi (3-50 karakter) ',
  }),
  authorJobTitle: t.String({
    minLength: 1,
    maxLength: 50,
    error: 'Harus string dan diisi 1-50 karakter',
  }),
  authorCompanyName: t.String({
    minLength: 1,
    maxLength: 255,
    error: 'Harus string dan diisi 1-255 karakter',
  }),
  authorProfile: t.File({
    type: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: '5m', // Batasi maksimal 2MB
    error:
      'File harus berupa gambar (JPG, PNG, WEBP) dengan ukuran maksimal 5MB',
  }),
  testimoniContent: t.String({
    minLength: 10,
    maxLength: 2000,
    error: 'Isi testimoni minimal 10 karakter dan maksimal 2000 karakter',
  }),
  testimoniCategory: t.Enum(TestimoniCategory, {
    error: 'Category tidak valid',
  }),
})

export type TestimoniCreateProps = Static<typeof TestimoniCreateModel>

export const TestimoniUpdateModel = t.Object({
  authorName: t.Optional(
    t.String({
      minLength: 3,
      maxLength: 50,
      error:
        'Nama pemberi testimoni merupakan string dan harus diisi (3-50 karakter) ',
    })
  ),
  authorJobTitle: t.Optional(
    t.String({
      minLength: 1,
      maxLength: 50,
      error: 'Harus string dan diisi 1-50 karakter',
    })
  ),
  authorCompanyName: t.Optional(
    t.String({
      minLength: 1,
      maxLength: 255,
      error: 'Harus string dan diisi 1-255 karakter',
    })
  ),
  authorProfile: t.Optional(
    t.File({
      type: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: '5m', // Batasi maksimal 2MB
      error:
        'File harus berupa gambar (JPG, PNG, WEBP) dengan ukuran maksimal 5MB',
    })
  ),
  testimoniContent: t.Optional(
    t.String({
      minLength: 10,
      maxLength: 2000,
      error: 'Isi testimoni minimal 10 karakter dan maksimal 2000 karakter',
    })
  ),
  testimoniCategory: t.Optional(
    t.Enum(TestimoniCategory, {
      error: 'Category tidak valid',
    })
  ),
  isDisplayed: t.Optional(t.Boolean()),
})

export type TestimoniUpdateProps = Static<typeof TestimoniUpdateModel>
