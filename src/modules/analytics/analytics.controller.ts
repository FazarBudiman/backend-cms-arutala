import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import { AnalyticsService } from './analytics.service'

export class AnalyticsController {
  static async getOverviewController(): Promise<ApiResponse> {
    const [recentMessages, upcomingCourses, messageStats] = await Promise.all([
      AnalyticsService.getRecentMessages(5),
      AnalyticsService.getUpcomingCourses(5),
      AnalyticsService.getMessageMonthlyStats(),
    ])

    return ResponseHelper.success(`Mengambil overview analytics berhasil`, {
      messages: {
        recent: recentMessages,
        stats: messageStats,
      },
      courses: {
        upcoming: upcomingCourses,
      },
    })
  }
}
