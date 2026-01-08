import { createClient } from "@supabase/supabase-js"
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
let client = null
export function getSupabaseClient() {
  if (typeof window === "undefined") return null
  if (client) return client
  if (!url || !key) return null
  client = createClient(url, key)
  return client
}
