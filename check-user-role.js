import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const result = {}
  const { data: roles, error: rolesError } = await supabase.from('user_roles').select('*')
  result.roles = roles
  result.rolesError = rolesError

  const { data: users, error: userError } = await supabase.auth.admin.listUsers()
  result.users = users?.users?.map(u => ({ id: u.id, email: u.email }))
  result.userError = userError

  fs.writeFileSync('roles_debug.json', JSON.stringify(result, null, 2))
}

test()
