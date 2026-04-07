import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('ERRO: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ranchos = [
    {
        nome: "Rancho Reserva Prado",
        slug: "rancho-reserva-prado",
        descricao: "Conforto, Diversão e Natureza às margens do Rio São Francisco. Descubra o encanto de Três Marias e viva uma experiência única de pesca e lazer.",
        localizacao: "Três Marias/MG",
        latitude: -18.1288,
        longitude: -45.2028,
        preco: 115.00,
        capacidade: 15,
        quartos: 5,
        banheiros: 6,
        area: 1500,
        destaque: true,
        comodidades: ["WiFi", "Área de Lazer", "Cozinha Completa", "Churrasqueira"],
        images: [
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/575c601e-1c46-42e2-b406-bf2d1a3fe785/796a31fc-60ef-479e-a3b3-e1654154e14f.png?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/575c601e-1c46-42e2-b406-bf2d1a3fe785/4ea82bd6-3b43-4051-ae15-f72b2d54991d.png?width=800&quality=80"
        ]
    },
    {
        nome: "Rancho Beira Rio 5",
        slug: "Rancho-Beira-Rio-5",
        descricao: "Descubra o encanto de Três Marias: Alugue um rancho à beira do rio e viva essa experiência!",
        localizacao: "Três Marias/MG",
        latitude: -18.1671,
        longitude: -45.2380,
        preco: 97.00,
        capacidade: 10,
        quartos: 4,
        banheiros: 5,
        area: 1500,
        destaque: false,
        comodidades: ["Piscina", "Área de Lazer", "Cozinha Completa", "Churrasqueira"],
        images: [
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/433222e4-2a7f-403b-9b69-e6ee9effa23c/67a0919a-af58-426b-80fb-0f51c6128120.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/433222e4-2a7f-403b-9b69-e6ee9effa23c/528aa85c-f978-4fbe-b4de-dee87eff8b09.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/433222e4-2a7f-403b-9b69-e6ee9effa23c/9e597574-343b-4816-b6fb-05c4ca57d1f4.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/433222e4-2a7f-403b-9b69-e6ee9effa23c/522f2236-7ff6-485b-8647-4ecac9db00a3.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/433222e4-2a7f-403b-9b69-e6ee9effa23c/20f43334-bb6e-4bbd-ac31-f6d422073b3a.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/433222e4-2a7f-403b-9b69-e6ee9effa23c/14052ffa-57a2-4e46-9147-50639891467e.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/433222e4-2a7f-403b-9b69-e6ee9effa23c/c6a6cf9d-0c51-47ae-9e83-19c7d84277ec.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/433222e4-2a7f-403b-9b69-e6ee9effa23c/42fe0e65-f4ad-4b51-9bcc-8edca7573020.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/433222e4-2a7f-403b-9b69-e6ee9effa23c/099e350f-0043-477e-be63-f15b2dea9ce7.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/433222e4-2a7f-403b-9b69-e6ee9effa23c/70e64c57-fc4d-44fb-aff8-5261d0549968.jpg?width=800&quality=80"
        ]
    },
    {
        nome: "Rancho Prado Aldeia",
        slug: "rancho-aldeia-dos-dourados",
        descricao: "Rancho Aldeia: descanso, pesca top, piscina privativa e natureza pertim do São Francisco. Tranquilidade, conforto e exclusividade pra você amigos e familiares !",
        localizacao: "Três Marias/MG",
        latitude: -18.1580,
        longitude: -45.2245,
        preco: 68.90,
        capacidade: 8,
        quartos: 4,
        banheiros: 3,
        area: 550,
        destaque: false,
        comodidades: ["WiFi", "Piscina", "Área de Lazer", "Cozinha Completa", "Churrasqueira"],
        images: [
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/2e6136fb-0d4e-4602-a358-28e23309e6ca/a690f962-c75a-478d-9eec-1c959fbb2783.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/2e6136fb-0d4e-4602-a358-28e23309e6ca/719315f7-db26-4715-90dc-f2b0bcc0c794.png?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/2e6136fb-0d4e-4602-a358-28e23309e6ca/4a1e49a6-081b-4202-ac80-8a9c469928eb.png?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/2e6136fb-0d4e-4602-a358-28e23309e6ca/a23ee3e4-853a-4620-be7d-0f190b2927d2.png?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/2e6136fb-0d4e-4602-a358-28e23309e6ca/c39461ab-ed7c-4bd7-94a9-0de7ab3b98bf.jpg?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/2e6136fb-0d4e-4602-a358-28e23309e6ca/d6681be2-78f4-457f-bfee-e5804ced4ba1.png?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/2e6136fb-0d4e-4602-a358-28e23309e6ca/9896b735-f755-4dde-9d1e-6da21f61bda9.png?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/2e6136fb-0d4e-4602-a358-28e23309e6ca/699f585b-3797-47a9-81b2-4724cb7e5e12.png?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/2e6136fb-0d4e-4602-a358-28e23309e6ca/04a80e76-2ac2-4c27-8126-13300b92044d.png?width=800&quality=80",
            "https://zeqloqlhnbdeivnyghkx.supabase.co/storage/v1/render/image/public/ranchos/2e6136fb-0d4e-4602-a358-28e23309e6ca/fb2a3bee-e008-4cc6-b237-da52bc644531.jpg?width=800&quality=80"
        ]
    }
];

async function populateRanchos() {
    console.log('--- Iniciando Migração de Ranchos ---');

    for (const item of ranchos) {
        const { images, ...ranchoData } = item;

        console.log(`Inserindo/Atualizando Rancho: ${ranchoData.nome}...`);

        // Inserir Rancho
        const { data: rancho, error: ranchoError } = await supabase
            .from('ranchos')
            .upsert(ranchoData, { onConflict: 'slug' })
            .select()
            .single();

        if (ranchoError) {
            console.error(`Erro ao inserir rancho ${ranchoData.nome}:`, ranchoError.message);
            continue;
        }

        console.log(`✅ Rancho ${ranchoData.nome} atualizado (ID: ${rancho.id})`);

        // Inserir Imagens
        for (const [index, imageUrl] of images.entries()) {
            const { data: existingImage } = await supabase
                .from('rancho_imagens')
                .select('id')
                .eq('rancho_id', rancho.id)
                .eq('url', imageUrl)
                .maybeSingle();

            if (existingImage) {
                console.log(`ℹ️ Imagem ${index + 1} já existe para ${rancho.nome}, pulando.`);
                continue;
            }

            const imageData = {
                rancho_id: rancho.id,
                url: imageUrl,
                alt_text: `${rancho.nome} - Imagem ${index + 1}`,
                ordem: index + 1,
                principal: index === 0
            };

            const { error: imageError } = await supabase
                .from('rancho_imagens')
                .insert(imageData);

            if (imageError) {
                console.warn(`Aviso: Erro ao inserir imagem ${index + 1} para ${rancho.nome}:`, imageError.message);
            } else {
                console.log(`✅ Imagem ${index + 1} vinculada para ${rancho.nome}`);
            }
        }
    }

    console.log('--- Migração Concluída ---');
}

populateRanchos().catch(console.error);
