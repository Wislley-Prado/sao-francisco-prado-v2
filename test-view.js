import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data, error } = await supabase
    .from('site_settings_public')
    .select('favicon_url, pwa_icon_url, og_image_url')
    .limit(1)
    .single();
    
  if (error) {
    console.error("Error reading view:", error)
  } else {
    console.log("View data:", data)
  }
}

test()
