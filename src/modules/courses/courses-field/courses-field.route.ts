import { bearer } from '@elysiajs/bearer'
import { Elysia } from 'elysia'
import { CourseFieldController } from './courses-field.controller'

export const courseField = new Elysia({ prefix: '/courses-field' })
  .use(bearer())
  .get(
    '/',
    async () => {
      const res = await CourseFieldController.getAllCourseFieldController()
      return res
    },
    {
      detail: {
        tags: ['Courses'],
        summary: '[course-field] Get All Course Field',
      },
    }
  )
