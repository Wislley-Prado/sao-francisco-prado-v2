import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

const envConfig = dotenv.parse(fs.readFileSync('.env'))
for (const k in envConfig) process.env[k] = envConfig[k]

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function test() {
  const { data, error } = await supabase.from('ranchos').select('typebot_url').limit(1)
  
  if (error) {
    console.log("Error querying typebot_url:", error)
  } else {
    console.log("Success! Column exists.")
    console.log("Data:", data)
  }
}

test()
