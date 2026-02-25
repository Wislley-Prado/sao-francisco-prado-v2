

# Gerar Script SQL para Clonar o Banco

## O que seria feito

Eu leio todas as tabelas, views, functions, triggers e RLS policies do seu banco atual e monto um **único arquivo SQL** com todos os comandos `CREATE TABLE`, `CREATE FUNCTION`, `CREATE POLICY`, etc.

## Como você usaria

1. Abra o dashboard do **novo projeto Supabase**
2. Vá em **SQL Editor** (menu lateral)
3. Cole o script inteiro
4. Clique em **Run**
5. Pronto — todas as tabelas, policies e functions são criadas

## O que o script incluiria

| Item | Incluido |
|------|----------|
| Todas as 20+ tabelas (ranchos, pacotes, blog_posts, site_settings, etc.) | Sim |
| Colunas, tipos, defaults, constraints | Sim |
| Views publicas (site_settings_public, avaliacoes_public, etc.) | Sim |
| Functions (has_role, is_super_admin, update_updated_at) | Sim |
| Todas as RLS policies | Sim |
| Enum types (app_role) | Sim |
| Storage buckets | Sim |
| **Dados existentes** (registros nas tabelas) | **Nao** |

## Limitacao importante

O script cria apenas a **estrutura** (schema). Os dados que voce ja tem (ranchos cadastrados, posts do blog, configuracoes, etc.) **nao sao copiados**. Para copiar dados, voce precisaria usar o `pg_dump` da Opcao 2.

## Resumo da comparacao

- **Script SQL (esta opcao)**: Mais facil de executar (so colar), mas copia apenas estrutura
- **pg_dump (Opcao 2)**: Precisa instalar CLI, mas copia estrutura + dados

Se voce quer um projeto novo **limpo** com a mesma estrutura, o script SQL e perfeito. Se precisa dos dados tambem, use o pg_dump.

