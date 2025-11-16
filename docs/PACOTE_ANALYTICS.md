# Sistema de Analytics para Pacotes de Pescaria

## 📊 Visão Geral

Sistema completo de rastreamento e análise de performance dos pacotes de pescaria, incluindo visualizações, cliques, conversões e integração com pixels de tracking (Facebook Pixel, Google Analytics, etc.).

## 🎯 Funcionalidades

### 1. Rastreamento Automático
- **Visualizações**: Rastreadas automaticamente quando usuário acessa a página do pacote
- **Cliques em Reserva**: Quando usuário clica no botão de reservar
- **Cliques no WhatsApp**: Quando usuário clica para conversar via WhatsApp
- **Conversões**: Registradas manualmente quando venda é confirmada

### 2. Analytics Dashboard
Acesse em: `/admin/pacotes/analytics`

Métricas disponíveis:
- Total de visualizações (geral e por pacote)
- Cliques em botões de ação
- Conversões confirmadas
- Taxa de conversão percentual
- Visualizações dos últimos 7 e 30 dias

### 3. Códigos de Tracking Personalizados
Configure códigos de tracking específicos para cada pacote:
- Facebook Pixel
- Google Analytics (GA4)
- Google Tag Manager
- Scripts personalizados de afiliados

## 🚀 Como Usar

### No Frontend (Páginas Públicas)

#### 1. Rastrear Visualização Automática
```typescript
import { usePacoteAnalytics } from '@/hooks/usePacoteAnalytics';

const PacoteDetalhes = ({ pacote }) => {
  // Registra visualização automaticamente
  usePacoteAnalytics(pacote.id, 'visualizacao');
  
  return (
    <div>
      {/* Conteúdo do pacote */}
    </div>
  );
};
```

#### 2. Rastrear Clique em Reserva
```typescript
import { registrarEventoPacote } from '@/hooks/usePacoteAnalytics';

const BotaoReserva = ({ pacoteId }) => {
  const handleClick = async () => {
    await registrarEventoPacote(pacoteId, 'clique_reserva');
    // Redirecionar para reserva
  };
  
  return <button onClick={handleClick}>Reservar</button>;
};
```

#### 3. Rastrear Clique no WhatsApp
```typescript
const BotaoWhatsApp = ({ pacoteId, telefone }) => {
  const handleClick = async () => {
    await registrarEventoPacote(pacoteId, 'clique_whatsapp');
    window.open(`https://wa.me/${telefone}`, '_blank');
  };
  
  return <button onClick={handleClick}>Falar no WhatsApp</button>;
};
```

#### 4. Registrar Conversão (Backend/Manual)
```typescript
import { registrarEventoPacote } from '@/hooks/usePacoteAnalytics';

// Quando confirmar a venda/reserva
await registrarEventoPacote(pacoteId, 'conversao', 'venda_confirmada');
```

### No Admin

#### 1. Configurar Código de Tracking

Ao editar um pacote, vá para a aba **"Tracking"** e adicione seu código:

**Facebook Pixel - Exemplo:**
```javascript
fbq('track', 'ViewContent', {
  content_name: 'Pacote VIP',
  content_category: 'Pacotes de Pesca',
  content_ids: ['pacote-vip'],
  content_type: 'product',
  value: 1200.00,
  currency: 'BRL'
});
```

**Google Analytics (GA4) - Exemplo:**
```javascript
gtag('event', 'view_item', {
  items: [{
    item_id: 'pacote-vip',
    item_name: 'Pacote VIP',
    item_category: 'Pacotes de Pesca',
    price: 1200.00,
    currency: 'BRL'
  }]
});
```

**Google Tag Manager - Exemplo:**
```javascript
dataLayer.push({
  'event': 'pacote_visualizado',
  'pacote_nome': 'Pacote VIP',
  'pacote_preco': 1200.00,
  'pacote_tipo': 'completo'
});
```

#### 2. Visualizar Analytics

1. Acesse `/admin/pacotes`
2. Clique no botão **"Analytics"**
3. Veja métricas de todos os pacotes
4. Analise taxa de conversão
5. Compare performance entre pacotes

## 📊 Estrutura do Banco de Dados

### Tabela: `pacote_analytics`

```sql
CREATE TABLE pacote_analytics (
  id UUID PRIMARY KEY,
  pacote_id UUID REFERENCES pacotes(id),
  evento TEXT NOT NULL,  -- 'visualizacao', 'clique_reserva', 'clique_whatsapp', 'conversao'
  tipo TEXT,             -- campo opcional para segmentação adicional
  ip_address TEXT,       -- endereço IP do usuário
  user_agent TEXT,       -- navegador/dispositivo
  created_at TIMESTAMP   -- data/hora do evento
);
```

### Campo Adicional em `pacotes`

```sql
ALTER TABLE pacotes ADD COLUMN tracking_code TEXT;
```

## 🔍 Queries Úteis

### 1. Total de Visualizações por Pacote
```sql
SELECT 
  p.nome,
  COUNT(*) as total_visualizacoes
