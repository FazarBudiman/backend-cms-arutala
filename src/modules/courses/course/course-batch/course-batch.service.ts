import {
  BadRequest,
  ResourceNotFoundError,
} from '../../../../exceptions/client.error'
import { supabasePool } from '../../../../supabase/supabasePool'
import { CourseBatchCreateProps } from './course-batch.model'

export class CourseBatchService {
  static async addCourseBatch(
    payload: CourseBatchCreateProps,
    courseId: string
    // userWhocreated: string
  ) {
    const client = await supabasePool.connect()
    const {
      batchName,
      contributorId,
      registrationStart,
      registrationEnd,
      startDate,
      endDate,
      batchStatus,
      batchSession,
      batchPrice,
    } = payload

    try {
      await client.query

      const { rows } = await client.query(
        `INSERT INTO course_batches (
          course_batch_course_id, course_batch_name,
          course_batch_contributor_id, course_batch_registration_start, 
          course_batch_registration_end, course_batch_start_date,
          course_batch_end_date, course_batch_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING course_batch_id`,
        [
          courseId,
          batchName,
          contributorId,
          registrationStart,
          registrationEnd,
          startDate,
          endDate,
          batchStatus,
        ]
      )

      const { course_batch_id } = rows[0]

      for (const session of batchSession) {
        await client.query(
          `INSERT INTO course_sessions (
            course_session_batch_id, course_session_topic, 
            course_session_date, course_session_start_time, 
            course_session_end_time)
          VALUES ($1, $2, $3, $4, $5)`,
          [
            course_batch_id,
            session.topic,
            session.sessionDate,
            session.sessionStartTime,
            session.sessionEndTime,
          ]
        )
      }

      await client.query(
        `INSERT INTO course_prices (
          course_price_course_batch_id, base_price, 
          discount_type, discount_value, final_price)
        VALUES ($1, $2, $3, $4, $5)`,
        [
          course_batch_id,
          batchPrice.basePrice,
          batchPrice.discountType,
          batchPrice.discountValue,
          batchPrice.finalPrice,
        ]
      )
      return course_batch_id
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  static async verfifyCourseBatchisExist(batchId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT 1 FROM course_batches WHERE course_batch_id = $1`,
        [batchId]
      )
    } catch {
      throw new BadRequest('Invalid batch_id format')
    }
    if (result.rows.length === 0) {
      throw new ResourceNotFoundError('Resource course not found')
    }
  }

  static async addPosterUrlIntoBatch(posterUrl: string, batchId: string) {
    await supabasePool.query(
      `UPDATE course_batches SET course_batch_poster_url = $1 WHERE course_batch_id = $2`,
      [posterUrl, batchId]
    )
  }
}
