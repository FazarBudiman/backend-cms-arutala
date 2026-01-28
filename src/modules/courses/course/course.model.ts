import { Static, t } from 'elysia'

// Model Create Course
export const CourseCreateModel = t.Object({
  courseTitle: t.String({
    minLength: 5,
    maxLength: 255,
    error: 'Judul course minimal 5 dan maksimal 255 karakter',
  }),
  courseDescription: t.String({
    minLength: 50,
    maxLength: 1000,
    error: 'Deskripsi course minimal 50 dan maksimal 1000 karakter',
  }),
  courseCategoryId: t.String({
    format: 'uuid',
    error: 'Format uuid tidak valid',
  }),
  courseFieldId: t.String({
    format: 'uuid',
    error: 'Format uuid tidak valid',
  }),
  courseBenefits: t.Array(
    t.Object({
      courseBenefitId: t.String({
        format: 'uuid',
        error: 'Format uuid tidak valid',
      }),
      orderNum: t.Integer({
        error: 'order num harus integer',
      }),
    })
  ),
  courseMaterials: t.Array(
    t.Object({
      title: t.String({
        minLength: 5,
        maxLength: 255,
        error: 'Judul course minimal 5 dan maksimal 255 karakter',
      }),
      description: t.String({
        minLength: 50,
        maxLength: 1000,
        error: 'Deskripsi course minimal 50 dan maksimal 1000 karakter',
      }),
      orderNum: t.Integer({
        error: 'order num harus integer',
      }),
    })
  ),
})

export type CourseCreateProps = Static<typeof CourseCreateModel>

// Model Update Course
export const CourseBenefitsUpdateModel = t.Optional(
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

export type CourseBenefitsUpdateProps = Static<typeof CourseBenefitsUpdateModel>

export const CourseMaterialsUpdateModel = t.Optional(
  t.Array(
    t.Object({
      title: t.String({
        minLength: 5,
        maxLength: 255,
        error: 'Judul course minimal 5 dan maksimal 255 karakter',
      }),
      description: t.String({
        minLength: 50,
        maxLength: 1000,
        error: 'Deskripsi course minimal 50 dan maksimal 1000 karakter',
      }),
      orderNum: t.Integer({
        error: 'order num harus integer',
      }),
    })
  )
)
export type CourseMaterialsUpdateProps = Static<
  typeof CourseMaterialsUpdateModel
>

export const CourseUpdateModel = t.Object({
  courseTitle: t.Optional(
    t.String({
      minLength: 5,
      maxLength: 255,
      error: 'Judul course minimal 5 dan maksimal 255 karakter',
    })
  ),
  courseDescription: t.Optional(
    t.String({
      minLength: 50,
      maxLength: 1000,
      error: 'Deskripsi course minimal 50 dan maksimal 1000 karakter',
    })
  ),
  courseCategoryId: t.Optional(
    t.String({
      format: 'uuid',
      error: 'Format uuid tidak valid',
    })
  ),
  courseFieldId: t.Optional(
    t.String({
      format: 'uuid',
      error: 'Format uuid tidak valid',
    })
  ),
  courseBenefits: CourseBenefitsUpdateModel,
  courseMaterials: CourseMaterialsUpdateModel,
})

export type CourseUpdateProps = Static<typeof CourseUpdateModel>

// Model Query Parameter Get All Course
export const QueryParamsCourseModel = t.Object({
  field: t.Optional(t.String()),
  available: t.Optional(t.Boolean()),
})

export type QueryParamsCourseProps = Static<typeof QueryParamsCourseModel>