FROM pacote_analytics pa
JOIN pacotes p ON p.id = pa.pacote_id
WHERE pa.evento = 'visualizacao'
GROUP BY p.nome
ORDER BY total_visualizacoes DESC;
```

### 2. Taxa de Conversão
```sql
SELECT 
  p.nome,
  COUNT(CASE WHEN pa.evento = 'visualizacao' THEN 1 END) as visualizacoes,
  COUNT(CASE WHEN pa.evento = 'conversao' THEN 1 END) as conversoes,
  ROUND(
    (COUNT(CASE WHEN pa.evento = 'conversao' THEN 1 END)::float / 
     NULLIF(COUNT(CASE WHEN pa.evento = 'visualizacao' THEN 1 END), 0) * 100)::numeric,
    2
  ) as taxa_conversao_pct
FROM pacotes p
LEFT JOIN pacote_analytics pa ON pa.pacote_id = p.id
WHERE p.ativo = true
GROUP BY p.nome
ORDER BY conversoes DESC;
```

### 3. Eventos dos Últimos 7 Dias
```sql
SELECT 
  p.nome,
  pa.evento,
  COUNT(*) as total
FROM pacote_analytics pa
JOIN pacotes p ON p.id = pa.pacote_id
WHERE pa.created_at >= NOW() - INTERVAL '7 days'
GROUP BY p.nome, pa.evento
ORDER BY total DESC;
```

### 4. Funil de Conversão
```sql
SELECT 
  p.nome,
  COUNT(CASE WHEN pa.evento = 'visualizacao' THEN 1 END) as visualizacoes,
  COUNT(CASE WHEN pa.evento = 'clique_reserva' THEN 1 END) as cliques_reserva,
  COUNT(CASE WHEN pa.evento = 'clique_whatsapp' THEN 1 END) as cliques_whatsapp,
  COUNT(CASE WHEN pa.evento = 'conversao' THEN 1 END) as conversoes
FROM pacotes p
LEFT JOIN pacote_analytics pa ON pa.pacote_id = p.id
WHERE p.ativo = true
GROUP BY p.nome
ORDER BY conversoes DESC;
```

## 🎨 Integração com Pixels

### Facebook Pixel

#### Eventos Principais:
- `ViewContent`: Visualização do pacote
- `InitiateCheckout`: Clique em "Reservar"
- `Contact`: Clique no WhatsApp
- `Purchase`: Conversão confirmada

#### Exemplo Completo:
```javascript
// ViewContent (automático na visualização)
fbq('track', 'ViewContent', {
  content_name: 'Pacote VIP',
  content_category: 'Pacotes de Pesca',
  content_ids: ['pacote-vip'],
  content_type: 'product',
  value: 1200.00,
  currency: 'BRL'
});

