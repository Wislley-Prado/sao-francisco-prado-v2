-- Agendar cron job para atualizar dados da represa 4x ao dia (06h, 12h, 18h, 00h BRT = 09h, 15h, 21h, 03h UTC)
SELECT cron.schedule(
  'atualizar-dados-represa',
  '0 9,15,21,3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://zeqloqlhnbdeivnyghkx.supabase.co/functions/v1/dam-data-proxy',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplcWxvcWxobmJkZWl2bnlnaGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNTAxNjcsImV4cCI6MjA3MzcyNjE2N30.j96GObK0f5AUgc5O38n6gum3OU4u_5OFyxRaLj76GwY"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);