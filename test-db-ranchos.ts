import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env'));
const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_PUBLISHABLE_KEY);

async function run() {
  const { data, error } = await supabase
        .from('ranchos')
        .select(`
          id,
          nome,
          rancho_imagens!rancho_imagens_rancho_id_fkey(*)
        `)
        .limit(1);
  console.log(JSON.stringify(data, null, 2));
}
run();
