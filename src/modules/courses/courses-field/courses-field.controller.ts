import { ApiResponse } from '../../../types/response.type'
import { ResponseHelper } from '../../../utils/responseHelper'
import { CourseFieldService } from './courses-field.service'

export class CourseFieldController {
  static async getAllCourseFieldController(): Promise<ApiResponse> {
    const courseField = await CourseFieldService.getAllCourseField()
    return ResponseHelper.success(
      'Mengambil data course field berhasil',
      courseField
    )
  }
}
