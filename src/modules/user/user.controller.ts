import { upload } from '../../shared/services/upload'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import { ParamsUserProps, UserProps } from './user.model'
import { UserService } from './user.service'

export class UserController {
  static async addUserController(
    payload: UserProps,
    userWhoCreated: AuthUser
  ): Promise<ApiResponse> {
    await UserService.verifyUsernameIsExisting(payload.username)

    const roleId = await UserService.getRoleId(payload.userRole)

    const urlProfile = await upload(payload.Profile, '/user')

    const user = await UserService.addUser(
      payload,
      roleId,
      userWhoCreated.user_id,
      urlProfile
    )

    return ResponseHelper.created('Menambah user berhasil', user)
  }

  static async getAllUserController(): Promise<ApiResponse> {
    const { rows } = await UserService.getUsers()
    return ResponseHelper.success('Mengambil semua data user berhasil', rows)
  }

  static async getUserByIdController(
    params: ParamsUserProps
  ): Promise<ApiResponse> {
    const { userId } = params
    await UserService.verifyUserIsExistById(userId)
    const user = await UserService.getUserById(userId)
    return ResponseHelper.success('Mengambil data user berhasil', user)
  }

  static async deleteUserController(
    params: ParamsUserProps
  ): Promise<ApiResponse> {
    const { userId } = params
    await UserService.verifyUserIsExistById(userId)
    const { username } = await UserService.deleteUserById(userId)

    return ResponseHelper.success(`Menghapus user: ${username} berhasil`)
  }
}
