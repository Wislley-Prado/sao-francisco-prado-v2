-- Sistema CMS completo para Rancho Prado Aqui
-- Criando todas as tabelas necessárias para gerenciar o site

-- 1. CATEGORIAS (para organizar produtos da loja)
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  slug TEXT NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. PRODUTOS DA LOJA
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  preco_promocional DECIMAL(10,2),
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  destaque BOOLEAN NOT NULL DEFAULT false,
  estoque INTEGER NOT NULL DEFAULT 0,
  tags TEXT[],
  especificacoes JSONB DEFAULT '{}',
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. IMAGENS DOS PRODUTOS
CREATE TABLE public.produto_imagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  principal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. RANCHOS (para gerenciar via backend)
CREATE TABLE public.ranchos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  localizacao TEXT NOT NULL,
  capacidade INTEGER NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 5.0,
  quartos INTEGER NOT NULL DEFAULT 0,
  banheiros INTEGER NOT NULL DEFAULT 0,
  area DECIMAL(8,2),
  comodidades TEXT[],
  caracteristicas JSONB DEFAULT '{}',
  disponivel BOOLEAN NOT NULL DEFAULT true,
  destaque BOOLEAN NOT NULL DEFAULT false,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. IMAGENS DOS RANCHOS
CREATE TABLE public.rancho_imagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rancho_id UUID NOT NULL REFERENCES public.ranchos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  principal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. PACOTES DE PESCA (para gerenciar via backend)
CREATE TABLE public.pacotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  duracao TEXT NOT NULL, -- "3 dias / 2 noites"
  pessoas INTEGER NOT NULL DEFAULT 2,
  rating DECIMAL(3,2) NOT NULL DEFAULT 5.0,
  caracteristicas TEXT[],
  inclusos TEXT[],
  ativo BOOLEAN NOT NULL DEFAULT true,
  popular BOOLEAN NOT NULL DEFAULT false,
  destaque BOOLEAN NOT NULL DEFAULT false,
  slug TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL DEFAULT 'pescaria', -- pescaria, hospedagem, completo
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. IMAGENS DOS PACOTES
CREATE TABLE public.pacote_imagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pacote_id UUID NOT NULL REFERENCES public.pacotes(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  principal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. CONFIGURAÇÕES GERAIS DO SITE
CREATE TABLE public.configuracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  valor TEXT,
  tipo TEXT NOT NULL DEFAULT 'text', -- text, number, boolean, json
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranchos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rancho_imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacote_imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PÚBLICAS PARA LEITURA (visitantes do site)
CREATE POLICY "Visitantes podem ver categorias ativas" ON public.categorias FOR SELECT USING (ativo = true);
CREATE POLICY "Visitantes podem ver produtos ativos" ON public.produtos FOR SELECT USING (ativo = true);
CREATE POLICY "Visitantes podem ver imagens de produtos ativos" ON public.produto_imagens FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.produtos WHERE id = produto_id AND ativo = true)
);
CREATE POLICY "Visitantes podem ver ranchos disponíveis" ON public.ranchos FOR SELECT USING (disponivel = true);
CREATE POLICY "Visitantes podem ver imagens de ranchos disponíveis" ON public.rancho_imagens FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.ranchos WHERE id = rancho_id AND disponivel = true)
);
CREATE POLICY "Visitantes podem ver pacotes ativos" ON public.pacotes FOR SELECT USING (ativo = true);
CREATE POLICY "Visitantes podem ver imagens de pacotes ativos" ON public.pacote_imagens FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pacotes WHERE id = pacote_id AND ativo = true)
);
CREATE POLICY "Visitantes podem ver configurações públicas" ON public.configuracoes FOR SELECT USING (true);

-- CRIAR BUCKETS DE STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('produtos', 'produtos', true),
  ('ranchos', 'ranchos', true),
  ('pacotes', 'pacotes', true),
  ('configuracoes', 'configuracoes', true);

-- POLÍTICAS DE STORAGE PÚBLICAS PARA LEITURA
CREATE POLICY "Imagens públicas - produtos" ON storage.objects FOR SELECT USING (bucket_id = 'produtos');
CREATE POLICY "Imagens públicas - ranchos" ON storage.objects FOR SELECT USING (bucket_id = 'ranchos');
CREATE POLICY "Imagens públicas - pacotes" ON storage.objects FOR SELECT USING (bucket_id = 'pacotes');
CREATE POLICY "Imagens públicas - configurações" ON storage.objects FOR SELECT USING (bucket_id = 'configuracoes');

