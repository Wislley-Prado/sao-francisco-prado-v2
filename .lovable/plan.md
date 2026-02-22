

# Limpeza: Remover Codigo Antigo do Calendario Lunar

## O que ja foi limpo

O `useLunarData.ts` e o `lunarEphemeris.ts` estao corretos e limpos. Nao ha mais referencia a FarmSense, calculo por referencia unica, ou datas hardcoded no frontend.

## O que ainda precisa ser removido

### Edge Function `lunar-proxy` (codigo morto)

O arquivo `supabase/functions/lunar-proxy/index.ts` ainda existe e contem:
- Chamada a API FarmSense (que sempre falha com erro DNS)
- Calculo de fallback por referencia unica (metodo antigo)
- Nenhum codigo do frontend chama mais essa funcao

### Acao

| Arquivo | Acao |
|---------|------|
| `supabase/functions/lunar-proxy/index.ts` | DELETAR - nao e mais usado |

Apos deletar o arquivo, o edge function deployado tambem sera removido do Supabase.

## Resultado

- Menos codigo para manter
- Sem edge function desnecessario consumindo recursos
- Todo o calculo lunar e feito 100% no client com a tabela de efemerides

