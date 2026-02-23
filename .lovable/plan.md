

# Botao Pausar/Retomar Webhook da Represa

## Problema
O cron job roda 4x ao dia e chama o webhook. Como o site da CEMIG mudou, o webhook retorna dados vazios ou errados, sobrescrevendo os dados manuais que voce inseriu.

## Solucao
Adicionar um campo `dam_webhook_pausado` na tabela `site_settings` e um botao de Pausar/Retomar no admin. Quando pausado, a edge function `dam-data-proxy` verifica esse campo e retorna sem fazer nada, preservando os dados manuais.

## Como vai funcionar

1. Voce insere os dados manuais pelo formulario que ja existe
2. Clica em **"Pausar Webhook"** - o botao fica vermelho mostrando que esta pausado
3. O cron continua rodando nos horarios normais, mas a edge function ve que esta pausado e nao faz nada
4. Seus dados manuais ficam preservados
5. Quando arrumar a automacao, clica em **"Retomar Webhook"** e tudo volta ao normal

## O que sera alterado

| Arquivo | O que muda |
|---------|-----------|
| Migracao SQL | Adiciona coluna `dam_webhook_pausado` na tabela `site_settings` |
| `supabase/functions/dam-data-proxy/index.ts` | Verifica se webhook esta pausado antes de chamar |
| `src/pages/admin/Configuracoes.tsx` | Botao Pausar/Retomar com estado visual claro |

## Detalhes Tecnicos

### 1. Migracao SQL
Adicionar coluna `dam_webhook_pausado` (boolean, default false) na tabela `site_settings`.

### 2. Edge Function `dam-data-proxy`
No inicio da funcao, apos criar o cliente Supabase, buscar `dam_webhook_pausado` do `site_settings`. Se estiver `true`, retornar imediatamente com status 200 e mensagem `{"pausado": true, "message": "Webhook pausado pelo admin"}` sem chamar o webhook nem sobrescrever dados.

### 3. Configuracoes.tsx
- Novo estado `webhookPausado` (boolean)
- Carregar o valor do banco ao abrir a pagina
- Botao toggle que alterna entre "Pausar Webhook" (verde) e "Retomar Webhook" (vermelho quando pausado)
- Alerta visual claro quando pausado: "Webhook PAUSADO - dados manuais estao protegidos"
- Ao clicar, faz update no `site_settings` e exibe toast de confirmacao

