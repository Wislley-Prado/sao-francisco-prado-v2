

# Corrigir: Remover Prompt de Atualização Desnecessario

## Problema

O popup "Atualização Disponível" aparece toda vez que o usuario abre o site. Isso acontece porque:
- O Vite PWA esta configurado com `skipWaiting: true` e `clientsClaim: true`, ou seja, atualizacoes ja sao aplicadas automaticamente
- Mas o codigo escuta o evento `controllerchange` e marca `hasUpdate = true`, mostrando o popup mesmo quando nao ha atualizacao real

## Solucao

Remover o popup de atualizacao e o botao manual de atualizar do Header, ja que as atualizacoes acontecem automaticamente.

## Alteracoes

| Arquivo | Acao |
|---------|------|
| `src/components/PWALifecycle.tsx` | Remover o `UpdatePrompt` do render |
| `src/components/UpdatePrompt.tsx` | DELETAR - nao e mais necessario |
| `src/components/Header.tsx` | Remover botao de atualizar (icone RefreshCw) do desktop e mobile |
| `src/hooks/usePWALifecycle.ts` | Remover logica de `hasUpdate`, `isUpdateReady` e `reloadApp` |

## Detalhes Tecnicos

**PWALifecycle.tsx**: Remover a importacao e renderizacao do `UpdatePrompt`.

**Header.tsx**: Remover:
- Import do `RefreshCw`
- Estado `isUpdating` e funcao `handleUpdateApp`
- Botao de atualizar no desktop e no mobile

**usePWALifecycle.ts**: Remover:
- `hasUpdate` e `isUpdateReady` do estado
- Listener de `controllerchange`
- Funcao `reloadApp`
- `setInterval` de checagem periodica

## Resultado

- O usuario nao vera mais o popup irritante a cada visita
- Atualizacoes continuam sendo aplicadas automaticamente pelo Service Worker
- Interface mais limpa no Header (sem botao de refresh desnecessario)

