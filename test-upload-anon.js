import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  // Let's see if we can read the public bucket first
  const { data: urlData } = supabase.storage.from('configuracoes').getPublicUrl('test.png')
  console.log("Public URL:", urlData.publicUrl)
}

test()
