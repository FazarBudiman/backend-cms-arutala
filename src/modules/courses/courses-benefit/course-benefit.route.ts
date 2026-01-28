import bearer from '@elysiajs/bearer'
import Elysia from 'elysia'
import { CourseBenefitController } from './course-benefit.controller'
import { requireAuth } from '../../../guards/auth.guard'

export const courseBenefit = new Elysia({ prefix: '/courses-benefit' })
  .use(bearer())
  .get(
    '/',
    async () => {
      const res = await CourseBenefitController.getAllCourseBenefitController()
      return res
    },
    {
      beforeHandle: requireAuth('READ_COURSE'),
      detail: {
        tags: ['Courses'],
        summary: '[course-benefit] Get All Course Benefit',
      },
    }
  )
