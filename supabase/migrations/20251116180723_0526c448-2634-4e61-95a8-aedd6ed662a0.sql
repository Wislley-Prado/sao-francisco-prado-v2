-- Criar tabela de FAQs
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de depoimentos
CREATE TABLE public.depoimentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  foto_url TEXT,
  depoimento TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT rating_check CHECK (rating >= 1 AND rating <= 5)
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depoimentos ENABLE ROW LEVEL SECURITY;

-- Políticas para FAQs
CREATE POLICY "Visitantes podem ver FAQs ativos"
ON public.faqs FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins podem gerenciar FAQs"
ON public.faqs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para depoimentos
CREATE POLICY "Visitantes podem ver depoimentos ativos"
ON public.depoimentos FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins podem gerenciar depoimentos"
ON public.depoimentos FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at em FAQs
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para updated_at em depoimentos
CREATE TRIGGER update_depoimentos_updated_at
BEFORE UPDATE ON public.depoimentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir 10 FAQs de exemplo
INSERT INTO public.faqs (pergunta, resposta, ordem, ativo) VALUES
('Como faço para reservar um pacote de pesca?', 'Você pode reservar clicando no botão "Reservar Agora" em qualquer pacote ou entrando em contato pelo WhatsApp. Nossa equipe irá auxiliá-lo com toda a documentação necessária.', 1, true),
('Qual é a melhor época para pescar dourado no Rio São Francisco?', 'A melhor época é entre maio e outubro, quando o nível do rio está mais baixo e os peixes estão mais ativos. O período da piracema (novembro a fevereiro) é proibido por lei.', 2, true),
('Os equipamentos de pesca estão inclusos nos pacotes?', 'Nossos pacotes incluem equipamentos básicos de pesca. Para equipamentos profissionais especializados, recomendamos trazer os seus ou consultar sobre locação de equipamentos premium.', 3, true),
('Posso levar minha família? Os pacotes são adequados para iniciantes?', 'Sim! Temos pacotes para todos os níveis, desde iniciantes até pescadores experientes. Famílias são muito bem-vindas e oferecemos atividades para todas as idades.', 4, true),
('Qual é a política de cancelamento?', 'Cancelamentos com até 15 dias de antecedência têm reembolso total. Entre 7 e 14 dias, 50% de reembolso. Menos de 7 dias, não há reembolso, exceto em casos de força maior.', 5, true),
('Os ranchos possuem internet e energia elétrica?', 'Sim, todos os nossos ranchos possuem energia elétrica. Internet Wi-Fi está disponível na maioria, mas a conexão pode variar conforme a localização. Consulte as especificações de cada rancho.', 6, true),
('Preciso de licença para pescar?', 'Sim, é obrigatória a licença de pesca amadora. Podemos auxiliá-lo no processo de obtenção através do site do IBAMA ou app "Pesca Amadora".', 7, true),
('Qual é o tamanho mínimo de captura do dourado?', 'O tamanho mínimo para captura do dourado no Rio São Francisco é de 55cm. Recomendamos sempre o pesque-e-solte para preservação das espécies.', 8, true),
('As refeições estão incluídas nos pacotes?', 'Depende do pacote escolhido. Os pacotes VIP e Diamante incluem todas as refeições. O pacote Luxo pode incluir café da manhã. Verifique os detalhes de cada pacote.', 9, true),
('Como chegar aos ranchos? Vocês oferecem transporte?', 'Fornecemos indicações detalhadas para cada rancho. Transfer do aeroporto pode ser contratado à parte. A maioria dos ranchos é acessível por veículos comuns.', 10, true);

-- Inserir 6 depoimentos de exemplo
INSERT INTO public.depoimentos (nome, cargo, depoimento, rating, ordem, ativo) VALUES
('João Silva', 'Pescador Esportivo - São Paulo', 'Experiência incrível! Capturei meu primeiro dourado de 8kg. A estrutura do rancho é excelente e os guias são muito profissionais. Com certeza voltarei!', 5, 1, true),
('Carlos Mendes', 'Empresário - Belo Horizonte', 'Levei minha família e todos adoraram. Além da pesca, as crianças aproveitaram muito as atividades no rancho. Atendimento nota 10!', 5, 2, true),
('Ricardo Santos', 'Engenheiro - Brasília', 'Melhor pescaria da minha vida! Os guias conhecem os melhores pontos e a comida é sensacional. Já estou planejando a próxima viagem.', 5, 3, true),
('Paulo Oliveira', 'Médico - Rio de Janeiro', 'Pacote VIP superou todas as expectativas. Conforto, boa pesca e paisagens deslumbrantes. Vale cada centavo!', 5, 4, true),
('Fernando Costa', 'Advogado - Curitiba', 'Organização impecável, desde a reserva até o retorno. Pesquei vários dourados e a experiência foi memorável.', 5, 5, true),
('André Pereira', 'Arquiteto - Salvador', 'Excelente custo-benefício. O rancho é confortável, os barcos bem equipados e a hospitalidade é genuína. Recomendo muito!', 5, 6, true);