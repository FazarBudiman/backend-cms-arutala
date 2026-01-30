import { supabasePool } from '../supabase/supabasePool'

export async function generateUniquePageSlug(
  raw: string,
  prefix?: string
): Promise<string> {
  const base = slugify(raw)
  const fullBase = prefix ? `${slugify(prefix)}/${base}` : base

  let slug = fullBase
  let counter = 1

  while (await isSlugExists(slug)) {
    slug = `${fullBase}-${counter++}`
  }

  return slug
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s/-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/\/+/g, '/')
}

async function isSlugExists(slug: string): Promise<boolean> {
  const { rows } = await supabasePool.query(
    `SELECT 1 FROM pages WHERE page_slug = $1 LIMIT 1`,
    [slug]
  )
  return rows.length > 0
}
