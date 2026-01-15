import { Pool } from 'pg'
const { SUPABASE_DB_URL } = process.env

export const supabasePool: Pool = new Pool({
  connectionString: SUPABASE_DB_URL!,
})