// Purchase (quando confirmar venda)
fbq('track', 'Purchase', {
  value: 1200.00,
  currency: 'BRL',
  content_ids: ['pacote-vip'],
  content_type: 'product'
});
```

### Google Analytics (GA4)

#### Eventos Principais:
- `view_item`: Visualização do pacote
- `add_to_cart`: Interesse em reservar
- `begin_checkout`: Iniciar processo de reserva
- `purchase`: Conversão confirmada

#### Exemplo Completo:
```javascript
// View Item
gtag('event', 'view_item', {
  items: [{
    item_id: 'pacote-vip',
    item_name: 'Pacote VIP',
    item_category: 'Pacotes de Pesca',
    price: 1200.00
  }]
});

// Purchase
gtag('event', 'purchase', {
  transaction_id: 'T12345',
  value: 1200.00,
  currency: 'BRL',
  items: [{
    item_id: 'pacote-vip',
    item_name: 'Pacote VIP',
    price: 1200.00,
    quantity: 1
  }]
});
```

## 📈 Métricas e KPIs

### Métricas Principais
1. **Visualizações**: Quantas pessoas viram o pacote
2. **CTR (Click-Through Rate)**: % de cliques em reserva/WhatsApp
3. **Taxa de Conversão**: % de visualizações que viraram vendas
4. **Valor Médio**: Valor médio das conversões

### KPIs Recomendados
- Taxa de conversão ideal: **> 3%**
- CTR em botões: **> 10%**
- Visualizações para conversão: **< 30:1**

## 🔒 Segurança e Privacidade

### Row Level Security (RLS)
```sql
-- Visitantes podem registrar eventos
CREATE POLICY "Visitantes podem registrar eventos" 
ON pacote_analytics 
FOR INSERT 
WITH CHECK (true);

-- Apenas admins podem ver analytics
CREATE POLICY "Admins podem ver analytics" 
ON pacote_analytics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));
```

### Dados Coletados
- ✅ Evento realizado
- ✅ User Agent (navegador/dispositivo)
- ❌ Dados pessoais identificáveis (não coletamos)
- ⚠️ IP Address (opcional, desabilitado por padrão)

## 🛠️ Troubleshooting

### Eventos não estão sendo registrados
1. Verifique se o Supabase está configurado corretamente
2. Confirme que a tabela `pacote_analytics` existe
3. Verifique as políticas RLS
4. Confira se o pacote_id está correto

### Pixel não está disparando
1. Verifique se o código está na aba "Tracking"
2. Confirme que o Facebook Pixel/GA está instalado no site
3. Use o Facebook Pixel Helper ou Google Tag Assistant
4. Verifique se não há erros no console

### Analytics não aparecem no dashboard
1. Aguarde alguns minutos (pode haver delay)
2. Verifique se há eventos registrados na tabela
3. Confirme que você é admin
4. Recarregue a página

## 📚 Recursos Adicionais

- [Documentação do Facebook Pixel](https://developers.facebook.com/docs/meta-pixel)
- [Documentação do Google Analytics](https://developers.google.com/analytics)
- [Documentação do Google Tag Manager](https://developers.google.com/tag-platform/tag-manager)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 Próximos Passos

1. ✅ Sistema de analytics implementado
2. ✅ Tracking codes configuráveis
3. ✅ Dashboard de analytics
4. 🔄 Criar páginas públicas de pacotes e integrar tracking
5. 🔄 Implementar webhooks para conversões automáticas
6. 🔄 Adicionar relatórios exportáveis (PDF/CSV)
7. 🔄 Criar alertas de performance (conversão baixa, etc.)

## 💡 Dicas de Otimização

1. **Teste A/B**: Compare diferentes versões de pacotes
2. **Segmentação**: Use o campo `tipo` para segmentar por fonte de tráfego
3. **Funil de Conversão**: Acompanhe cada etapa do processo
4. **Remarketing**: Use os dados para criar audiências personalizadas
5. **Preços Dinâmicos**: Ajuste preços baseado na performance

---

**Última atualização**: Novembro 2024
**Versão**: 1.0.0
