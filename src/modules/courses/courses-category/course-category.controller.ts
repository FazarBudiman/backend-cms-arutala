import { ApiResponse } from '../../../types/response.type'
import { convertDuration } from '../../../utils/convertDuration'
import { ResponseHelper } from '../../../utils/responseHelper'
import { CourseCategoryService } from './course-category.service'

export class CourseCategoryController {
  static async getAllCourseCategoryController(): Promise<ApiResponse> {
    const courseCategory = await CourseCategoryService.getAllCourseCategory()

    const mappedCourseCategory = courseCategory.map((category) => ({
      id: category.id,
      name: category.name,
      min_duration: convertDuration(category.min_duration),
      max_duration: convertDuration(category.max_duration),
    }))

    return ResponseHelper.success(
      'Mengambil data course category berhasil',
      mappedCourseCategory
    )
  }
}
