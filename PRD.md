# Product Requirements Document (PRD) - PradoAqui

## 1. Visão Geral do Produto
O **PradoAqui** é uma plataforma digital completa voltada para o turismo e pesca na região do Rio São Francisco e Represa de Três Marias (MG). O sistema atua como um portal centralizado para aluguel de ranchos, venda de pacotes de pesca, comércio de propriedades, além de gerenciar conteúdo (Blog), anúncios publicitários e métricas de engajamento. 

O sistema possui uma interface pública (voltada para o cliente final) e um robusto Painel Administrativo (Admin) para gestão total do conteúdo e análise de dados.

## 2. Público-Alvo
- **Turistas e Pescadores:** Pessoas buscando alugar ranchos, comprar pacotes de pesca com guia e obter informações sobre a região.
- **Investidores/Compradores:** Pessoas interessadas em adquirir propriedades (ranchos/terrenos) na região.
- **Administradores do PradoAqui:** Equipe interna que gerencia reservas (via WhatsApp), atualiza o blog, cadastra ranchos/pacotes e monitora o acesso e conversão.

## 3. Arquitetura e Stack Tecnológico
O sistema é construído como uma Single Page Application (SPA) moderna, otimizada para performance e Progressive Web App (PWA).

**Frontend:**
- **Framework:** React 18 com Vite.
- **Linguagem:** TypeScript.
- **Roteamento:** React Router DOM (com Lazy Loading para otimização de bundle).
- **Gerenciamento de Estado/Cache:** TanStack React Query.
- **Estilização e UI:** Tailwind CSS, Shadcn UI e Radix UI (Componentes Acessíveis).
- **SEO e Head:** React Helmet Async.
- **Editor de Texto:** TipTap (para o Blog e descrições ricas).

**Backend & Infraestrutura:**
- **BaaS (Backend as a Service):** Supabase.
- **Banco de Dados:** PostgreSQL (Tabelas relacionais estruturadas).
- **Storage:** Supabase Storage para imagens e mídias.
- **Autenticação:** Supabase Auth (Sistema de Login para o Admin).

## 4. Funcionalidades Principais (Core Features)

### 4.1. Módulo de Ranchos (Aluguel)
- Listagem pública de ranchos disponíveis.
- Páginas de detalhes com carrossel de imagens, comodidades, localização (mapa) e preço.
- Status de disponibilidade ("Disponível" / "Ocupado").
- **Conversão:** Botões de CTA que direcionam o usuário para o WhatsApp com mensagens pré-configuradas.

### 4.2. Módulo de Pacotes de Pesca
- Listagem de pacotes turísticos/pesca (ex: VIP, Luxo, Diamante).
- Descrição detalhada de inclusões, duração e preços.
- Integração com depoimentos específicos de clientes que compraram aquele pacote.

### 4.3. Módulo de Blog e SEO
- Portal de notícias e dicas sobre pesca e a região de Três Marias.
- Editor de texto rico (TipTap) no painel admin para formatação de artigos.
- Suporte a tags, categorias, autor e imagens de destaque.
- Inserção dinâmica de "Banners de Mídia Paga" dentro dos posts.
- Geração dinâmica de tags Open Graph para compartilhamento em redes sociais (via proxy PHP).

### 4.4. Módulo de Anúncios (Monetização e Promoção)
- Gerenciamento de banners e anúncios veiculados no site.
- Rastreamento nativo de cliques e visualizações (Analytics interno).
- Controle de vigência (Data de Início e Fim) e posicionamento dinâmico.

### 4.5. Módulo de Propriedades (Imobiliário)
- Listagem de propriedades (ranchos/terrenos) à venda.
- Informações sobre área, valor e localização geográfica.

### 4.6. Prova Social (Depoimentos e Avaliações)
- Sistema de reviews com notas (estrelas) para Ranchos e Pacotes.
- Controle administrativo para aprovação/verificação das avaliações.

### 4.7. FAQ Dinâmico
- Sistema de Perguntas Frequentes atrelados a pacotes ou ranchos.
- Sistema de "Upvote/Downvote" (votos úteis) com rastreamento por IP para evitar spam.

### 4.8. Dashboard Administrativo (Admin Panel)
- Acesso restrito via Supabase Auth.
- **CRUD Completo:** Criação, edição, exclusão e listagem de Ranchos, Pacotes, Blog, Avaliações, FAQs, Depoimentos, Anúncios e Configurações Globais.
- **Analytics Integrado:** Dashboards com gráficos (Recharts) mostrando visualizações de páginas, cliques em anúncios e acessos por posts de blog e pacotes.
- Upload e otimização de imagens integrado ao Supabase Storage.

### 4.9. Configurações Globais e PWA
- Gerenciamento de informações globais do site (WhatsApp de contato, links sociais, textos padronizados, scripts de tracking como Google Analytics e Pixel).
- O site é instalável como um aplicativo nativo no celular (PWA - Progressive Web App).

## 5. Estrutura do Banco de Dados (Entidades Chave)
- `ranchos`, `rancho_imagens`, `rancho_estatisticas`
- `pacotes`, `pacote_imagens`, `pacote_analytics`
- `blog_posts`, `blog_analytics`
- `anuncios` (Sistema de Banners)
- `avaliacoes`, `depoimentos`
- `faqs`, `faq_votes`
- `configuracoes`, `dam_data` (Dados da represa)
- `propriedades_venda`
- `produtos`, `produto_imagens`, `categorias` (E-commerce pronto para uso)

## 6. Fluxos de Usuário (User Journeys)

**Jornada de Locação/Compra de Pacote:**
1. Usuário acessa a Home Page, otimizada para SEO.
2. Navega pelos Ranchos ou Pacotes de Pesca.
3. Lê avaliações e FAQs na página do produto.
4. Clica em "Reservar / Saber Mais".
5. É redirecionado para o WhatsApp do atendimento com uma mensagem parametrizada e o sistema registra um evento de clique no Analytics.

**Jornada do Leitor (Conteúdo):**
1. Usuário encontra um artigo no Google ou clica em um link compartilhado no WhatsApp.
2. Lê o post (com imagens de alta qualidade e banners estratégicos injetados).
3. Ao final do post, o carrossel sugere "Posts Relacionados".
4. O usuário pode compartilhar o post usando os botões sociais nativos da página.

**Jornada do Administrador:**
1. Realiza login seguro na rota `/admin`.
2. Acessa o Dashboard para ver métricas de cliques da semana.
3. Adiciona um novo post no blog ou atualiza os preços de um Rancho.
4. Atualiza banners de anúncios baseados na performance de cliques x visualizações.

## 7. Requisitos Não Funcionais
- **Performance:** Imagens otimizadas (carregamento lazy loading e fallback com skeleton screens).
- **Responsividade:** Mobile-first, interface perfeitamente adaptável para celulares, tablets e desktops (uso intensivo de classes Tailwind).
- **SEO:** Rotas amigáveis (slugs), metatags controladas pelo React Helmet e Proxy PHP para web crawlers de redes sociais.
- **Disponibilidade:** Hospedagem estática com fallback para rotas no Apache (`.htaccess`), garantindo que o React Router funcione perfeitamente.
