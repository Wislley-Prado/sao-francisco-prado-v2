import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

const envConfig = dotenv.parse(fs.readFileSync('.env'))
for (const k in envConfig) process.env[k] = envConfig[k]

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("Adding typebot_url column to ranchos table...")
  const { error } = await supabase.rpc('exec_sql', {
    sql: "ALTER TABLE public.ranchos ADD COLUMN IF NOT EXISTS typebot_url TEXT;"
  })
  
  if (error) {
    console.log("Failed with exec_sql. Trying execute_sql...")
    const { error: err2 } = await supabase.rpc('execute_sql', {
      sql_query: "ALTER TABLE public.ranchos ADD COLUMN IF NOT EXISTS typebot_url TEXT;"
    })
    if (err2) {
       console.error("Error with execute_sql:", err2)
    } else {
       console.log("Success with execute_sql!")
    }
  } else {
    console.log("Success with exec_sql!")
  }
}

test()
