import { MessageService } from './message.service'
import { MessageCreateProps } from './message.model'

export class MessageController {
  static async getMessages() {
    const data = await MessageService.fetchMessages()
    return {
      status: 'success',
      data,
    }
  }

  static async addMessage(payload: MessageCreateProps) {
    const data = await MessageService.addMessage(payload)
    return {
      status: 'success',
      data,
    }
  }
}
