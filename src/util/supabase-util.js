import { createClient } from '@supabase/supabase-js'

const supabaseUrl = env_vars.env.SUPABASE_URL
const SUPABASE_KEY = env_vars.env.SUPABASE_KEY
export default createClient(supabaseUrl, SUPABASE_KEY)