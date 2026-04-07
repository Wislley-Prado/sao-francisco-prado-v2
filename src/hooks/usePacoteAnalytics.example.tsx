/**
 * EXEMPLOS DE USO DO usePacoteAnalytics
 * 
 * Este arquivo contém exemplos práticos de como usar o hook de analytics de pacotes
 * em diferentes situações.
 */

import { usePacoteAnalytics, registrarEventoPacote, dispararPixel } from '@/hooks/usePacoteAnalytics';

/**
 * EXEMPLO 1: Rastrear visualização automática de um pacote
 * Use quando o usuário acessar a página de detalhes de um pacote
 */
export const PacoteDetalhesPage = ({ pacoteId, trackingCode }: { pacoteId: string; trackingCode?: string }) => {
  // Registra automaticamente a visualização quando o componente monta
  usePacoteAnalytics(pacoteId, 'visualizacao');

  // Dispara pixel personalizado se configurado
  if (trackingCode) {
    dispararPixel(trackingCode, 'ViewContent', {
      content_name: 'Pacote de Pesca',
      content_id: pacoteId
    });
  }

  return (
    <div>
      {/* Conteúdo da página do pacote */}
    </div>
  );
};

/**
 * EXEMPLO 2: Rastrear clique no botão de reserva
 * Use quando o usuário clicar no botão para fazer uma reserva
 */
export const BotaoReserva = ({ pacoteId, trackingCode }: { pacoteId: string; trackingCode?: string }) => {
  const handleReservaClick = async () => {
    // Registra o evento de clique em reserva
    await registrarEventoPacote(pacoteId, 'clique_reserva');

    // Dispara pixel de iniciação de checkout (Facebook Pixel)
    if (trackingCode) {
      dispararPixel(trackingCode, 'InitiateCheckout', {
        content_ids: [pacoteId],
        content_type: 'product'
      });
    }

    // Redireciona para página de reserva ou abre formulário
    window.location.href = `/reserva/${pacoteId}`;
  };

  return (
    <button onClick={handleReservaClick}>
      Reservar Agora
    </button>
  );
};

/**
 * EXEMPLO 3: Rastrear clique no WhatsApp
 * Use quando o usuário clicar para entrar em contato via WhatsApp
 */
export const BotaoWhatsApp = ({ pacoteId, telefone, trackingCode }: {
  pacoteId: string;
  telefone: string;
  trackingCode?: string;
}) => {
  const handleWhatsAppClick = async () => {
    // Registra o evento de clique no WhatsApp
    await registrarEventoPacote(pacoteId, 'clique_whatsapp');

    // Dispara pixel de contato (Facebook Pixel)
    if (trackingCode) {
      dispararPixel(trackingCode, 'Contact', {
        content_name: 'WhatsApp',
        content_id: pacoteId
      });
    }

    // Abre o WhatsApp
    const mensagem = encodeURIComponent('Olá! Gostaria de saber mais sobre o pacote de pesca.');
    window.open(`https://wa.me/${telefone}?text=${mensagem}`, '_blank');
  };

  return (
    <button onClick={handleWhatsAppClick}>
      Falar no WhatsApp
    </button>
  );
};

/**
 * EXEMPLO 4: Rastrear conversão (venda confirmada)
 * Use quando confirmar que uma reserva/venda foi realmente efetivada
 * 
 * IMPORTANTE: Este evento deve ser registrado manualmente no backend
 * ou em um sistema de gerenciamento de reservas quando a venda for confirmada
 */
export const ConfirmarVenda = async (pacoteId: string, valor: number, trackingCode?: string) => {
  // Registra a conversão
  await registrarEventoPacote(pacoteId, 'conversao', 'venda_confirmada');

  // Dispara pixel de compra (Facebook Pixel)
  if (trackingCode) {
    dispararPixel(trackingCode, 'Purchase', {
      value: valor,
      currency: 'BRL',
      content_ids: [pacoteId],
      content_type: 'product'
    });
  }

  // Google Analytics (GA4)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: `pacote_${pacoteId}_${Date.now()}`,
      value: valor,
      currency: 'BRL',
      items: [{
        item_id: pacoteId,
        item_name: 'Pacote de Pesca',
        price: valor,
        quantity: 1
      }]
    });
  }
};

