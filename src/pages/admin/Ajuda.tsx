import { 
  BookOpen, 
  Home, 
  Package, 
  Star, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  HelpCircle, 
  MessageSquare,
  MessageCircle,
  Settings,
  Search,
  Calendar,
  Image,
  Eye,
  MousePointer,
  Filter,
  Upload,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  ExternalLink,
  Download,
  ShieldAlert,
  Building2,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Ajuda = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      id: 'dashboard',
      icon: BarChart3,
      title: 'Dashboard',
      color: 'text-blue-500',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            O Dashboard é sua central de controle, mostrando uma visão geral do sistema.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold">O que você encontra:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Total de Ranchos cadastrados no sistema</li>
              <li>Total de Pacotes de pescaria disponíveis</li>
              <li>Número de Posts do Blog publicados</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Ações Rápidas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Novo Rancho:</strong> Cadastrar propriedade para hospedagem</li>
              <li><strong>Novo Pacote:</strong> Criar pacote de pescaria</li>
              <li><strong>Novo Post:</strong> Escrever artigo para o blog</li>
            </ul>
          </div>
          <Badge variant="secondary">Ponto de partida para navegação rápida</Badge>
        </div>
      )
    },
    {
      id: 'ranchos',
      icon: Home,
      title: 'Ranchos',
      color: 'text-green-500',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Gerencie todas as propriedades de hospedagem disponíveis para pescaria.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Como Criar um Rancho:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Novo Rancho"</li>
              <li>Preencha os campos obrigatórios: nome, slug (URL amigável), localização</li>
              <li>Adicione descrição detalhada da propriedade</li>
              <li>Configure capacidade, quartos, banheiros</li>
              <li>Defina preço por diária</li>
              <li>Faça upload de múltiplas imagens (primeira será a capa)</li>
              <li>Adicione comodidades disponíveis (Wi-Fi, ar-condicionado, etc.)</li>
              <li>Configure coordenadas GPS para mapa (opcional)</li>
              <li>Adicione link do Google Calendar para disponibilidade</li>
              <li>Configure número de WhatsApp específico (opcional)</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filtros Disponíveis:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Busca:</strong> Pesquisar por nome do rancho</li>
              <li><strong>Disponibilidade:</strong> Filtrar disponíveis/indisponíveis</li>
              <li><strong>Destaque:</strong> Ver apenas ranchos em destaque na home</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4" /> Analytics por Rancho:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Visualizações totais da página do rancho</li>
              <li>Cliques no botão de WhatsApp</li>
              <li>Cliques em "Reservar Agora"</li>
              <li>Taxa de conversão (interesse/visualizações)</li>
            </ul>
          </div>
          <Badge variant="secondary">Funcionalidade Principal do Sistema</Badge>
        </div>
      )
    },
    {
      id: 'pacotes',
      icon: Package,
      title: 'Pacotes',
      color: 'text-purple-500',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Crie e gerencie pacotes de pescaria com diferentes níveis de serviço.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Criar Novo Pacote:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Novo Pacote"</li>
              <li>Defina nome e slug (URL) do pacote</li>
              <li>Escolha tipo (VIP, Luxo, Diamante, etc.)</li>
              <li>Configure preço e duração (dias/noites)</li>
              <li>Número de pessoas incluídas</li>
              <li>Escreva descrição completa do pacote</li>
              <li>Liste o que está incluso (guia, alimentação, transporte, etc.)</li>
              <li>Adicione características especiais</li>
              <li>Upload de imagens atrativas</li>
              <li>Marque como Popular ou Destaque (aparece na home)</li>
              <li>Configure código de tracking específico (opcional)</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Analytics de Pacotes:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Ver total de visualizações por pacote</li>
              <li>Cliques em botões de ação (WhatsApp, Reservar)</li>
              <li>Taxa de conversão individual</li>
              <li>Comparar performance entre pacotes</li>
              <li>Identificar pacotes mais populares</li>
            </ul>
          </div>
          <Badge variant="secondary">Produtos Principais do Negócio</Badge>
        </div>
      )
    },
    {
      id: 'avaliacoes',
      icon: Star,
      title: 'Avaliações',
      color: 'text-yellow-500',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Modere e responda avaliações de clientes sobre os ranchos.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Como Moderar:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Acesse a aba "Avaliações"</li>
              <li>Filtre por status: Pendente, Aprovada, Reprovada</li>
              <li>Leia o comentário e verifique a nota (1-5 estrelas)</li>
              <li>Aprove avaliações legítimas clicando no botão verde</li>
              <li>Reprove spam ou conteúdo inapropriado</li>
              <li>Responda avaliações aprovadas com agradecimento ou esclarecimento</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Estados de Avaliação:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Pendente:</strong> Aguardando aprovação do admin</li>
              <li><strong>Aprovada:</strong> Visível no site para visitantes</li>
              <li><strong>Reprovada:</strong> Oculta, não aparece publicamente</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Responder Avaliações:
            </h4>
            <p className="text-sm text-muted-foreground">
              Ao responder, demonstre profissionalismo e agradeça o feedback. Respostas aparecem 
              publicamente junto com a avaliação original.
            </p>
          </div>
          <Badge variant="secondary">Gerenciamento de Reputação</Badge>
        </div>
      )
    },
    {
      id: 'estatisticas',
      icon: TrendingUp,
      title: 'Estatísticas de Avaliações',
      color: 'text-orange-500',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Visualize métricas consolidadas de satisfação dos clientes.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold">Métricas Disponíveis:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Média Geral:</strong> Nota média de todas as avaliações (1-5 estrelas)</li>
              <li><strong>Total de Avaliações:</strong> Quantidade total de reviews recebidas</li>
              <li><strong>Distribuição de Notas:</strong> Quantas avaliações de cada estrela</li>
              <li><strong>Por Rancho:</strong> Ranking de satisfação por propriedade</li>
              <li><strong>Taxa de Aprovação:</strong> Percentual de avaliações aprovadas</li>
              <li><strong>Avaliações Recentes:</strong> Últimas reviews recebidas</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Como Usar:</h4>
            <p className="text-sm text-muted-foreground">
              Use essas métricas para identificar ranchos com melhor performance e aqueles 
              que precisam de melhorias. Avaliações baixas indicam oportunidades de aprimoramento 
              no serviço.
            </p>
          </div>
          <Badge variant="secondary">Indicadores de Qualidade</Badge>
        </div>
      )
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics (Ranchos)',
      color: 'text-cyan-500',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Análise detalhada de performance e engajamento dos ranchos.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold">Métricas Principais:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Visualizações:</strong> Quantas vezes a página foi acessada</li>
              <li><strong>Cliques WhatsApp:</strong> Interesse direto em contato</li>
              <li><strong>Cliques Reserva:</strong> Intenção de reservar</li>
              <li><strong>Taxa de Conversão:</strong> (Cliques / Visualizações) × 100</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Gráficos e Tabelas:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Gráfico de linha: evolução temporal das visualizações</li>
              <li>Tabela comparativa: todos os ranchos lado a lado</li>
              <li>Ranking: ranchos mais visualizados</li>
              <li>Período: últimos 7 dias vs total acumulado</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Interpretação:</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Alta visualização + Baixa conversão:</strong> Melhorar fotos ou descrição<br />
              <strong>Baixa visualização:</strong> Melhorar SEO ou destacar na home<br />
              <strong>Alta conversão:</strong> Rancho está otimizado, considere aumentar investimento
            </p>
          </div>
          <Badge variant="secondary">Tomada de Decisão Baseada em Dados</Badge>
        </div>
      )
    },
    {
      id: 'blog',
      icon: FileText,
      title: 'Blog',
      color: 'text-indigo-500',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Crie conteúdo educativo e atraia visitantes através do blog.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Criar Novo Post:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Novo Post"</li>
              <li>Defina título atrativo e slug (URL amigável para SEO)</li>
              <li>Escreva resumo curto (aparece nas listagens)</li>
              <li>Use o editor de texto rico com formatação:
                <ul className="list-disc list-inside ml-4">
                  <li>Negrito, itálico, sublinhado</li>
                  <li>Títulos (H1, H2, H3)</li>
                  <li>Listas numeradas e com marcadores</li>
                  <li>Links para sites externos</li>
                  <li>Inserir imagens no conteúdo</li>
                  <li>Citações e código (se necessário)</li>
                </ul>
              </li>
              <li>Escolha categoria (Dicas, Notícias, Tutoriais, etc.)</li>
              <li>Adicione tags para facilitar busca</li>
              <li>Upload de imagem de destaque (capa do post)</li>
              <li>Configure data de publicação (agora ou agendar)</li>
              <li>Publique ou salve como rascunho</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Image className="w-4 h-4" /> Banner de Mídia Paga (Opcional):
            </h4>
            <p className="text-sm text-muted-foreground">
              Adicione banners promocionais dentro do post para divulgar pacotes ou ranchos específicos.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Analytics do Blog:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Total de visualizações por post</li>
              <li>Posts mais lidos no período</li>
              <li>Taxa de engajamento (tempo de leitura)</li>
              <li>Compartilhamentos nas redes sociais</li>
            </ul>
          </div>
          <Badge variant="secondary">Marketing de Conteúdo e SEO</Badge>
        </div>
      )
    },
    {
      id: 'faqs',
      icon: HelpCircle,
      title: 'FAQs (Perguntas Frequentes)',
      color: 'text-pink-500',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Crie perguntas e respostas para ajudar visitantes e reduzir dúvidas.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Adicionar FAQ:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Nova FAQ"</li>
              <li>Digite a pergunta de forma clara e direta</li>
              <li>Escreva resposta completa e informativa</li>
              <li>Associe a um Pacote específico (ex: "FAQ do Pacote VIP")</li>
              <li>Ou associe a um Rancho específico</li>
              <li>Ou deixe geral (aparece em todas as páginas)</li>
              <li>Defina ordem de exibição (menores aparecem primeiro)</li>
              <li>Ative ou desative conforme necessário</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Estatísticas de Utilidade:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Visitantes podem votar se a resposta foi útil (👍/👎)</li>
              <li>Taxa de utilidade: % de votos positivos</li>
              <li>Total de votos recebidos</li>
              <li>Identifique FAQs que precisam ser melhoradas (muitos votos negativos)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Dica:</h4>
            <p className="text-sm text-muted-foreground">
              Monitore as perguntas que clientes fazem no WhatsApp e transforme as mais frequentes 
              em FAQs para reduzir tempo de atendimento.
            </p>
          </div>
          <Badge variant="secondary">Redução de Atrito e Suporte</Badge>
        </div>
      )
    },
    {
      id: 'depoimentos',
      icon: MessageSquare,
      title: 'Depoimentos',
      color: 'text-teal-500',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Adicione depoimentos de clientes satisfeitos para aumentar credibilidade.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Criar Depoimento:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Novo Depoimento"</li>
              <li>Digite nome do cliente</li>
              <li>Cargo ou cidade (ex: "Empresário de SP" ou "Pescador Profissional")</li>
              <li>Escreva o depoimento completo (experiência do cliente)</li>
              <li>Upload de foto do cliente (opcional mas recomendado)</li>
              <li>Defina nota de 1 a 5 estrelas</li>
              <li>Associe a um pacote específico (opcional)</li>
              <li>Defina ordem de exibição no carrossel</li>
              <li>Ative/desative conforme necessário</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Onde Aparecem:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Home page: carrossel de depoimentos principais</li>
              <li>Páginas de pacotes: depoimentos relacionados</li>
              <li>Seção "O que dizem nossos clientes"</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Dica de Qualidade:</h4>
            <p className="text-sm text-muted-foreground">
              Use depoimentos específicos e detalhados. Evite genéricos como "Foi ótimo!". 
              Prefira "Peguei um dourado de 15kg com o guia João, experiência incrível!"
            </p>
          </div>
          <Badge variant="secondary">Prova Social e Conversão</Badge>
        </div>
      )
    },
    {
      id: 'whatsapp-config',
      icon: MessageCircle,
      title: 'WhatsApp Config',
      color: 'text-green-600',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Configure o widget de WhatsApp que aparece no site.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" /> Configurações Principais:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Número WhatsApp:</strong> Com código do país (ex: +5511999999999)</li>
              <li><strong>Título do Chat:</strong> "Fale Conosco" ou "Atendimento Rancho Prado"</li>
              <li><strong>Saudação:</strong> Mensagem inicial quando widget abre</li>
              <li><strong>Mensagem Padrão:</strong> Texto pré-preenchido ao clicar em "Enviar"</li>
              <li><strong>Horário de Atendimento:</strong> "Seg-Sex 8h-18h" (informativo)</li>
              <li><strong>Instruções:</strong> Orientações antes de enviar mensagem</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Mensagens Rápidas (Botões):
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Crie até 6 botões de atalho com mensagens pré-definidas:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>"💰 Consultar Preços" → "Olá! Gostaria de saber os valores dos pacotes"</li>
              <li>"📅 Verificar Disponibilidade" → "Preciso verificar datas disponíveis"</li>
              <li>"🎣 Informações sobre Pacotes" → "Quais pacotes de pesca vocês oferecem?"</li>
              <li>"📍 Como Chegar" → "Como faço para chegar até o rancho?"</li>
              <li>"🏠 Acomodações" → "Gostaria de saber sobre as acomodações"</li>
              <li>"❓ Outras Dúvidas" → "Tenho algumas dúvidas sobre..."</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Exemplo de Configuração:</h4>
            <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
              <p><strong>Título:</strong> Fale com Nossa Equipe</p>
              <p><strong>Saudação:</strong> Olá! 👋 Como podemos ajudar?</p>
              <p><strong>Mensagem Padrão:</strong> Olá! Vim pelo site e gostaria de mais informações sobre pescaria no Rio São Francisco.</p>
              <p><strong>Horário:</strong> Segunda a Sábado, 7h às 20h</p>
            </div>
          </div>
          <Badge variant="secondary">Atendimento e Conversão</Badge>
        </div>
      )
    },
    {
      id: 'whatsapp-analytics',
      icon: TrendingUp,
      title: 'WhatsApp Analytics',
      color: 'text-green-700',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Monitore o uso do widget de WhatsApp e otimize conversões.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold">Métricas Disponíveis:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Widget Aberto:</strong> Quantas vezes visitantes clicaram no ícone</li>
              <li><strong>Botão WhatsApp Clicado:</strong> Cliques no botão principal "Enviar"</li>
              <li><strong>Mensagens Rápidas:</strong> Cliques em cada botão de atalho</li>
              <li><strong>Taxa de Conversão:</strong> (Mensagens enviadas / Widget aberto) × 100</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Filtros de Período:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Últimos 7 dias</li>
              <li>Últimos 30 dias</li>
              <li>Período personalizado (escolha datas)</li>
              <li>Comparação com período anterior</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Download className="w-4 h-4" /> Exportação:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Exportar para CSV (Excel)</li>
              <li>Exportar para PDF (relatório formatado)</li>
              <li>Ideal para apresentações ou arquivamento</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Trash className="w-4 h-4" /> Limpeza Mensal de Dados:
            </h4>
            <p className="text-sm text-muted-foreground">
              Recomenda-se exportar os dados e limpar a base mensalmente para manter o banco de dados 
              otimizado. Use o botão "Limpar Dados" após exportar os relatórios.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Como Interpretar:</h4>
            <p className="text-sm text-muted-foreground">
              <strong>Muitas aberturas + Poucos cliques:</strong> Melhorar texto da saudação ou botões<br />
              <strong>Botão específico muito usado:</strong> Considere destacá-lo mais<br />
              <strong>Taxa conversão baixa:</strong> Simplificar processo ou mensagens
            </p>
          </div>
          <Badge variant="secondary">Otimização de Atendimento</Badge>
        </div>
      )
    },
    {
      id: 'configuracoes',
      icon: Settings,
      title: 'Configurações (Tracking)',
      color: 'text-gray-600',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Configure ferramentas de rastreamento e análise de marketing.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold">Códigos de Rastreamento:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Facebook Pixel ID:</strong> Para rastrear conversões de anúncios no Facebook/Instagram
                <span className="block text-xs ml-4 mt-1">Formato: 15-16 dígitos numéricos (ex: 1234567890123456)</span>
              </li>
              <li>
                <strong>Google Analytics (GA4):</strong> Análise de tráfego e comportamento do usuário
                <span className="block text-xs ml-4 mt-1">Formato: G-XXXXXXXXXX (ex: G-ABC123XYZ0)</span>
              </li>
              <li>
                <strong>Google Tag Manager:</strong> Gerenciador de tags para múltiplas ferramentas
                <span className="block text-xs ml-4 mt-1">Formato: GTM-XXXXXXX (ex: GTM-ABC1234)</span>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Onde Encontrar os Códigos:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Facebook Pixel:</strong> Facebook Business Manager → Eventos → Pixels</li>
              <li><strong>Google Analytics:</strong> Google Analytics → Admin → Fluxos de dados</li>
              <li><strong>Tag Manager:</strong> Google Tag Manager → Workspace → ID do contêiner</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Scripts Personalizados:</h4>
            <p className="text-sm text-muted-foreground">
              Campo para adicionar scripts adicionais no <code className="bg-muted px-1 rounded">&lt;head&gt;</code> do site. 
              Use para ferramentas como Hotjar, Chat online, ou outras integrações.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
              <p className="text-xs text-yellow-700 dark:text-yellow-500">
                <strong>⚠️ Atenção:</strong> Apenas adicione scripts de fontes confiáveis. 
                Códigos maliciosos podem comprometer a segurança do site.
              </p>
            </div>
          </div>
          <Badge variant="secondary">Marketing e Análise</Badge>
        </div>
      )
    },
    {
      id: 'anuncios',
      icon: Building2,
      title: 'Anúncios',
      color: 'text-blue-600',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Crie e gerencie anúncios de imóveis, pacotes ou outras ofertas para exibição no site.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Criar Novo Anúncio:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Clique em "Novo Anúncio"</li>
              <li>Escolha um template pré-configurado ou configure manualmente</li>
              <li>Preencha título (obrigatório) e subtítulo</li>
              <li>Adicione descrição detalhada do anúncio</li>
              <li>Faça upload da imagem principal</li>
              <li>Configure link de destino e texto do botão</li>
              <li>Defina período de exibição (data início e fim)</li>
              <li>Configure duração de exibição em rotações (3-60 segundos)</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Anúncios de Imóveis:
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Para anúncios de propriedades ou terrenos, ative a opção "Informações de Imóvel":
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Área:</strong> Tamanho da propriedade (m², hectares ou alqueires)</li>
              <li><strong>Preço:</strong> Valor de venda ou aluguel em reais</li>
              <li><strong>Localização:</strong> Endereço ou região (ex: "Velho Chico, Prado - MG")</li>
              <li>Essas informações aparecem como badges destacados no card do anúncio</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Tipos de Anúncios:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Banner Principal:</strong> Destaque no topo da página</li>
              <li><strong>Card Secundário:</strong> Cards menores em grid</li>
              <li><strong>Largura Total:</strong> Anúncio que ocupa toda a largura</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Posicionamento:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Topo:</strong> Primeira seção da página</li>
              <li><strong>Meio:</strong> Entre conteúdos principais</li>
              <li><strong>Rodapé:</strong> Antes do footer</li>
              <li><strong>Lateral:</strong> Sidebar (se disponível)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4" /> Analytics de Anúncios:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Visualizações: quantas vezes o anúncio foi exibido</li>
              <li>Cliques: interações com o botão/link do anúncio</li>
              <li>CTR (Click-through rate): taxa de conversão de visualizações em cliques</li>
            </ul>
          </div>
          <Badge variant="secondary">Promoção e Vendas</Badge>
        </div>
      )
    },
    {
      id: 'seguranca',
      icon: ShieldAlert,
      title: 'Segurança e Boas Práticas',
      color: 'text-red-600',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Diretrizes de segurança e boas práticas para manter o sistema protegido.
          </p>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Proteções Implementadas:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>RLS (Row Level Security):</strong> Todas as tabelas protegidas com políticas de acesso</li>
              <li><strong>Autenticação Admin:</strong> Verificação server-side de permissões de administrador</li>
              <li><strong>Sanitização HTML:</strong> Conteúdo do blog sanitizado contra XSS com DOMPurify</li>
              <li><strong>Validação de Formulários:</strong> Schemas Zod validam entradas de usuários</li>
              <li><strong>Edge Functions Seguras:</strong> Funções serverless com validação de role</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" /> Boas Práticas - Tracking Scripts:
            </h4>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg space-y-2">
              <p className="text-sm text-yellow-700 dark:text-yellow-500">
                <strong>⚠️ Validação de Códigos:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-yellow-700 dark:text-yellow-500">
                <li>Facebook Pixel: deve ter 15-16 dígitos numéricos</li>
                <li>Google Analytics: formato G-XXXXXXXXXX</li>
                <li>Google Tag Manager: formato GTM-XXXXXXX</li>
                <li>Scripts personalizados: adicione apenas de fontes 100% confiáveis</li>
              </ul>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Analytics - Integridade dos Dados:
            </h4>
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg space-y-2">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>ℹ️ Nota sobre Analytics Públicos:</strong>
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Os sistemas de analytics (visualizações, cliques, votos) permitem inserts públicos para 
                facilitar tracking sem autenticação. Isso é intencional, mas pode estar sujeito a:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-blue-700 dark:text-blue-400 ml-2">
                <li>Inflação artificial de métricas por bots ou concorrentes</li>
                <li>Use os dados como indicadores, não como verdade absoluta</li>
                <li>Combine com ferramentas externas (Google Analytics) para validação</li>
                <li>Considere exportar e limpar dados mensalmente para manter banco otimizado</li>
              </ul>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Privacidade e LGPD:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Sistema coleta User-Agent e IPs para analytics (anonimizados)</li>
              <li>Avaliações armazenam email e nome de usuários</li>
              <li>Certifique-se que sua Política de Privacidade divulga essas coletas</li>
              <li>Cookie Consent configurado e ativo no site</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Recomendações Gerais:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Nunca compartilhe suas credenciais de administrador</li>
              <li>Use senhas fortes e únicas</li>
              <li>Revise regularmente logs de atividades suspeitas</li>
              <li>Mantenha backups regulares do banco de dados</li>
              <li>Monitore métricas de segurança no Supabase Dashboard</li>
            </ul>
          </div>
          <Badge variant="secondary">Proteção e Conformidade</Badge>
        </div>
      )
    },
    {
      id: 'imagens',
      icon: Image,
      title: 'Especificações de Imagens',
      color: 'text-emerald-500',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Guia de tamanhos ideais para upload de imagens em cada área do sistema.
          </p>
          
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg space-y-3">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              📐 Regras Gerais de Compressão Automática:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-emerald-700 dark:text-emerald-400">
              <li>Dimensão máxima: 1920px (largura ou altura)</li>
              <li>Tamanho máximo: 2MB por imagem</li>
              <li>Formatos aceitos: JPG, PNG, WEBP</li>
              <li>Imagens maiores serão comprimidas automaticamente</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Home className="w-4 h-4" /> Imagens de Ranchos:
            </h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Tamanho ideal:</strong> 1920 x 1080px (16:9)</li>
                <li><strong>Tamanho mínimo:</strong> 800 x 600px</li>
                <li><strong>Orientação:</strong> Paisagem (horizontal)</li>
                <li><strong>Uso:</strong> Cards na listagem e galeria de detalhes</li>
                <li><strong>Dica:</strong> A primeira imagem (principal) aparece no card</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Package className="w-4 h-4" /> Imagens de Pacotes:
            </h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Tamanho ideal:</strong> 1920 x 1080px (16:9)</li>
                <li><strong>Tamanho mínimo:</strong> 800 x 600px</li>
                <li><strong>Orientação:</strong> Paisagem (horizontal)</li>
                <li><strong>Uso:</strong> Hero do pacote e galeria</li>
                <li><strong>Dica:</strong> Use fotos de alta qualidade que mostrem a experiência</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" /> Imagem de Destaque do Blog:
            </h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Tamanho ideal:</strong> 1200 x 630px (proporção 1.91:1)</li>
                <li><strong>Tamanho mínimo:</strong> 600 x 400px</li>
                <li><strong>Orientação:</strong> Paisagem (horizontal)</li>
                <li><strong>Uso:</strong> Capa do post, compartilhamento em redes sociais</li>
                <li><strong>Dica:</strong> Evite muito texto na imagem (corte em redes sociais)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Fotos de Depoimentos:
            </h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Tamanho ideal:</strong> 400 x 400px (1:1 quadrado)</li>
                <li><strong>Tamanho mínimo:</strong> 150 x 150px</li>
                <li><strong>Orientação:</strong> Quadrado</li>
                <li><strong>Uso:</strong> Avatar do cliente no depoimento</li>
                <li><strong>Dica:</strong> Use fotos de rosto bem enquadrado</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Imagens de Anúncios:
            </h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Banner Principal:</strong> 1200 x 400px (3:1)</li>
                <li><strong>Card Secundário:</strong> 600 x 400px (3:2)</li>
                <li><strong>Full Width:</strong> 1920 x 500px</li>
                <li><strong>Dica:</strong> Mantenha elementos importantes no centro</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg space-y-2">
            <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-500">
              💡 Dicas para Melhores Resultados:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-yellow-700 dark:text-yellow-500">
              <li>Use iluminação natural para fotos de ranchos e pescarias</li>
              <li>Evite filtros pesados que distorcem cores</li>
              <li>Prefira JPG para fotos e PNG para logos/gráficos</li>
              <li>Comprima imagens antes de subir usando ferramentas como TinyPNG</li>
              <li>Teste como a imagem aparece em dispositivos móveis</li>
              <li>Preencha sempre o texto alternativo (alt) para acessibilidade e SEO</li>
            </ul>
          </div>

          <Badge variant="secondary">Otimização Visual</Badge>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Central de Ajuda
        </h1>
        <p className="text-muted-foreground mt-2">
          Documentação completa de todas as funcionalidades do painel administrativo
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Seções Disponíveis</CardDescription>
            <CardTitle className="text-3xl">{sections.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Funcionalidades</CardDescription>
            <CardTitle className="text-3xl">15</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Links Rápidos</CardDescription>
            <CardTitle className="text-3xl">
              <Link to="/admin" className="text-primary hover:underline text-base">
                Voltar ao Dashboard →
              </Link>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Ajuda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Digite o que você procura... (ex: blog, analytics, whatsapp)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xl"
          />
        </CardContent>
      </Card>

      {/* Accordion with all sections */}
      <Card>
        <CardHeader>
          <CardTitle>Documentação por Funcionalidade</CardTitle>
          <CardDescription>
            Clique em cada seção para ver instruções detalhadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              return (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${section.color}`} />
                      <span className="text-lg font-semibold">{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {filteredSections.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma seção encontrada para "{searchTerm}"</p>
              <p className="text-sm mt-2">Tente outro termo de busca</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Help */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Ainda com Dúvidas?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Se você não encontrou a resposta que procurava, entre em contato com o suporte técnico.
          </p>
          <p className="text-sm">
            <strong>Dica:</strong> Ao solicitar ajuda, mencione qual funcionalidade você está usando 
            e descreva o problema com detalhes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ajuda;
