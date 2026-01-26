import { supabasePool } from '../../../supabase/supabasePool'

export class CourseCategoryService {
  static async getAllCourseCategory() {
    const { rows } = await supabasePool.query(
      `SELECT course_category_id as id, course_category_name as name, 
        course_category_delivery as delivery_type, course_category_min_duration_hours as min_duration, course_category_max_duration_hours as max_duration 
        FROM course_categories`
    )
    return rows
  }
}
