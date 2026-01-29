import { MessageService } from './message.service'
import {
  MessageProps,
  MessageUpdateProps,
  ParamsMessageProps,
} from './message.model'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'

export class MessageController {
  static async addMessageController(
    payload: MessageProps
  ): Promise<ApiResponse> {
    const messageId = await MessageService.addMessage(payload)
    return ResponseHelper.created('Membuat pesan berhasil', messageId)
  }

  static async getAllMessageController(): Promise<ApiResponse> {
    const data = await MessageService.getAllMessage()
    return ResponseHelper.success('Mengambil semua data pesan berhasil', data)
  }

  static async getMessageByIdController(
    params: ParamsMessageProps
  ): Promise<ApiResponse> {
    const { messageId } = params
    await MessageService.verifyMessageIsExist(messageId)
    const message = await MessageService.getMessageById(messageId)
    return ResponseHelper.success('Mengambil pesan berhasil', message)
  }

  static async updateMessageController(
    payload: MessageUpdateProps,
    messageId: string,
    userWhoUpdated: AuthUser
  ): Promise<ApiResponse> {
    await MessageService.verifyMessageIsExist(messageId)
    const { sender_name } = await MessageService.updateMessageById(
      payload,
      messageId,
      userWhoUpdated.user_id
    )
    return ResponseHelper.success(
      `Memperbarui status pesan dari ${sender_name} berhasil`
    )
  }

  static async deleteMessageController(
    messageId: string
  ): Promise<ApiResponse> {
    await MessageService.verifyMessageIsExist(messageId)
    const { sender_name } = await MessageService.deleteMessageById(messageId)

    return ResponseHelper.success(
      `Menghapus pesan dari ${sender_name} berhasil`
    )
  }
}
