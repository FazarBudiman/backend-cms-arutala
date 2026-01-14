import { Pool } from 'pg'
const { SUPABASE_DB_URL } = process.env
export const pool: Pool = new Pool({
  connectionString: SUPABASE_DB_URL!,
})
