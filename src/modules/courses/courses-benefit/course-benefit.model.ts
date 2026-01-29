import { Static, t } from 'elysia'

export const CourseBenefitCreateModel = t.Array(
  t.Object({
    courseBenefitId: t.String({
      format: 'uuid',
      error: 'Format uuid tidak valid',
    }),
    orderNum: t.Integer({
      error: 'order num harus integer',
    }),
  })
)

export type COurseBenefitCreateProps = Static<typeof CourseBenefitCreateModel>

export const CourseBenefitUpdateModel = t.Optional(
  t.Array(
    t.Object({
      courseBenefitId: t.String({
        format: 'uuid',
        error: 'Format uuid tidak valid',
      }),
      orderNum: t.Integer({
        error: 'order num harus integer',
      }),
    })
  )
)

export type COurseBenefitUpdateProps = Static<typeof CourseBenefitUpdateModel>
