import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

const envConfig = dotenv.parse(fs.readFileSync('.env'))
for (const k in envConfig) process.env[k] = envConfig[k]

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function test() {
  console.log("Trying to update rancho...")
  const { data: rancho } = await supabase.from('ranchos').select('id, nome').limit(1).single()
  
  if (!rancho) return console.log("No rancho found")
  
  const { data, error } = await supabase.from('ranchos').update({ texto_botao_whatsapp: 'Teste Botão' }).eq('id', rancho.id).select()
  
  if (error) {
    console.error("Update failed:", error)
  } else {
    console.log("Update success!", data)
    // Revert
    await supabase.from('ranchos').update({ texto_botao_whatsapp: null }).eq('id', rancho.id)
  }
}

test()
