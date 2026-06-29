import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export type Creator = {
  username: string
  followers: number
  bio: string
  category: string
  engagement_rate: number
  contact_email: string
  external_url: string
  scraped_by: string
  reel_url: string
  caption: string
  hashtags: string[]
  status: string
  notes: string
}

export type Job = {
  id: string
  type: string
  status: string
  created_at: string
  created_by: string
  params: Record<string, unknown>
  result_count: number
  error: string
}

export type Agent = {
  label: string
  last_seen: string
  ig_account: string
}
