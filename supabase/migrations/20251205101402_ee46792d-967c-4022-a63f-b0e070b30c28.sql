-- Corrigir URL do Google Calendar corrompida no Rancho Prado Aldeia
UPDATE ranchos 
SET google_calendar_url = 'https://calendar.google.com/calendar/embed?src=b841d47901497185497c16d986fa8c480bad363b8c96d9443736b1b7c18e2297%40group.calendar.google.com&ctz=America%2FSao_Paulo'
WHERE id = '2e6136fb-0d4e-4602-a358-28e23309e6ca';