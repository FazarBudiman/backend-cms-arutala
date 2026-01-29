import { Static, t } from 'elysia'

// Model Request Body Testimoni
export const TestimoniCategory = {
  SISWA: 'SISWA',
  TALENT: 'TALENT',
} as const

export const TestimoniModel = t.Object({
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
    maxSize: '5m',
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
export type TestimoniProps = Static<typeof TestimoniModel>

// Model Query Category Testimoni
export const QueryTestimoniModel = t.Object({
  category: t.Optional(
    t.Union([t.Literal('siswa'), t.Literal('talent')], {
      error: "Query 'category' harus bernilai 'siswa' atau 'talent'",
    })
  ),
})
export type QueryTestimoniProps = Static<typeof QueryTestimoniModel>

// Model Params Testimoni Id
export const ParamsTestimoniModel = t.Object({
  testimoniId: t.String({
    format: 'uuid',
    error: 'Format param testimoni id tidak valid',
  }),
})
export type ParamsTestimoniProps = Static<typeof ParamsTestimoniModel>
