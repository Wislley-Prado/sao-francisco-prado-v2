import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('id, favicon_url, pwa_icon_url, og_image_url')
    .limit(1)
    .single();
    
  if (error) {
    console.error("Error reading table:", error)
  } else {
    console.log("Table data:", data)
  }
}

test()
