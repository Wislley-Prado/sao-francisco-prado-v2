import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: roles, error } = await supabase.from('user_roles').select('*')
  
  if (error) {
    console.error("Error reading user_roles:", error)
    return
  }
  console.log("User roles:", roles)

  const { data: users, error: userError } = await supabase.auth.admin.listUsers()
  if (userError) {
    console.error("Error listing users:", userError)
  } else {
    console.log("Users count:", users.users.length)
  }
}

test()
