import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: users, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Users in Auth:", JSON.stringify(users.users.map(u => ({ id: u.id, email: u.email })), null, 2))
  }
}

test()
