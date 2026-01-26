// import { CourseCreateProps } from './course.model'
import { ApiResponse } from '../../../types/response.type'
// import { AuthUser } from '../../../types/auth.type'
// import { upload } from '../../../shared/services/upload'
import { ResponseHelper } from '../../../utils/responseHelper'
import { CourseBatchService } from './course-batch/course-batch.service'
import { CourseBenefitService } from './course-benefit/course-benefit.service'
import { CourseMaterialService } from './course-material/course-material.service'
import { CourseService } from './course.service'

export class CourseController {
  // static async addCourseController(
  //   payload: CourseCreateProps,
  //   user: AuthUser
  // ): Promise<ApiResponse> {
  //   const coursePosterUrl = await upload(payload.coursePoster, '/course')
  //   const courseId = await CourseService.addCourse(
  //     payload,
  //     coursePosterUrl,
  //     user.user_id
  //   )
  //   return ResponseHelper.created('Menambah course berhasil', courseId)
  // }

  static async getCourseByIdController(courseId: string): Promise<ApiResponse> {
    await CourseService.verifyCourseisExist(courseId)
    const course = await CourseService.getCourseById(courseId)

    const courseMaterial =
      await CourseMaterialService.getCourseMaterialByCourseId(courseId)

    const courseBenefit =
      await CourseBenefitService.getCourseBenefitByCourseId(courseId)

    const courseBatch =
      await CourseBatchService.getCourseBatchByCourseId(courseId)

    const data = {
      ...course,
      course_material: courseMaterial,
      course_benefit: courseBenefit,
      course_batch: courseBatch,
    }
    return ResponseHelper.success('Mengambil data course berhasil', data)
  }
}
