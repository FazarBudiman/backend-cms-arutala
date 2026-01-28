import { supabasePool } from '../../../supabase/supabasePool'

export class CourseBenefitService {
  static async getAllCourseBenefit() {
    const { rows } = await supabasePool.query(
      `SELECT course_benefit_id as id, course_benefit_title as title, course_benefit_description as description
      FROM course_benefits`
    )
    return rows
  }
}
