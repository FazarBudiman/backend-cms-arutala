import { upload } from '../../shared/services/upload'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import { MitraProps, ParamsMitraProps } from './mitra.model'
import { MitraService } from './mitra.service'

export class MitraController {
  static async addMitraController(
    payload: MitraProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const urlLogo = await upload(payload.mitraLogo, '/mitra')
    const mitraId = await MitraService.addMitra(payload, urlLogo, user.user_id)
    return ResponseHelper.created('Menambah mitra berhasil', mitraId)
  }

  static async getAllMitraController(): Promise<ApiResponse> {
    const mitras = await MitraService.getAllMitra()
    return ResponseHelper.success(
      'Mengambil seluruh data mitra berhasil',
      mitras
    )
  }

  static async getMitraByIdController(
    params: ParamsMitraProps
  ): Promise<ApiResponse> {
    const { mitraId } = params
    await MitraService.verifyMitraIsExist(mitraId)
    const mitra = await MitraService.getMitraById(mitraId)
    return ResponseHelper.success('Mengambil data mitra berhasil', mitra)
  }

  static async updateMitraController(
    params: ParamsMitraProps,
    payload: Partial<MitraProps>,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { mitraId } = params
    await MitraService.verifyMitraIsExist(mitraId)

    let logoUrl: string | null = null
    if (payload.mitraLogo) {
      logoUrl = await upload(payload.mitraLogo, '/mitra')
    }

    const { mitra_name } = await MitraService.updateMitra(
      mitraId,
      payload,
      logoUrl,
      user.user_id
    )
    return ResponseHelper.success(`Memperbarui mitra: ${mitra_name} berhasil`)
  }

  static async deleteMitraController(mitraId: string): Promise<ApiResponse> {
    await MitraService.verifyMitraIsExist(mitraId)
    const { mitra_name } = await MitraService.deleteMitra(mitraId)

    return ResponseHelper.success(`Menghapus mitra: ${mitra_name} berhasil`)
  }
}
