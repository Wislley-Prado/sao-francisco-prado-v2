import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('site_settings').select('*').limit(1);
  console.log("Site Settings:");
  console.log(data);
  
  const { data: ranchos } = await supabase.from('ranchos').select('images').limit(1);
  console.log("Ranchos:");
  console.log(ranchos);
}
check();
