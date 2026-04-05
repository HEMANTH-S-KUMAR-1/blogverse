import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase.from('job_listings').select('*').limit(1)
    if (error) return Response.json({ status: 'supabase_error', error: error.message, code: error.code })
    return Response.json({ status: 'ok', data })
  } catch (e) {
    return Response.json({ status: 'crash', error: e.message, stack: e.stack })
  }
}
