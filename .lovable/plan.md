

# Problema: Ordem Errada no Script SQL

## O que aconteceu

O erro `relation "public.user_roles" does not exist` ocorre porque o script cria as **functions** (`has_role`, `is_super_admin`) **antes** da tabela `user_roles`. As functions fazem `SELECT FROM public.user_roles`, mas a tabela ainda nao existe nesse momento.

## Correção

Reordenar o script `docs/clone-database.sql` para:

1. Enum types
2. **Tabela `user_roles` primeiro**
3. Functions (`has_role`, `is_super_admin`, `update_updated_at_column`)
4. Demais tabelas
5. Views, RLS, Policies, Storage

Basta mover a criação da tabela `user_roles` (linhas 53-59) para **antes** das functions (linha 14).

## Solução imediata (para o novo Supabase)

Enquanto eu corrijo o arquivo, você pode rodar **apenas isto** no SQL Editor do novo projeto antes do resto do script:

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'super_admin');

CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

Depois rode o restante do script normalmente.

## Arquivo alterado

| Arquivo | Mudança |
|---------|---------|
| `docs/clone-database.sql` | Mover criação de `user_roles` para antes das functions |

