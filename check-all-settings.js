import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single()
  
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Full Site Settings:", JSON.stringify(data, null, 2))
  }
}

test()
