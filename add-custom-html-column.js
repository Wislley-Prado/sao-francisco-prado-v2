import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("Adding custom_html column to anuncios table...")
  const { error } = await supabase.rpc('execute_sql', {
    sql_query: "ALTER TABLE public.anuncios ADD COLUMN IF NOT EXISTS custom_html TEXT; COMMENT ON COLUMN public.anuncios.custom_html IS 'Código HTML/Script customizado para o anúncio (Ex: Google AdSense)';"
  })
  
  if (error) {
    if (error.message.includes('not found')) {
        console.log("RPC 'execute_sql' not found. Trying via direct query if possible (likely not via JS client).")
        console.log("Please run the migration 20260310000001_add_custom_html_to_anuncios.sql in Supabase Dashboard.")
    } else {
        console.error("Error:", error)
    }
  } else {
    console.log("Column added successfully or already exists.")
  }
}

test()
