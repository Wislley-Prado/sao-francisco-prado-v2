import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.storage.getBucket('configuracoes')
    
  if (error) {
    console.error("Error reading bucket:", error)
  } else {
    console.log("Bucket configuracoes:", data)
  }

  // Also try to read buckets
  const { data: buckets, error: bError } = await supabase.storage.listBuckets()
  if (bError) {
    console.error("Error listing buckets:", bError)
  } else {
    console.log("All buckets:", buckets.map(b => b.name))
  }
}

test()