-- FUNÇÃO PARA ATUALIZAR TIMESTAMPS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- TRIGGERS PARA ATUALIZAR TIMESTAMPS
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ranchos_updated_at BEFORE UPDATE ON public.ranchos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pacotes_updated_at BEFORE UPDATE ON public.pacotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- INSERIR CONFIGURAÇÕES INICIAIS
INSERT INTO public.configuracoes (chave, valor, tipo, descricao) VALUES
  ('site_nome', 'Rancho Prado Aqui', 'text', 'Nome do site'),
  ('site_descricao', 'A melhor experiência de pesca no Rio São Francisco', 'text', 'Descrição do site'),
  ('whatsapp_numero', '5534999999999', 'text', 'Número do WhatsApp para contato'),
  ('email_contato', 'contato@ranchopradoaqui.com.br', 'text', 'Email de contato'),
  ('endereco', 'Prado, MG - Rio São Francisco', 'text', 'Endereço do rancho');

-- INSERIR DADOS INICIAIS DOS RANCHOS (baseado nos dados atuais)
INSERT INTO public.ranchos (nome, descricao, localizacao, capacidade, preco, quartos, banheiros, area, comodidades, slug) VALUES
  ('Rancho Principal', 'Rancho completo com vista para o Rio São Francisco, ideal para grupos grandes.', 'Prado, MG - Margem do Rio São Francisco', 12, 450.00, 4, 3, 200.50, 
   ARRAY['WiFi', 'Ar Condicionado', 'Cozinha Completa', 'Churrasqueira', 'Barco', 'Equipamentos de Pesca'], 'rancho-principal'),
  
  ('Rancho Família', 'Perfeito para famílias, com ambiente aconchegante e seguro para crianças.', 'Prado, MG - Rio São Francisco', 8, 320.00, 3, 2, 150.00,
   ARRAY['WiFi', 'Cozinha', 'Área de Lazer', 'Barco', 'Equipamentos de Pesca'], 'rancho-familia'),
   
  ('Rancho Pescador', 'Focado na experiência de pesca, com todos os equipamentos e guias especializados.', 'Prado, MG - Melhor ponto de pesca', 6, 380.00, 2, 2, 120.00,
   ARRAY['Equipamentos de Pesca Premium', 'Guia de Pesca', 'Barco Especializado', 'Isca Viva', 'Cozinha'], 'rancho-pescador');

-- INSERIR DADOS INICIAIS DOS PACOTES (baseado nos dados atuais)
INSERT INTO public.pacotes (nome, descricao, preco, duracao, pessoas, caracteristicas, inclusos, popular, tipo, slug) VALUES
  ('Pacote VIP', 'Experiência premium com todos os luxos e confortos para uma pescaria inesquecível.', 1200.00, '3 dias / 2 noites', 4,
   ARRAY['Rancho Premium', 'Guia Especializado', 'Equipamentos Premium', 'Refeições Gourmet'],
   ARRAY['Hospedagem completa', 'Todas as refeições', 'Equipamentos de pesca', 'Barco e combustível', 'Guia experiente', 'Isca viva'], 
   true, 'completo', 'pacote-vip'),
   
  ('Pacote Luxo', 'Conforto e qualidade com excelente custo-benefício para grupos.', 950.00, '3 dias / 2 noites', 6,
   ARRAY['Rancho Confortável', 'Guia Profissional', 'Equipamentos Completos', 'Refeições Caseiras'],
   ARRAY['Hospedagem', 'Café da manhã e almoço', 'Equipamentos básicos', 'Barco', 'Guia', 'Isca'],
   false, 'completo', 'pacote-luxo'),
   
  ('Pacote Diamante', 'A experiência mais completa e exclusiva que oferecemos.', 2500.00, '5 dias / 4 noites', 2,
   ARRAY['Rancho Exclusivo', 'Guia Master', 'Equipamentos Premium', 'Serviço Completo'],
   ARRAY['Hospedagem VIP', 'Todas as refeições premium', 'Equipamentos top', 'Barco exclusivo', 'Guia especializado', 'Transfer'],
   false, 'completo', 'pacote-diamante');

-- INSERIR CATEGORIAS INICIAIS PARA A LOJA
INSERT INTO public.categorias (nome, descricao, slug, ordem) VALUES
  ('Bonés e Chapéus', 'Bonés e chapéus personalizados do Rancho Prado Aqui', 'bones-chapeus', 1),
  ('Camisetas', 'Camisetas e camisas UV com a marca do rancho', 'camisetas', 2),
  ('Copos e Garrafas', 'Copos térmicos e garrafas personalizadas', 'copos-garrafas', 3),
  ('Equipamentos', 'Equipamentos e acessórios de pesca', 'equipamentos', 4),
  ('Souvenirs', 'Lembranças e produtos personalizados', 'souvenirs', 5);