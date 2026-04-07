import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.storage.createBucket('configuracoes', {
    public: true,
    fileSizeLimit: 5242880, // 5MB limit
  })
    
  if (error) {
    if (error.message.includes('already exists')) {
      console.log("Bucket already exists.")
    } else {
      console.error("Error creating bucket:", error)
    }
  } else {
    console.log("Bucket created successfully:", data)
    
    // Also update if exists to ensure public
    await supabase.storage.updateBucket('configuracoes', {
      public: true,
      fileSizeLimit: 5242880,
    })
  }
}

test()
