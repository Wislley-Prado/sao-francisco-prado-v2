import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('pacotes').select('images').limit(1);
  console.log("Error:");
  console.log(error);
  console.log("Pacotes:");
  console.log(data);
}
check();
