
## Plano: Limpar Interface dos Anúncios

### O que será removido

Vou remover da interface visível:

1. **Botão Play/Pause** (linhas 484-499)
2. **Contador de anúncios** "1 / 4" e "(8s)" (linhas 502-506)
3. **Barra de progresso** dentro dos pontos (linhas 471-479)
4. **Estado de progresso** - variável e interval não serão mais necessários

### O que será mantido

- Rotação automática dos anúncios
- Pontos de navegação (dots) - agora simples, sem barra de progresso
- Setas de navegação (prev/next)
- Pausa automática ao passar o mouse

### Arquivo a modificar

**`src/components/AnunciosSection.tsx`**

### Mudanças técnicas

1. **Remover imports não usados**: `Pause`, `Play`

2. **Remover estados de progresso**: 
   - `const [progress, setProgress] = useState(0)`
   - `progressIntervalRef`
   - Todo o código de `progressIntervalRef.current`

3. **Simplificar pontos de navegação**: Remover a barra de progresso animada dentro do ponto ativo, deixando apenas o indicador visual simples

4. **Remover elementos da UI**:
   - Bloco do botão Play/Pause (linhas 484-499)
   - Bloco do contador "1 / 4 (8s)" (linhas 502-506)

### Resultado esperado

Interface limpa com:
- Apenas pontos simples na parte inferior
- Setas de navegação nas laterais
- Rotação automática funcionando normalmente
- Sem controles de mídia ou contadores
