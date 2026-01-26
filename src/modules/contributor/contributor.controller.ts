import { upload } from '../../shared/services/upload'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import {
  ContributorCreateProps,
  ContributorUpdateProps,
} from './contributor.model'
import { ContributorService } from './contributor.service'

export class ContributorController {
  static async addContributorController(
    payload: ContributorCreateProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const urlProfile = await upload(payload.profile, '/contributor')
    const contributor_id = await ContributorService.addContributor(
      payload,
      user.user_id,
      urlProfile
    )

    return ResponseHelper.created(
      'Menambah contributor berhasil',
      contributor_id
    )
  }

  static async getAllContributorController(
    type?: 'internal' | 'external'
  ): Promise<ApiResponse> {
    const contributors = await ContributorService.getAllContributor(type)

    return ResponseHelper.success(
      'Mengambil semua data contributor berhasil',
      contributors
    )
  }

  static async updateContributorController(
    contributorId: string,
    payload: ContributorUpdateProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    await ContributorService.getContributorById(contributorId)

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
    contributorId: string
  ): Promise<ApiResponse> {
    await ContributorService.getContributorById(contributorId)
    const { contributor_name } =
      await ContributorService.deleteContributor(contributorId)

    return ResponseHelper.success(
      `Menghapus contributor: ${contributor_name} berhasil`
    )
  }
}
