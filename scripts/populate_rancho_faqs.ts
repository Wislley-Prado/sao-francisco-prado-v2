// Script to populate Rancho-specific FAQs into Supabase
import { supabase } from '@/integrations/supabase/client';

interface FAQEntry {
    pergunta: string;
    resposta: string;
    ordem: number;
}

interface RanchoFAQData {
    slug: string;
    faqs: FAQEntry[];
}

const ranchoFaqs: RanchoFAQData[] = [
    {
        slug: 'rancho-reserva-prado',
        faqs: [
            { pergunta: 'Horário de check-in ?', resposta: 'O check‑in pode ser feito a partir das 14h.', ordem: 1 },
            { pergunta: 'Preciso de licença de pesca?', resposta: 'Sim, é necessário possuir licença estadual de pesca.', ordem: 2 },
            { pergunta: 'Quantas pessoas acomoda?', resposta: 'O rancho comporta até 12 pessoas.', ordem: 3 },
            { pergunta: 'Quantos km do centro de Três Marias?', resposta: 'Aproximadamente 12 km.', ordem: 4 },
            { pergunta: 'Como funciona a internet?', resposta: 'Internet Wi‑Fi com sinal de até 30 Mbps nas áreas comuns.', ordem: 5 },
            { pergunta: 'Como é a piscina?', resposta: 'Piscina natural com borda infinita e vista para o rio.', ordem: 6 },
            { pergunta: '💰💰💰-por que alugar um rancho vale mais a pena que pousada?', resposta: 'Você tem privacidade total, espaço para churrasco e pesca livre.', ordem: 7 },
            { pergunta: 'Crianças pagam?', resposta: 'Crianças até 12 anos não pagam.', ordem: 8 },
            { pergunta: 'Tem barcos disponíveis?', answer: 'Sim, disponibilizamos barcos de pesca e caiaque.', ordem: 9 },
            { pergunta: 'Supermercado perto?', resposta: 'O supermercado mais próximo fica a 5 km.', ordem: 10 },
        ],
    },
    {
        slug: 'rancho-beira-rio-5',
        faqs: [
            { pergunta: '🎣 Preciso de licença de pesca?', resposta: 'Sim, a licença é obrigatória para a prática.', ordem: 1 },
            { pergunta: 'POR QUE ALUGAR UM RANCHO VALE MAIS A PENA QUE POUSADA?', resposta: 'Você tem liberdade total para usar o terreno e a pesca.', ordem: 2 },
            { pergunta: '🧳 O que preciso levar?', resposta: 'Roupas de banho, protetor solar, repelente e equipamentos de pesca.', ordem: 3 },
            { pergunta: '🎣 Como é o tablado privativo?', resposta: 'Tablado de madeira com acesso direto ao rio.', ordem: 4 },
            { pergunta: '📍 Fica do outro lado da ponte?', resposta: 'Sim, o rancho está localizado na margem oposta da ponte principal.', ordem: 5 },
            { pergunta: '🐶 Posso levar meu animal de estimação?', resposta: 'Animais são permitidos mediante aviso prévio.', ordem: 6 },
            { pergunta: '📶 Tem internet?', resposta: 'Wi‑Fi disponível nas áreas comuns.', ordem: 7 },
            { pergunta: '🏠 É uma pousada?', resposta: 'Não, é um rancho privado com estrutura completa.', ordem: 8 },
            { pergunta: '📅 Como faço a reserva?', resposta: 'A reserva pode ser feita pelo site ou contato direto.', ordem: 9 },
            { pergunta: '🏆 A Reserva é Exclusiva ?', resposta: 'Sim, a reserva garante exclusividade total do espaço.', ordem: 10 },
            { pergunta: '💰- TABELA DE DIÁRIAS 2026 - RANCHO BEIRA RIO 5', resposta: 'Consulte a tabela de preços no site para valores atualizados.', ordem: 11 },
        ],
    },
    {
        slug: 'rancho-aldeia-dos-dourados',
        faqs: [
            { pergunta: 'Pergunta exemplo 1?', resposta: 'Resposta exemplo 1.', ordem: 1 },
            { pergunta: 'Pergunta exemplo 2?', resposta: 'Resposta exemplo 2.', ordem: 2 },
            // Add the remaining FAQs here as needed
        ],
    },
];

async function populateFAQs() {
    for (const entry of ranchoFaqs) {
        const { data: rancho, error: ranchoErr } = await supabase
            .from('ranchos')
            .select('id')
            .eq('slug', entry.slug)
            .single();
        if (ranchoErr || !rancho) {
            console.error(`Rancho não encontrado para slug ${entry.slug}:`, ranchoErr);
            continue;
        }
        const ranchoId = (rancho as any).id;
        for (const faq of entry.faqs) {
            const { error } = await supabase.from('faqs').insert({
                pergunta: faq.pergunta,
                resposta: faq.resposta,
                ordem: faq.ordem,
                ativo: true,
                rancho_id: ranchoId,
            });
            if (error) console.error('Erro ao inserir FAQ:', error);
        }
        console.log(`FAQs inseridas para rancho ${entry.slug}`);
    }
}

populateFAQs()
    .then(() => console.log('Migração de FAQs concluída'))
    .catch((e) => console.error('Erro geral:', e));
