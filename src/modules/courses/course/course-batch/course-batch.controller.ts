import { upload } from '../../../../shared/services/upload'
import { AuthUser } from '../../../../types/auth.type'
import { ApiResponse } from '../../../../types/response.type'
import { ResponseHelper } from '../../../../utils/responseHelper'
import { CourseService } from '../course.service'
import {
  CourseBatchCreateProps,
  CourseBatchPosterUploadProps,
} from './course-batch.model'
import { CourseBatchService } from './course-batch.service'

export class CourseBatchController {
  static async addCourseBatchController(
    body: CourseBatchCreateProps,
    user: AuthUser,
    courseId: string
  ): Promise<ApiResponse> {
    await CourseService.verifyCourseisExist(courseId)
    const course_batch_id = await CourseBatchService.addCourseBatch(
      body,
      courseId
      // user.user_id
    )
    return ResponseHelper.success('Menambah batch pada course berhasil', {
      course_batch_id,
    })
  }

  static async uploadCourseBatchPosterController(
    body: CourseBatchPosterUploadProps,
    params: { courseId: string; batchId: string }
  ): Promise<ApiResponse> {
    await CourseService.verifyCourseisExist(params.courseId)
    await CourseBatchService.verfifyCourseBatchisExist(params.batchId)
    const posterUrl = await upload(body.poster, '/course')
    await CourseBatchService.addPosterUrlIntoBatch(posterUrl, params.batchId)

    return ResponseHelper.success('Upload poster pada batch berhasil', {
      poster_url: posterUrl,
    })
  }
}
