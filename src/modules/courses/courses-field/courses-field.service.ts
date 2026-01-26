import { supabasePool } from '../../../supabase/supabasePool'

export class CourseFieldService {
  static async getAllCourseField() {
    const { rows } = await supabasePool.query(
      `SELECT course_field_id AS id, course_field_name AS field FROM course_fields`
    )
    return rows
  }
}
