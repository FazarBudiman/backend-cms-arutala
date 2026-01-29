import { upload } from '../../shared/services/upload'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import {
  ParamsTestimoniProps,
  QueryTestimoniProps,
  TestimoniProps,
} from './testimoni.model'
import { TestimoniService } from './testimoni.service'

export class TestimoniController {
  static async addTestimoniController(
    payload: TestimoniProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const authorProfileUrl = await upload(payload.authorProfile, '/testimoni')
    const testimoniId = await TestimoniService.addTestimoni(
      payload,
      authorProfileUrl,
      user.user_id
    )
    return ResponseHelper.created('Menambah testimoni berhasil', testimoniId)
  }

  static async getAllTestimoniController(
    query: QueryTestimoniProps
  ): Promise<ApiResponse> {
    const testimonies = await TestimoniService.getAllTestimoni(query)
    return ResponseHelper.success(
      'Mengambil semua data testimoni berhasil',
      testimonies
    )
  }

  static async getTestimoniByIdController(
    params: ParamsTestimoniProps
  ): Promise<ApiResponse> {
    const { testimoniId } = params
    await TestimoniService.verifyTestimoniIsExist(testimoniId)
    const testimoni = await TestimoniService.getTestimoniById(testimoniId)
    return ResponseHelper.success('Mengambi data testimoni berhasil', testimoni)
  }

  static async updateTestimoniController(
    payload: Partial<TestimoniProps>,
    params: ParamsTestimoniProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { testimoniId } = params
    await TestimoniService.verifyTestimoniIsExist(testimoniId)

    let authorProfileUrl: string | null = null
    if (payload.authorProfile) {
      authorProfileUrl = await upload(payload.authorProfile, '/testimoni')
    }

    const { author_name } = await TestimoniService.updateTestimoni(
      testimoniId,
      payload,
      authorProfileUrl,
      user.user_id
    )
    return ResponseHelper.success(
      `Memperbarui testimoni dari ${author_name} berhasil`
    )
  }

  static async deleteTestimoniController(
    params: ParamsTestimoniProps
  ): Promise<ApiResponse> {
    const { testimoniId } = params
    await TestimoniService.verifyTestimoniIsExist(testimoniId)
    const { author_name } = await TestimoniService.deleteTestimoni(testimoniId)
    return ResponseHelper.success(
      `Menghapus testimoni dari ${author_name} berhasil`
    )
  }
}
