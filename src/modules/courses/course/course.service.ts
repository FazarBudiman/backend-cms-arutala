import {
  BadRequest,
  ResourceNotFoundError,
} from '../../../exceptions/client.error'
import { supabasePool } from '../../../supabase/supabasePool'
// import { CourseCreateProps } from './course.model'

export class CourseService {
  // static async addCourse(
  //   payload: CourseCreateProps,
  //   coursePosterUrl: string,
  //   userWhocreated: string
  // ) {
  //   const {
  //     courseTitle,
  //     courseDescription,
  //     courseCategoryId,
  //     courseFieldId,
  //     courseInstructorId,
  //     coursePrice,
  //   } = payload

  //   const { rows } = await supabasePool.query(
  //     `INSERT INTO courses (course_title, course_description, course_category_id, course_field_id, course_instructor_id, course_status, course_poster_url, course_price, created_by)
  //           VALUES ($1, $2, $3, $4, $5, 'DRAFT' , $6, $7, $8) RETURNING course_id`,
  //     [
  //       courseTitle,
  //       courseDescription,
  //       courseCategoryId,
  //       courseFieldId,
  //       courseInstructorId,
  //       coursePosterUrl,
  //       coursePrice,
  //       userWhocreated,
  //     ]
  //   )
  //   return rows[0]
  // }

  static async verifyCourseisExist(courseId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT course_id FROM courses WHERE course_id = $1`,
        [courseId]
      )
    } catch {
      throw new BadRequest('Invalid course_id format')
    }
    if (result.rows.length < 1) {
      throw new ResourceNotFoundError('Resource course not found')
    }
  }

  static async getCourseById(courseId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT c.course_id, c.course_title, c.course_description, cc.course_category_name, cf.course_field_name
            FROM courses c
            JOIN course_categories cc ON c.category_id = cc.course_category_id
            JOIN course_fields cf ON c.field_id = cf.course_field_id
            WHERE  c.course_id = $1 AND c.is_deleted = false`,
        [courseId]
      )
    } catch (err) {
      console.log(err)
      throw new BadRequest('Invalid course_id format')
    }
    if (result.rows.length < 1) {
      throw new ResourceNotFoundError('Resource course not found')
    }
    return result.rows[0]
  }
}
