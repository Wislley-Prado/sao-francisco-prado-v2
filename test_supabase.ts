import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Sem chaves nas env vars.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Erro:', error);
  } else {
    console.log('Colunas existentes:', Object.keys(data[0] || {}));
  }
}

check();
