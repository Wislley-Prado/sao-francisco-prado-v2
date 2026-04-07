import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: ranchos, error: rError } = await supabase
    .from('ranchos')
    .select('nome, tracking_code')
    .not('tracking_code', 'is', null)
  
  const { data: pacotes, error: pError } = await supabase
    .from('pacotes')
    .select('nome, tracking_code')
    .not('tracking_code', 'is', null)

  console.log("Ranchos with tracking:", JSON.stringify(ranchos, null, 2))
  console.log("Pacotes with tracking:", JSON.stringify(pacotes, null, 2))
}

test()
