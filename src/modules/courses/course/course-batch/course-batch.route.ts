import bearer from '@elysiajs/bearer'
import Elysia from 'elysia'
import { assertAuth } from '../../../../utils/assertAuth'
import {
  CourseBatchCreateModel,
  CourseBatchPosterUploadModel,
} from './course-batch.model'
import { CourseBatchController } from './course-batch.controller'
import { requireAuth } from '../../../../guards/auth.guard'

export const courseBatch = new Elysia({ prefix: '/:courseId/batch' })
  .use(bearer())
  .post(
    '/',
    async ({ body, store, set, params }) => {
      const res = await CourseBatchController.addCourseBatchController(
        body,
        assertAuth(store),
        params.courseId
      )

      set.status = 201
      return res
    },
    {
      beforeHandle: requireAuth('CREATE_COURSE'),
      body: CourseBatchCreateModel,
      detail: {
        tags: ['Courses'],
        summary: '[course-batch] Create a New Batch for Course',
      },
    }
  )
  .post(
    '/:batchId/upload',
    async ({ body, params }) => {
      const res = await CourseBatchController.uploadCourseBatchPosterController(
        body,
        params
      )
      return res
    },
    {
      beforeHandle: requireAuth('CREATE_COURSE'),
      body: CourseBatchPosterUploadModel,
      detail: {
        tags: ['Courses'],
        summary: '[course-batch] Upload Poster for Batch of Course',
      },
    }
  )

// .put(
//   '/:batchId',
//   async ({ body, params, store }) => {
//     const res = await CourseBatchController.updateCourseBatchController(
//       body,
//       params.batchId,
//       store
//     )
//     return res
//   },
//   {
//     beforeHandle: requireAuth('UPDATE_COURSE'),
//     detail: {
//       tags: ['Courses'],
//       summary: '[course-batch] Update Batch in Course by Batch Id',
//     },
//   }
// )
