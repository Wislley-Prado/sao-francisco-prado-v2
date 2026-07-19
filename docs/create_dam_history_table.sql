-- Script SQL para criar a tabela dam_history no Supabase
-- Executar no SQL Editor do Supabase Dashboard (https://supabase.com/dashboard)

CREATE TABLE IF NOT EXISTS public.dam_history (
  data_leitura DATE PRIMARY KEY,
  nivel_cota NUMERIC(6, 2) NOT NULL,
  volume_percentual NUMERIC(5, 2) NOT NULL,
  afluencia INTEGER NOT NULL,
  defluencia INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (Row Level Security)
ALTER TABLE public.dam_history ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
DROP POLICY IF EXISTS "Leitura publica de dam_history" ON public.dam_history;
CREATE POLICY "Leitura publica de dam_history" ON public.dam_history
  FOR SELECT USING (true);

-- Permitir escrita via Service Role (Edge Function/Admin)
DROP POLICY IF EXISTS "Escrita publica/service_role de dam_history" ON public.dam_history;
CREATE POLICY "Escrita publica/service_role de dam_history" ON public.dam_history
  FOR ALL USING (true);

-- Povoar com histórico inicial dos últimos 9 dias (11/07 a 19/07/2026)
INSERT INTO public.dam_history (data_leitura, nivel_cota, volume_percentual, afluencia, defluencia)
VALUES 
  ('2026-07-11', 571.71, 94.50, 101, 364),
  ('2026-07-12', 571.69, 94.40, 90, 413),
  ('2026-07-13', 571.67, 94.30, 190, 534),
  ('2026-07-14', 571.64, 94.00, 233, 546),
  ('2026-07-15', 571.62, 93.90, 178, 340),
  ('2026-07-16', 571.61, 93.80, 181, 384),
  ('2026-07-17', 571.59, 93.70, 207, 342),
  ('2026-07-18', 571.58, 93.60, 222, 691),
  ('2026-07-19', 571.60, 93.60, 138, 164)
ON CONFLICT (data_leitura) DO UPDATE SET
  nivel_cota = EXCLUDED.nivel_cota,
  volume_percentual = EXCLUDED.volume_percentual,
  afluencia = EXCLUDED.afluencia,
  defluencia = EXCLUDED.defluencia,
  updated_at = timezone('utc'::text, now());
