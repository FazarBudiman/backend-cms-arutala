import { bearer } from '@elysiajs/bearer'
import { Elysia } from 'elysia'
// import { assertAuth } from '../../../utils/assertAuth'
// import { requireAuth } from '../../../guards/auth.guard'
// import { CourseCreateModel } from './course.model'
import { CourseController } from './course.controller'

export const course = new Elysia()
  .use(bearer())
  // .post(
  //   '/',
  //   async ({ body, set, store }) => {
  //     const res = await CourseController.addCourseController(
  //       body,
  //       assertAuth(store)
  //     )
  //     set.status = 201
  //     return res
  //   },
  //   {
  //     beforeHandle: requireAuth('CREATE_COURSE'),
  //     body: CourseCreateModel,
  //   }
  // )
  .get(
    '/:courseId',
    async ({ params }) => {
      const res = await CourseController.getCourseByIdController(
        params.courseId
      )
      return res
    },
    {
      detail: {
        tags: ['Courses'],
        summary: 'Get course By Id',
      },
    }
  )
