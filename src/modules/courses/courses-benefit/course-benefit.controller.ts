import { ApiResponse } from '../../../types/response.type'
import { ResponseHelper } from '../../../utils/responseHelper'
import { CourseBenefitService } from './course-benefit.service'

export class CourseBenefitController {
  static async getAllCourseBenefitController(): Promise<ApiResponse> {
    const courseBenefit = await CourseBenefitService.getAllCourseBenefit()
    return ResponseHelper.success(
      'Mengambil data Course Benefit Berhasil',
      courseBenefit
    )
  }
}
