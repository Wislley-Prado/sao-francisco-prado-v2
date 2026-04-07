import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: roles, error } = await supabase.from('user_roles').select('*')
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Roles in DB:", JSON.stringify(roles, null, 2))
  }
}

test()
