import { upload } from '../../shared/services/upload'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import {
  ContributorProps,
  ParamsContributorProps,
  QueryContributorTypeProps,
} from './contributor.model'
import { ContributorService } from './contributor.service'

export class ContributorController {
  static async addContributorController(
    payload: ContributorProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const urlProfile = await upload(payload.profile, '/contributor')
    const contributorId = await ContributorService.addContributor(
      payload,
      urlProfile,
      user.user_id
    )

    return ResponseHelper.created(
      'Menambah contributor berhasil',
      contributorId
    )
  }

  static async getAllContributorController(
    query: QueryContributorTypeProps
  ): Promise<ApiResponse> {
    const contributors = await ContributorService.getAllContributor(query)

    return ResponseHelper.success(
      'Mengambil semua data contributor berhasil',
      contributors
    )
  }

  static async getContributorByIdController(
    params: ParamsContributorProps
  ): Promise<ApiResponse> {
    const { contributorId } = params
    await ContributorService.verifyContributorIsExist(contributorId)
    const contributor =
      await ContributorService.getContributorById(contributorId)
    return ResponseHelper.success(
      'Mengalbil data contributor berhasil',
      contributor
    )
  }

  static async updateContributorController(
    params: ParamsContributorProps,
    payload: Partial<ContributorProps>,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { contributorId } = params
    await ContributorService.verifyContributorIsExist(contributorId)

    let profileUrl: string | null = null
    if (payload.profile) {
      profileUrl = await upload(payload.profile, '/contributor')
    }

    const { contributor_name } = await ContributorService.updateContributor(
      contributorId,
      payload,
      profileUrl,
      user.user_id
    )

    return ResponseHelper.success(
      `Memperbarui contributor: ${contributor_name} berhasil`
    )
  }

  static async deleteContributorController(
    params: ParamsContributorProps
  ): Promise<ApiResponse> {
    const { contributorId } = params
    await ContributorService.verifyContributorIsExist(contributorId)
    const { contributor_name } =
      await ContributorService.deleteContributor(contributorId)

    return ResponseHelper.success(
      `Menghapus contributor: ${contributor_name} berhasil`
    )
  }
}
