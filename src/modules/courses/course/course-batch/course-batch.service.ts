import { PoolClient } from 'pg'
import {
  BadRequest,
  ResourceNotFoundError,
} from '../../../../exceptions/client.error'
import { supabasePool } from '../../../../supabase/supabasePool'
import {
  CourseBatchCreateProps,
  CourseBatchPriceProps,
  CourseBatchSessionProp,
  CourseBatchUpdateProps,
} from './course-batch.model'

export class CourseBatchService {
  static async addCourseBatch(
    payload: CourseBatchCreateProps,
    courseId: string,
    userWhocreated: string
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
          course_batch_end_date, course_batch_status, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING course_batch_id`,
        [
          courseId,
          batchName,
          contributorId,
          registrationStart,
          registrationEnd,
          startDate,
          endDate,
          batchStatus,
          userWhocreated,
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

  static async addPosterUrlIntoBatch(
    posterUrl: string,
    batchId: string,
    userWhoUpdated: string
  ) {
    await supabasePool.query(
      `UPDATE course_batches SET course_batch_poster_url = $1, updated_by = $2, updated_date = NOW() WHERE course_batch_id = $3`,
      [posterUrl, userWhoUpdated, batchId]
    )
  }

  static async updateCourseBatchMain(
    client: PoolClient,
    payload: CourseBatchUpdateProps,
    batchId: string,
    userWhoUpdated: string
  ) {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1
    const {
      batchName,
      contributorId,
      registrationStart,
      registrationEnd,
      startDate,
      endDate,
      batchStatus,
    } = payload

    if (batchName) {
      fields.push(`course_batch_name = $${idx++}`)
      values.push(batchName)
    }
    if (contributorId) {
      fields.push(`course_batch_contributor_id = $${idx++}`)
      values.push(contributorId)
    }
    if (registrationStart) {
      fields.push(`course_batch_registration_start = $${idx++}`)
      values.push(registrationStart)
    }
    if (registrationEnd) {
      fields.push(`course_batch_registration_end = $${idx++}`)
      values.push(registrationEnd)
    }
    if (startDate) {
      fields.push(`course_batch_start_date = $${idx++}`)
      values.push(startDate)
    }
    if (endDate) {
      fields.push(`course_batch_end_date = $${idx++}`)
      values.push(endDate)
    }
    if (batchStatus) {
      fields.push(`course_batch_status = $${idx++}`)
      values.push(batchStatus)
    }

    fields.push(`updated_by = $${idx++}`)
    values.push(userWhoUpdated)

    fields.push(`updated_date = NOW()`)

    values.push(batchId)

    const { rows } = await supabasePool.query(
      `UPDATE course_batches SET ${fields.join(', ')}
        WHERE course_batch_id = $${idx} RETURNING course_batch_name`,
      values
    )

    return rows[0]
  }

  static async replaceCourseBatchSession(
    client: PoolClient,
    batchId: string,
    sessions: CourseBatchSessionProp
  ) {
    await client.query(
      `DELETE FROM course_sessions WHERE course_session_batch_id = $1`,
      [batchId]
    )

    for (const s of sessions) {
      await client.query(
        `INSERT INTO course_sessions (
            course_session_batch_id, course_session_topic, 
            course_session_date, course_session_start_time, 
            course_session_end_time)
          VALUES ($1, $2, $3, $4, $5)`,
        [batchId, s.topic, s.sessionDate, s.sessionStartTime, s.sessionEndTime]
      )
    }
  }

  static async updateCourseBatchPrice(
    client: PoolClient,
    batchId: string,
    prices: CourseBatchPriceProps
  ) {
    await client.query(
      `UPDATE course_prices SET 
        base_price = $1, discount_type = $2, 
        discount_value = $3, final_price = $4
      WHERE course_price_course_batch_id = $5`,
      [
        prices.basePrice,
        prices.discountType,
        prices.discountValue,
        prices.finalPrice,
        batchId,
      ]
    )
  }

  static async updateCourseBatch(
    payload: CourseBatchUpdateProps,
    batchId: string,
    userWhoUpdated: string
  ) {
    const client = await supabasePool.connect()

    try {
      await client.query('BEGIN')

      const { course_batch_name } =
        await CourseBatchService.updateCourseBatchMain(
          client,
          payload,
          batchId,
          userWhoUpdated
        )

      if (payload.batchSession) {
        await CourseBatchService.replaceCourseBatchSession(
          client,
          batchId,
          payload.batchSession
        )
      }

      if (payload.batchPrice) {
        await CourseBatchService.updateCourseBatchPrice(
          client,
          batchId,
          payload.batchPrice
        )
      }

      await client.query('COMMIT')
      return course_batch_name
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  static async deleteCourseBatch(batchId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE course_batches SET is_deleted = TRUE
        WHERE course_batch_id = $1 
        RETURNING course_batch_name`,
      [batchId]
    )

    return rows[0]
  }
}
