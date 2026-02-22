

# Formulario Manual de Dados da Represa no Admin

## Problema
O site da CEMIG mudou e o webhook automatizado (n8n) ainda nao foi atualizado. Voce precisa de uma forma de inserir manualmente os dados da represa (nivel, volume, afluencia, defluencia) pelo painel admin ate que a automacao seja corrigida.

## Solucao
Adicionar um formulario de entrada manual na pagina de Configuracoes do admin, logo abaixo da secao existente "Dados da Represa no Banco". O webhook continua configurado e funcionando quando voce arrumar a automacao.

## O que sera adicionado

Um formulario com os seguintes campos:
- **Nivel Atual** (ex: 570,02)
- **Volume Util %** (ex: 83,37)
- **Afluencia m3/s** (ex: 1121,93)
- **Defluencia m3/s** (ex: 246,37)
- **Data da Leitura** (ex: 22/02/2026)

Ao clicar em "Salvar Dados Manuais", os dados serao gravados diretamente na tabela `dam_data` no mesmo formato que o webhook usa, mantendo compatibilidade total.

## Detalhes Tecnicos

### Arquivo: `src/pages/admin/Configuracoes.tsx`

Adicionar dentro da secao "Integracoes Externas", apos o botao "Atualizar Agora":

1. Novo estado para os campos do formulario manual
2. Formulario com inputs para nivel, volume, afluencia e defluencia
3. Funcao `handleManualDamData` que:
   - Monta o array no formato `NewApiResponseItem` (tipo `tempo_real`)
   - Faz upsert na tabela `dam_data` com id=1
   - Exibe toast de sucesso/erro
4. Alerta informando que dados manuais serao substituidos quando o webhook voltar a funcionar

### Formato dos dados salvos
Os dados manuais serao salvos no mesmo formato JSON que o webhook usa:
```text
[{
  tipo: "tempo_real",
  data_leitura: "22/02/2026",
  afluencia: "1121,93",
  nivel_inicial: "570,02",
  volume_inicial: "83,37",
  defluencia: "246,37",
  nivel_atual: "570,02",
  volume_percentual: "83,37"
}]
```

Isso garante que o `useDamData.ts` processe os dados manuais exatamente como processaria dados do webhook, sem nenhuma alteracao no frontend publico.

### Nenhum outro arquivo precisa ser alterado
- O hook `useDamData.ts` ja le da tabela `dam_data` e processa o formato
- A edge function `dam-data-proxy` continua funcionando normalmente
- Quando o webhook for corrigido, os dados automaticos simplesmente substituem os manuais

