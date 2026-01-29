import { Static, t } from 'elysia'

// Model Request Body Mitra
export const MitraModel = t.Object({
  mitraName: t.String({
    minLength: 2,
    maxLength: 100,
    error: 'Nama perusahaan harus memiliki 3 sampai 100 karakter',
  }),

  businessField: t
    .Transform(
      t.Union([
        t.String({ error: 'Isi minimal 1 bidang perusahaan' }), // Terima string (1 nilai)
        t.Array(t.String(), {
          minItems: 1,
          error: 'Isi minimal satu bidang perusahaan',
        }), // Atau array (multiple nilai)
      ])
    )
    .Decode((value) => {
      // Normalize: selalu jadikan array
      return Array.isArray(value) ? value : [value]
    })
    .Encode((value) => value), // Encode tetap array

  mitraLogo: t.File({
    type: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: '5m', // Batasi maksimal 2MB
    error:
      'File harus berupa gambar (JPG, PNG, WEBP) dengan ukuran maksimal 5MB',
  }),
})
export type MitraProps = Static<typeof MitraModel>

// Model Params Mitra Id
export const ParamsMitraModel = t.Object({
  mitraId: t.String({
    format: 'uuid',
    error: 'Format param mitra id tidak valid',
  }),
})
export type ParamsMitraProps = Static<typeof ParamsMitraModel>
