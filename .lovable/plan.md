

## Diagnóstico: "App de risco bloqueado" pelo Google Play Protect

O aviso do Google Play Protect está aparecendo porque o PWA está configurado com `registerType: 'autoUpdate'` e `injectRegister: 'auto'`, o que faz o service worker se registrar automaticamente e agressivamente solicitar instalação. O Google Play Protect interpreta isso como comportamento suspeito em dispositivos Android mais antigos.

**Causa raiz**: O `vite-plugin-pwa` está gerando um service worker com estratégia agressiva (`clientsClaim: true`, `skipWaiting: true`, `autoUpdate`) e o prompt de instalação nativo está sendo disparado automaticamente. Combinado com a falta de um `assetlinks.json` (Digital Asset Links) para verificar a propriedade do domínio, o Android classifica o app como "não verificado".

## Plano de Correção

### 1. Adicionar arquivo Digital Asset Links (`public/.well-known/assetlinks.json`)
- Criar arquivo vazio `[]` para indicar que não há app Android associado, evitando confusão do Play Protect

### 2. Tornar o registro do Service Worker menos agressivo
- Em `vite.config.ts`: mudar `registerType` de `'autoUpdate'` para `'prompt'`
- Mudar `injectRegister` de `'auto'` para `'inline'` ou `null` para controlar manualmente
- Remover `clientsClaim: true` e `skipWaiting: true` do workbox

### 3. Remover prompt de instalação automático
- Não mostrar `InstallPrompt` automaticamente — só mostrar quando o usuário clicar em um botão "Instalar App" no menu/footer
- Remover o componente `PWALifecycle` do render automático ou torná-lo opt-in

### 4. Atualizar manifest.json
- Adicionar `"id": "/"` para identificação única
- Adicionar `"launch_handler": { "client_mode": "navigate-existing" }`

### Arquivos a editar

| Arquivo | Ação |
|---------|------|
| `public/.well-known/assetlinks.json` | Criar com `[]` |
| `vite.config.ts` | Mudar `registerType` para `'prompt'`, remover `clientsClaim`/`skipWaiting` |
| `public/manifest.json` | Adicionar `id` e `launch_handler` |
| `src/components/PWALifecycle.tsx` | Remover exibição automática do InstallPrompt |
| `src/components/Footer.tsx` | Adicionar botão manual "Instalar App" (opcional) |

