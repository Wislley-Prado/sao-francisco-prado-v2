import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("Checking how many FAQS are global vs pacotes vs ranchos")
  
  const { data: qGlobal, error: eGlobal } = await supabase
    .from('faqs')
    .select('id, pergunta')
    .is('pacote_id', null)
    .is('rancho_id', null)

  const { data: qPacotes, error: ePacotes } = await supabase
    .from('faqs')
    .select('id, pergunta')
    .not('pacote_id', 'is', null)

  const { data: qRanchos, error: eRanchos } = await supabase
    .from('faqs')
    .select('id, pergunta')
    .not('rancho_id', 'is', null)

  console.log(`Global FAQs: ${qGlobal?.length || 0}`)
  console.log(`Pacote FAQs: ${qPacotes?.length || 0}`)
  console.log(`Rancho FAQs: ${qRanchos?.length || 0}`)
}

test()
