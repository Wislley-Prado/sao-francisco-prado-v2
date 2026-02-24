

# Tornar os 3 Icones do Hero Clicaveis

## Problema
Os tres icones no HeroSection (Transmissao Ao Vivo, Calendario Lunar, Dados em Tempo Real) sao apenas elementos visuais estaticos — nao tem `onClick` nem link. O usuario espera que sejam interativos.

## Solucao

Transformar cada icone em um botao clicavel com destino logico:

| Icone | Acao |
|-------|------|
| Transmissao Ao Vivo | `navigate('/live')` |
| Calendario Lunar | Scroll suave ate a secao `#calendario-lunar` na homepage |
| Dados em Tempo Real | Scroll suave ate a secao `#dados-represa` na homepage |

## Mudancas

### `src/components/HeroSection.tsx`
- Envolver cada icone em um `<button>` ou aplicar `onClick` + `cursor-pointer` nos divs existentes
- Para "Transmissao Ao Vivo": usar `navigate('/live')`
- Para "Calendario Lunar" e "Dados em Tempo Real": usar `document.getElementById('id')?.scrollIntoView({ behavior: 'smooth' })`
- Adicionar efeito hover visual (scale ou brightness) para indicar que sao clicaveis

### Verificacao de IDs das secoes
Confirmar que os componentes `LunarCalendar` e `DamInfo` possuem os IDs corretos para o scroll funcionar. Se nao tiverem, adicionar `id="calendario-lunar"` e `id="dados-represa"` nos wrappers dessas secoes.

## Detalhes Tecnicos
- Nenhuma dependencia nova
- Apenas 1-2 arquivos alterados
- Os IDs das secoes-alvo precisam existir nos componentes `LunarCalendar` e `DamInfo` (ou no `Index.tsx` envolvendo-os)

