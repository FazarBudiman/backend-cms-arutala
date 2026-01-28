import { PoolClient } from 'pg'
import {
  BadRequest,
  ResourceNotFoundError,
} from '../../../exceptions/client.error'
import { supabasePool } from '../../../supabase/supabasePool'
import {
  CourseBenefitsUpdateProps,
  CourseMaterialsUpdateProps,
  CourseUpdateProps,
  QueryParamsCourseProps,
} from './course.model'
import { CourseCreateProps } from './course.model'

export class CourseService {
  static async addCourse(payload: CourseCreateProps, userWhocreated: string) {
    const client = await supabasePool.connect()
    const {
      courseTitle,
      courseDescription,
      courseCategoryId,
      courseFieldId,
      courseBenefits,
      courseMaterials,
    } = payload
    try {
      await client.query('BEGIN')

      const { rows } = await client.query(
        `INSERT INTO courses(course_title, course_description, category_id, field_id, created_by)
          VALUES ($1, $2, $3, $4, $5) RETURNING course_id`,
        [
          courseTitle,
          courseDescription,
          courseCategoryId,
          courseFieldId,
          userWhocreated,
        ]
      )

      const { course_id } = rows[0]

      for (const benefit of courseBenefits) {
        await client.query(
          `INSERT INTO courses_course_benefits (ccb_course_id, ccb_benefit_id, ccb_order_num)
            VALUES ($1, $2, $3)`,
          [course_id, benefit.courseBenefitId, benefit.orderNum]
        )
      }

      for (const material of courseMaterials) {
        await client.query(
          `INSERT INTO course_materials (course_material_course_id, course_material_title, course_material_description, course_material_order_num)
            VALUES ($1, $2, $3, $4)`,
          [course_id, material.title, material.description, material.orderNum]
        )
      }

      await client.query('COMMIT')
      return course_id
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  static async verifyCourseisExist(courseId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT 1 FROM courses WHERE course_id = $1 AND is_deleted = false`,
        [courseId]
      )
    } catch {
      throw new BadRequest('Invalid course_id format')
    }
    if (result.rows.length === 0) {
      throw new ResourceNotFoundError('Resource course not found')
    }
  }

  static async getAllCourses(query: QueryParamsCourseProps) {
    const values: any[] = []
    const conditions: string[] = []

    if (query.field) {
      values.push(query.field)
      conditions.push(
        `lower(cf.course_field_name) LIKE lower($${values.length})`
      )
    }

    if (query.available !== undefined) {
      values.push(query.available)
      conditions.push(`
      EXISTS (
        SELECT 1
        FROM course_batches cb
        WHERE cb.course_batch_course_id = c.course_id
          AND cb.course_batch_registration_start <= NOW()
          AND cb.course_batch_registration_end >= NOW()
      ) = $${values.length}
    `)
    }

    const whereClause = conditions.length
      ? `AND ${conditions.join(' AND ')}`
      : ''

    const { rows } = await supabasePool.query(
      `
      SELECT
        c.course_id,
        c.course_title,
        c.course_description,
        cc.course_category_name,
        cf.course_field_name,

      COALESCE(
        (
          SELECT json_build_object(
            'name', cb.course_batch_name,
            'status', cb.course_batch_status,
            'posterUrl', cb.course_batch_poster_url,
            'registration_start', cb.course_batch_registration_start,
            'registration_end', cb.course_batch_registration_end,
            'start_date', cb.course_batch_start_date,
            'end_date', cb.course_batch_end_date,

            'instructor', json_build_object(
              'name', ctr.contributor_name,
              'jobTitle', ctr.contributor_job_title,
              'companyName', ctr.contributor_company_name,
              'profileUrl', ctr.contributor_profile_url
            ),

            'prices', json_build_object(
              'basePrice', cp.base_price,
              'discountType', cp.discount_type,
              'discountValue', cp.discount_value,
              'finalPrice', cp.final_price
            )
          )
            
            FROM course_batches cb
            LEFT JOIN contributors ctr
              ON cb.course_batch_contributor_id = ctr.contributor_id
            LEFT JOIN course_prices cp
              ON cb.course_batch_id = cp.course_price_course_batch_id
            WHERE cb.course_batch_course_id = c.course_id
            ORDER BY cb.course_batch_start_date DESC
            LIMIT 1
        ),'{}'::json
      ) AS course_batch

      FROM courses c
      JOIN course_categories cc ON c.category_id = cc.course_category_id
      JOIN course_fields cf ON c.field_id = cf.course_field_id
      WHERE c.is_deleted = false 
      ${whereClause}
      ORDER BY c.created_date DESC
      `,
      values
    )

    return rows
  }

  static async getUpcomingCourse() {
    const { rows } = await supabasePool.query(
      `
      WITH nearest_open_batch AS (
        SELECT DISTINCT ON (cb.course_batch_course_id)
          cb.course_batch_course_id,
          cb.course_batch_id
        FROM course_batches cb
        WHERE cb.course_batch_status = 'OPEN'
        AND CURRENT_DATE BETWEEN cb.course_batch_registration_start AND cb.course_batch_registration_end
        ORDER BY cb.course_batch_course_id, cb.course_batch_start_date ASC
      )

      SELECT DISTINCT ON (cc.course_category_id)
        c.course_id,
        c.course_title,
        c.course_description,
        cc.course_category_name,

        json_build_object(
          'name', cb.course_batch_name,
          'posterUrl', cb.course_batch_poster_url,
          'start_date', cb.course_batch_start_date,
          'registration_end', cb.course_batch_registration_end
        ) AS nearest_batch

      FROM nearest_open_batch nob
      JOIN courses c
        ON nob.course_batch_course_id = c.course_id
      JOIN course_categories cc
        ON c.category_id = cc.course_category_id
      JOIN course_batches cb
        ON nob.course_batch_id = cb.course_batch_id
      WHERE c.is_deleted = false
      ORDER BY cc.course_category_id, cb.course_batch_start_date ASC;
      `
    )
    return rows
  }

  static async getDetailCourseById(courseId: string) {
    const { rows } = await supabasePool.query(
      `SELECT
        c.course_id,
        c.course_title,
        c.course_description,
        cc.course_category_name,
        cf.course_field_name,

        /* ===== COURSE MATERIALS ===== */
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'title', cm.course_material_title,
                        'description', cm.course_material_description
                    )
                    ORDER BY cm.course_material_order_num
                )
                FROM course_materials cm
                WHERE cm.course_material_course_id = c.course_id
            ),
            '[]'::json
        ) AS course_material,

        /* ===== COURSE BENEFITS ===== */
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'title', cb.course_benefit_title,
                        'description', cb.course_benefit_description
                    )
                    ORDER BY ccb.ccb_order_num
                )
                FROM courses_course_benefits ccb
                JOIN course_benefits cb
                  ON cb.course_benefit_id = ccb.ccb_benefit_id
                WHERE ccb.ccb_course_id = c.course_id
            ),
            '[]'::json
        ) AS course_benefit,

        /* ===== COURSE BATCHES ===== */
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'name', cb.course_batch_name,
                        'posterUrl', cb.course_batch_poster_url,
                        'registration_start', cb.course_batch_registration_start,
                        'registration_end', cb.course_batch_registration_end,
                        'start_date', cb.course_batch_start_date,
                        'end_date', cb.course_batch_end_date,

                        'instructor', json_build_object(
                            'name', ctr.contributor_name,
                            'jobTitle', ctr.contributor_job_title,
                            'companyName', ctr.contributor_company_name,
                            'profileUrl', ctr.contributor_profile_url
                        ),

                        'prices', json_build_object(
                            'basePrice', cp.base_price,
                            'discountType', cp.discount_type,
                            'discountValue', cp.discount_value,
                            'finalPrice', cp.final_price
                        ),

                        'sessions',
                            COALESCE(
                                (
                                    SELECT json_agg(
                                        json_build_object(
                                            'topic', cs.course_session_topic,
                                            'date', cs.course_session_date,
                                            'startTime', cs.course_session_start_time,
                                            'endTime', cs.course_session_end_time
                                        )
                                        ORDER BY cs.course_session_date
                                    )
                                    FROM course_sessions cs
                                    WHERE cs.course_session_batch_id = cb.course_batch_id
                                ),
                                '[]'::json
                            )
                    )
                )
                FROM course_batches cb
                LEFT JOIN contributors ctr
                  ON cb.course_batch_contributor_id = ctr.contributor_id
                LEFT JOIN course_prices cp
                  ON cb.course_batch_id = cp.course_price_course_batch_id
                WHERE cb.course_batch_course_id = c.course_id
            ),
            '[]'::json
        ) AS course_batch

    FROM courses c
    JOIN course_categories cc ON c.category_id = cc.course_category_id
    JOIN course_fields cf ON c.field_id = cf.course_field_id
    WHERE c.course_id = $1
      AND c.is_deleted = false;
    `,
      [courseId]
    )
    return rows
  }

  static async updateCourseMain(
    client: PoolClient,
    payload: CourseUpdateProps,
    courseId: string,
    userWhoUpdated: string
  ) {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (payload.courseTitle) {
      fields.push(`course_title = $${idx++}`)
      values.push(payload.courseTitle)
    }
    if (payload.courseDescription) {
      fields.push(`course_description = $${idx++}`)
      values.push(payload.courseDescription)
    }
    if (payload.courseCategoryId) {
      fields.push(`category_id = $${idx++}`)
      values.push(payload.courseCategoryId)
    }
    if (payload.courseFieldId) {
      fields.push(`field_id = $${idx++}`)
      values.push(payload.courseFieldId)
    }

    fields.push(`updated_by = $${idx++}`)
    values.push(userWhoUpdated)

    fields.push(`updated_date = NOW()`)

    values.push(courseId)

    const { rows } = await supabasePool.query(
      `UPDATE courses SET ${fields.join(', ')}
        WHERE course_id = $${idx} RETURNING course_title`,
      values
    )
    return rows[0]
  }

  static async replaceCourseBenefits(
    client: PoolClient,
    courseId: string,
    benefits: CourseBenefitsUpdateProps
  ) {
    await client.query(
      `DELETE FROM courses_course_benefits WHERE ccb_course_id = $1`,
      [courseId]
    )

    for (const b of benefits) {
      await client.query(
        `INSERT INTO courses_course_benefits(
          ccb_course_id, ccb_benefit_id, ccb_order_num)
        VALUES ($1, $2, $3)`,
        [courseId, b.courseBenefitId, b.orderNum]
      )
    }
  }

  static async replaceCourseMaterials(
    client: PoolClient,
    courseId: string,
    materials: CourseMaterialsUpdateProps
  ) {
    await client.query(
      `DELETE FROM course_materials WHERE course_material_course_id = $1`,
      [courseId]
    )

    for (const m of materials) {
      await client.query(
        `INSERT INTO course_materials (
          course_material_course_id, course_material_title, 
          course_material_description, course_material_order_num)
        VALUES ($1, $2, $3, $4)`,
        [courseId, m.title, m.description, m.orderNum]
      )
    }
  }

  static async updateCourse(
    payload: CourseUpdateProps,
    courseId: string,
    userWhoUpdated: string
  ) {
    const client = await supabasePool.connect()

    try {
      await client.query('BEGIN')

      const course_title = await CourseService.updateCourseMain(
        client,
        payload,
        courseId,
        userWhoUpdated
      )

      if (payload.courseBenefits) {
        await CourseService.replaceCourseBenefits(
          client,
          courseId,
          payload.courseBenefits
        )
      }

      if (payload.courseMaterials) {
        await this.replaceCourseMaterials(
          client,
          courseId,
          payload.courseMaterials
        )
      }

      await client.query('COMMIT')
      return { course_title }
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }

  static async deleteCourse(courseId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE courses SET is_deleted = TRUE WHERE course_id = $1 RETURNING course_title `,
      [courseId]
    )
    return rows[0]
  }
}
