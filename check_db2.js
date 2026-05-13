import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: posts } = await supabase.from('blog_posts').select('image_url').limit(1);
  console.log("Posts:");
  console.log(posts);
  const { data: pacotes } = await supabase.from('pacotes').select('images').limit(1);
  console.log("Pacotes:");
  console.log(pacotes);
}
check();