/**
 * EXEMPLO 5: Configurar códigos de tracking personalizados no admin
 * 
 * No formulário de edição de pacotes, adicione na aba "Tracking":
 * 
 * Facebook Pixel - Rastrear visualização de conteúdo:
 * ```javascript
 * fbq('track', 'ViewContent', {
 *   content_name: 'Pacote VIP',
 *   content_category: 'Pacotes de Pesca',
 *   content_ids: ['pacote-vip'],
 *   content_type: 'product',
 *   value: 1200.00,
 *   currency: 'BRL'
 * });
 * ```
 * 
 * Google Analytics - Rastrear visualização de produto:
 * ```javascript
 * gtag('event', 'view_item', {
 *   items: [{
 *     item_id: 'pacote-vip',
 *     item_name: 'Pacote VIP',
 *     item_category: 'Pacotes de Pesca',
 *     price: 1200.00,
 *     currency: 'BRL'
 *   }]
 * });
 * ```
 * 
 * Google Tag Manager - Disparar evento customizado:
 * ```javascript
 * dataLayer.push({
 *   'event': 'pacote_visualizado',
 *   'pacote_nome': 'Pacote VIP',
 *   'pacote_preco': 1200.00,
 *   'pacote_tipo': 'completo'
 * });
 * ```
 */

/**
 * EXEMPLO 6: Rastrear eventos com tipos personalizados
 * Use para criar segmentações específicas de analytics
 */
export const RastrearEventoPersonalizado = async (
  pacoteId: string,
  evento: 'clique_reserva' | 'clique_whatsapp',
  tipo: string
) => {
  // Registra o evento com tipo específico
  await registrarEventoPacote(pacoteId, evento, tipo);

  // Exemplos de tipos:
  // - 'mobile' / 'desktop' (origem do dispositivo)
  // - 'organico' / 'pago' (origem do tráfego)
  // - 'instagram' / 'facebook' / 'google' (origem da campanha)
};

/**
 * TABELA pacote_analytics
 * 
 * Estrutura da tabela no banco de dados:
 * 
 * - id: UUID (chave primária)
 * - pacote_id: UUID (referência ao pacote)
 * - evento: TEXT (visualizacao, clique_reserva, clique_whatsapp, conversao)
 * - tipo: TEXT (tipo adicional para segmentação - opcional)
 * - ip_address: TEXT (endereço IP do usuário - opcional)
 * - user_agent: TEXT (navegador/dispositivo do usuário)
 * - created_at: TIMESTAMP (data/hora do evento)
 * 
 * QUERIES ÚTEIS:
 * 
 * 1. Total de visualizações por pacote:
 * SELECT pacote_id, COUNT(*) as total 
 * FROM pacote_analytics 
 * WHERE evento = 'visualizacao' 
 * GROUP BY pacote_id;
 * 
 * 2. Taxa de conversão por pacote:
 * SELECT 
 *   pacote_id,
 *   COUNT(CASE WHEN evento = 'visualizacao' THEN 1 END) as visualizacoes,
 *   COUNT(CASE WHEN evento = 'conversao' THEN 1 END) as conversoes,
 *   (COUNT(CASE WHEN evento = 'conversao' THEN 1 END)::float / 
 *    NULLIF(COUNT(CASE WHEN evento = 'visualizacao' THEN 1 END), 0) * 100) as taxa_conversao
 * FROM pacote_analytics
 * GROUP BY pacote_id;
 * 
 * 3. Eventos nos últimos 7 dias:
 * SELECT * FROM pacote_analytics 
 * WHERE created_at >= NOW() - INTERVAL '7 days'
 * ORDER BY created_at DESC;
 */
