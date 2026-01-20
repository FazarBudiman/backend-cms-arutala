import { upload } from '../../shared/services/upload'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import { TestimoniCreateProps, TestimoniUpdateProps } from './testimoni.model'
import { TestimoniService } from './testimoni.service'

export class TestimoniController {
  static async addTestimoniController(
    payload: TestimoniCreateProps,
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
    category?: 'siswa' | 'talent'
  ): Promise<ApiResponse> {
    const testimoni = await TestimoniService.getAllTestimoni(category)
    return ResponseHelper.success(
      'Mengambil data testimoni berhasil',
      testimoni
    )
  }

  static async updateTestimoniController(
    payload: TestimoniUpdateProps,
    testimoniId: string,
    user: AuthUser
  ): Promise<ApiResponse> {
    await TestimoniService.getTestimoniById(testimoniId)

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
    testimoniId: string
  ): Promise<ApiResponse> {
    await TestimoniService.getTestimoniById(testimoniId)
    const { author_name } = await TestimoniService.deleteTestimoni(testimoniId)
    return ResponseHelper.success(
      `Menghapus testimoni dari ${author_name} berhasil`
    )
  }
}
