
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Erro: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function populateData() {
    console.log('Iniciando povoamento de dados...');

    // 1. FAQs
    const faqs = [
        { pergunta: 'Como faço para reservar um pacote de pesca?', resposta: 'Você pode reservar clicando no botão "Reservar Agora" em qualquer pacote ou entrando em contato pelo WhatsApp. Nossa equipe irá auxiliá-lo com toda a documentação necessária.', ordem: 1, ativo: true },
        { pergunta: 'Qual é a melhor época para pescar dourado no Rio São Francisco?', resposta: 'A melhor época é entre maio e outubro, quando o nível do rio está mais baixo e os peixes estão mais ativos. O período da piracema (novembro a fevereiro) é proibido por lei.', ordem: 2, ativo: true },
        { pergunta: 'Os equipamentos de pesca estão inclusos nos pacotes?', resposta: 'Nossos pacotes incluem equipamentos básicos de pesca. Para equipamentos profissionais especializados, recomendamos trazer os seus ou consultar sobre locação de equipamentos premium.', ordem: 3, ativo: true },
        { pergunta: 'Posso levar minha família? Os pacotes são adequados para iniciantes?', resposta: 'Sim! Temos pacotes para todos os níveis, desde iniciantes até pescadores experientes. Famílias são muito bem-vindas e oferecemos atividades para todas as idades.', ordem: 4, ativo: true },
        { pergunta: 'Qual é a política de cancelamento?', resposta: 'Cancelamentos com até 15 dias de antecedência têm reembolso total. Entre 7 e 14 dias, 50% de reembolso. Menos de 7 dias, não há reembolso, exceto em casos de força maior.', ordem: 5, ativo: true },
        { pergunta: 'Os ranchos possuem internet e energia elétrica?', resposta: 'Sim, todos os nossos ranchos possuem energia elétrica. Internet Wi-Fi está disponível na maioria, mas a conexão pode variar conforme a localização. Consulte as especificações de cada rancho.', ordem: 6, ativo: true },
        { pergunta: 'Preciso de licença para pescar?', resposta: 'Sim, é obrigatória a licença de pesca amadora. Podemos auxiliá-lo no processo de obtenção através do site do IBAMA ou app "Pesca Amadora".', ordem: 7, ativo: true },
        { pergunta: 'Qual é o tamanho mínimo de captura do dourado?', resposta: 'O tamanho mínimo para captura do dourado no Rio São Francisco é de 55cm. Recomendamos sempre o pesque-e-solte para preservação das espécies.', ordem: 8, ativo: true },
        { pergunta: 'As refeições estão incluídas nos pacotes?', resposta: 'Depende do pacote escolhido. Os pacotes VIP e Diamante incluem todas as refeições. O pacote Luxo pode incluir café da manhã. Verifique os detalhes de cada pacote.', ordem: 9, ativo: true },
        { pergunta: 'Como chegar aos ranchos? Vocês oferecem transporte?', resposta: 'Fornecemos indicações detalhadas para cada rancho. Transfer do aeroporto pode ser contratado à parte. A maioria dos ranchos é acessível por veículos comuns.', ordem: 10, ativo: true },
    ];

    console.log('Inserindo FAQs...');
    const { error: faqError } = await supabase.from('faqs').insert(faqs);
    if (faqError) {
        console.error('Erro ao inserir FAQs:', faqError);
    } else {
        console.log('FAQs inseridas com sucesso!');
    }

    // 2. Depoimentos
    const depoimentos = [
        { nome: 'João Silva', cargo: 'Pescador Esportivo - São Paulo', depoimento: 'Experiência incrível! Capturei meu primeiro dourado de 8kg. A estrutura do rancho é excelente e os guias são muito profissionais. Com certeza voltarei!', rating: 5, ordem: 1, ativo: true },
        { nome: 'Carlos Mendes', cargo: 'Empresário - Belo Horizonte', depoimento: 'Levei minha família e todos adoraram. Além da pesca, as crianças aproveitaram muito as atividades no rancho. Atendimento nota 10!', rating: 5, ordem: 2, ativo: true },
        { nome: 'Ricardo Santos', cargo: 'Engenheiro - Brasília', depoimento: 'Melhor pescaria da minha vida! Os guias conhecem os melhores pontos e a comida é sensacional. Já estou planejando a próxima viagem.', rating: 5, ordem: 3, ativo: true },
        { nome: 'Paulo Oliveira', cargo: 'Médico - Rio de Janeiro', depoimento: 'Pacote VIP superou todas as expectativas. Conforto, boa pesca e paisagens deslumbrantes. Vale cada centavo!', rating: 5, ordem: 4, ativo: true },
        { nome: 'Fernando Costa', cargo: 'Advogado - Curitiba', depoimento: 'Organização impecável, desde a reserva até o retorno. Pesquisei vários dourados e a experiência foi memorável.', rating: 5, ordem: 5, ativo: true },
        { nome: 'André Pereira', cargo: 'Arquiteto - Salvador', depoimento: 'Excelente custo-benefício. O rancho é confortável, os barcos bem equipados e a hospitalidade é genuína. Recomendo muito!', rating: 5, ordem: 6, ativo: true },
    ];

    console.log('Inserindo depoimentos...');
    const { error: depoimentoError } = await supabase.from('depoimentos').insert(depoimentos);
    if (depoimentoError) {
        console.error('Erro ao inserir depoimentos:', depoimentoError);
    } else {
        console.log('Depoimentos inseridos com sucesso!');
    }

    console.log('Processo finalizado!');
}

populateData();
