import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: anuncios, error } = await supabase
    .from('anuncios')
    .select('id, titulo, posicao, ativo, tipo')
  
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Anuncios in DB:", JSON.stringify(anuncios, null, 2))
  }
}

test()
