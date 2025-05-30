// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jrcyixdgumqiqagponrc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyY3lpeGRndW1xaXFhZ3BvbnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzQwNjksImV4cCI6MjA2MTA1MDA2OX0.52MWKn_rMBJgVvlzXVyQQ9RPoLZW2cG92ha27UnVqRs'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

