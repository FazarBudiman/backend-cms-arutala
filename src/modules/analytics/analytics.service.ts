import { supabasePool } from '../../supabase/supabasePool'

export class AnalyticsService {
  static async getRecentMessages(limit = 5) {
    const { rows } = await supabasePool.query(
      `
      SELECT
        message_id,
        sender_name,
        sender_email,
        subject,
        created_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' AS created_date
      FROM messages
      WHERE is_deleted = false
      ORDER BY created_date DESC
      LIMIT $1
    `,
      [limit]
    )
    return rows
  }

  static async getUpcomingCourses(limit = 5) {
    const { rows } = await supabasePool.query(
      `SELECT
            c.course_id,
            c.course_title,
            cb.course_batch_name,
            cb.course_batch_start_date,
            cb.course_batch_status
        FROM course_batches cb
        JOIN courses c 
        ON cb.course_batch_course_id = c.course_id
        WHERE cb.course_batch_status IN ('SCHEDULED', 'OPEN', 'ON_GOING')
        AND c.is_deleted = false
        ORDER BY CASE cb.course_batch_status
            WHEN 'SCHEDULED' THEN 1
            WHEN 'OPEN' THEN 2
            WHEN 'ON_GOING' THEN 3
            ELSE 4
        END, cb.course_batch_start_date ASC
        LIMIT $1`,
      [limit]
    )

    return rows
  }

  static async getMessageMonthlyStats() {
    const { rows } = await supabasePool.query(
      `SELECT
        TO_CHAR(created_date, 'Mon YYYY') AS month,
        DATE_TRUNC('month', created_date) AS sort_key,
    COUNT(*)::int AS total
    FROM messages
    WHERE is_deleted = false
    GROUP BY month, sort_key
    ORDER BY sort_key`
    )
    return rows
  }
}
