import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

// Try to use service role key to bypass RLS, or the publishable key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: anuncios } = await supabase.from('anuncios').select('*').limit(2);
  if (!anuncios || anuncios.length === 0) {
    console.log("Nenhum anuncio");
    return;
  }
  const id = anuncios[0].id;
  const oldTipo = anuncios[0].tipo;
  console.log("Tentando atualizar ID:", id, "de", oldTipo, "para 'card_secundario'");

  const { error, data } = await supabase
    .from('anuncios')
    .update({ tipo: 'card_secundario' })
    .eq('id', id)
    .select();
  
  if (error) {
    console.log("ERRO DE UPDATE:", error);
  } else {
    console.log("UPDATE COM SUCESSO. Novo tipo:", data[0].tipo);
    // Reverter para evitar quebrar o deles
    await supabase.from('anuncios').update({ tipo: oldTipo }).eq('id', id);
  }
}

run();
