import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

const envConfig = dotenv.parse(fs.readFileSync('.env'))
for (const k in envConfig) process.env[k] = envConfig[k]

async function test() {
  const res = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/?apikey=${process.env.SUPABASE_SERVICE_ROLE_KEY}`)
  const data = await res.json()
  const rpcs = Object.keys(data.paths).filter(p => p.startsWith('/rpc/'))
  console.log("RPCs available:", rpcs)
}

test()
