import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.from('site_settings').select('*').limit(1)
  
  if (error) {
    console.error("Error reading site_settings:", error)
  } else {
    console.log("site_settings keys:", data.length > 0 ? Object.keys(data[0]) : "empty table")
    console.log("ID:", data.length > 0 ? data[0].id : "no record")
  }
}

test()
