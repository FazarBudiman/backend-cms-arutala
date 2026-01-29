import { Static, t } from 'elysia'

export const ContributorType = {
  INTERNAL: 'INTERNAL',
  EXTERNAL: 'EXTERNAL',
}

// Model Request Body Contributor
export const ContributorModel = t.Object({
  contributorName: t.String({
    minLength: 3,
    maxLength: 100,
    pattern: "^[a-zA-Z\\s.\\,']+$",
    error:
      'Nama contributor minimal 3 karakter dan tidak boleh mengandung karakter spesial/angka',
  }),
  jobTitle: t.String({
    minLength: 1,
    maxLength: 50,
    error: 'Job title harus diisi (2-50 karakter)',
  }),
  companyName: t.String({
    minLength: 2,
    maxLength: 50,
    error: 'Nama perusahaan harus diisi (2-50 karakter)',
  }),
  expertise: t
    .Transform(
      t.Union([
        t.String({ error: 'Isi minimal 1 keahlian' }), // Terima string (1 nilai)
        t.Array(t.String(), {
          minItems: 1,
          error: 'Isi minimal 1 keahlian',
        }),
      ])
    )
    .Decode((value) => {
      // Normalize: selalu jadikan array
      return Array.isArray(value) ? value : [value]
    })
    .Encode((value) => value), // Encode tetap array

  profile: t.File({
    type: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: '5m',
    error:
      'File harus berupa gambar (JPG, PNG, WEBP) dengan ukuran maksimal 5MB',
  }),
  contributorType: t.Enum(ContributorType, {
    error:
      'Contributor Type tidak valid. Pastikan nilai merupakan INTERNAL untuk Mentor dan EXTERNAL untuk bukan Mentor',
  }),
})
export type ContributorProps = Static<typeof ContributorModel>

// Model Query Type Contributor
export const QueryContributorTypeModel = t.Object({
  type: t.Optional(
    t.Union([t.Literal('internal'), t.Literal('external')], {
      error: "Query 'type' harus bernilai 'internal' atau 'external'",
    })
  ),
})
export type QueryContributorTypeProps = Static<typeof QueryContributorTypeModel>

// Model Params Contributor Id
export const ParamsContributorModel = t.Object({
  contributorId: t.String({
    format: 'uuid',
    error: 'Format param contributor id tidak valid',
  }),
})
export type ParamsContributorProps = Static<typeof ParamsContributorModel>
