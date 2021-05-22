import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iupdirgjypmgamuxcneh.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDU3NTk3NywiZXhwIjoxOTM2MTUxOTc3fQ.GJvfqCz723_XySApQrVFoQxie-1kh9S6gQGnuKqtYRA'
export default createClient(supabaseUrl, SUPABASE_KEY)