

# Botão "Reservar" Customizável pelo Admin

## Situação Atual
- O link do botão "Reservar" já é configurável em **Configurações** (`reserva_button_link`)
- O **texto** do botão está fixo como "Reservar" no código do Header
- Você quer poder mudar tanto o **nome** quanto o **link** pelo painel admin

## O Que Será Feito

### 1. Novo campo no banco de dados
Adicionar coluna `reserva_button_text` na tabela `site_settings` com valor padrão "Reservar".

### 2. Painel Admin (Configurações)
Adicionar um campo de texto **"Texto do Botão Reservar"** logo acima do campo de link que já existe, na seção "Footer e Header".

### 3. Header do site
O botão passará a usar o texto vindo do banco em vez do texto fixo "Reservar". Se não houver texto configurado, mantém "Reservar" como padrão.

## Arquivos Alterados

| Arquivo | Mudança |
|---------|---------|
| Nova migration SQL | Adicionar coluna `reserva_button_text` |
| `src/pages/admin/Configuracoes.tsx` | Novo campo input para o texto do botão |
| `src/components/Header.tsx` | Usar `settings?.reserva_button_text` no botão |
| `src/hooks/useOptimizedData.ts` | Incluir `reserva_button_text` no tipo `SiteSettings` |

## Resultado
No admin, você terá dois campos lado a lado:
- **Texto do Botão**: ex: "Agende Agora", "Fale Conosco", "Reserve Já"
- **Link do Botão**: ex: `https://wa.me/5538988320108`

O botão no cabeçalho do site mudará automaticamente.

