-- Inserir posts de exemplo no blog
INSERT INTO blog_posts (
  titulo,
  slug,
  resumo,
  conteudo,
  categoria,
  tags,
  imagem_destaque,
  publicado,
  data_publicacao,
  visualizacoes
) VALUES 
(
  'Melhores Técnicas de Pesca no Rio São Francisco',
  'melhores-tecnicas-pesca-rio-sao-francisco',
  'Descubra as técnicas mais eficazes para pescar no Velho Chico, desde iscas naturais até equipamentos recomendados pelos pescadores experientes.',
  '<h2>Técnicas Fundamentais para o Rio São Francisco</h2><p>O Rio São Francisco, carinhosamente chamado de Velho Chico, é um dos principais destinos de pesca esportiva do Brasil. Com suas águas que cortam diversos estados, o rio oferece uma variedade de espécies e desafios para pescadores de todos os níveis.</p><h3>1. Pesca de Dourado</h3><p>O dourado é considerado o rei do São Francisco. Para pescá-lo com sucesso:</p><ul><li><strong>Iscas naturais:</strong> Tuvira, lambari e piaus são as mais eficientes</li><li><strong>Iscas artificiais:</strong> Plugs de meia água e hélices funcionam muito bem</li><li><strong>Equipamento:</strong> Varas de ação média-pesada de 6 a 7 pés, linhas de 20 a 30 lb</li><li><strong>Horários:</strong> Amanhecer e entardecer são os melhores períodos</li></ul><h3>2. Pesca de Surubim</h3><p>O surubim é outro peixe muito procurado no Velho Chico:</p><ul><li><strong>Técnica:</strong> Pesca de fundo é a mais indicada</li><li><strong>Iscas:</strong> Filés de peixe, especialmente de piaus</li><li><strong>Local:</strong> Procure poços fundos e corredeiras</li><li><strong>Equipamento:</strong> Varas pesadas e linhas reforçadas</li></ul><h3>3. Pesca de Piau</h3><p>Excelente para pescadores iniciantes:</p><ul><li><strong>Isca:</strong> Massa, minhoca e pequenos insetos</li><li><strong>Equipamento leve:</strong> Varas de 5 a 6 pés com linhas de 8 a 12 lb</li><li><strong>Técnica:</strong> Pesca com boia ou fundo</li></ul><h3>4. Equipamentos Essenciais</h3><p>Todo pescador no São Francisco deve ter:</p><ul><li>Alicate de contenção</li><li>Kit de primeiros socorros</li><li>Protetor solar e chapéu</li><li>Isqueiro para queimar a ponta da linha</li><li>Puçá (rede de pesca)</li></ul><h3>Dicas Importantes</h3><p><strong>Respeite o período de defeso:</strong> A pesca é proibida durante a piracema para preservação das espécies.</p><p><strong>Pratique pesque e solte:</strong> Contribua para a sustentabilidade do rio.</p><p><strong>Contrate guias locais:</strong> Eles conhecem os melhores pontos e técnicas da região.</p>',
  'Técnicas',
  ARRAY['pesca', 'técnicas', 'dourado', 'equipamentos', 'rio são francisco'],
  '/src/assets/blog/dicas-de-pesca.jpg',
  true,
  '2024-05-15 10:00:00',
  245
),
(
  'Calendário Lunar da Pesca: Como as Fases da Lua Influenciam',
  'calendario-lunar-pesca-fases-lua',
  'Confira as melhores fases da lua para pescar e maximize suas chances de uma pescaria de sucesso no Rio São Francisco.',
  '<h2>A Influência da Lua na Pesca</h2><p>A lua exerce grande influência sobre a atividade dos peixes. Entender o calendário lunar pode fazer a diferença entre uma pescaria produtiva e um dia sem capturas.</p><h3>Lua Nova</h3><p><strong>Atividade:</strong> Alta</p><p>Durante a lua nova, os peixes tendem a se alimentar mais intensamente. É um dos melhores períodos para pesca, especialmente nas primeiras horas da manhã e no final da tarde.</p><ul><li>Peixes mais ativos durante o dia todo</li><li>Excelente para pesca de superfície</li><li>Dourados e surubins muito ativos</li></ul><h3>Lua Crescente</h3><p><strong>Atividade:</strong> Moderada a Alta</p><p>A transição da lua nova para cheia traz boas oportunidades:</p><ul><li>Peixes se alimentam regularmente</li><li>Bom período para todas as técnicas</li><li>Atividade aumenta à medida que se aproxima da lua cheia</li></ul><h3>Lua Cheia</h3><p><strong>Atividade:</strong> Muito Alta</p><p>A lua cheia é o melhor momento para pescar, mas requer estratégia:</p><ul><li>Peixes se alimentam intensamente à noite</li><li>Durante o dia, podem estar mais inativos</li><li>Pescarias noturnas são muito produtivas</li><li>Ideal para grandes predadores como dourado e surubim</li></ul><h3>Lua Minguante</h3><p><strong>Atividade:</strong> Moderada</p><p>A atividade dos peixes diminui gradualmente:</p><ul><li>Melhores horários: amanhecer e entardecer</li><li>Peixes mais seletivos com iscas</li><li>Requer mais paciência e técnica</li></ul><h3>Dicas Práticas</h3><p><strong>Marés e Lua:</strong> No São Francisco, a influência lunar é sentida através das correntes e do nível da água.</p><p><strong>Planeje com antecedência:</strong> Consulte o calendário lunar antes de agendar sua pescaria.</p><p><strong>Combine fatores:</strong> Lua favorável + condições climáticas boas = pescaria excelente!</p>',
  'Lunar',
  ARRAY['lua', 'calendário', 'dicas', 'fases da lua', 'melhor época'],
  '/src/assets/blog/fases-da-lua.jpg',
  true,
  '2024-08-12 08:30:00',
  312
),
(
  'Espécies de Peixes: Dourado do São Francisco',
  'especies-peixes-dourado-sao-francisco',
  'Conheça tudo sobre o dourado, o rei dos peixes do São Francisco, seus hábitos, melhores iscas e locais para encontrá-lo.',
  '<h2>O Rei do Rio São Francisco</h2><p>O dourado (Salminus brasiliensis) é considerado o peixe mais nobre do Rio São Francisco. Conhecido por sua força, agressividade e beleza, atrai pescadores de todo o Brasil.</p><h3>Características do Dourado</h3><ul><li><strong>Tamanho:</strong> Pode alcançar até 1 metro de comprimento</li><li><strong>Peso:</strong> Exemplares de 5 a 15 kg são comuns, podendo chegar a 25 kg</li><li><strong>Cor:</strong> Corpo dourado com reflexos alaranjados</li><li><strong>Dentição:</strong> Dentes afiados e poderosos</li></ul><h3>Hábitos e Comportamento</h3><p><strong>Alimentação:</strong></p><ul><li>Predador voraz que se alimenta principalmente de outros peixes</li><li>Caça ativamente em corredeiras e remansos</li><li>Mais ativo durante amanhecer e entardecer</li></ul><p><strong>Habitat:</strong></p><ul><li>Prefere águas correntes e oxigenadas</li><li>Encontrado em corredeiras, cachoeiras e remansos</li><li>Busca águas mais profundas nos dias quentes</li></ul><h3>Melhores Iscas para Dourado</h3><p><strong>Iscas Naturais:</strong></p><ul><li><strong>Tuvira:</strong> A isca preferida dos pescadores experientes</li><li><strong>Lambari:</strong> Muito eficiente quando pescado na hora</li><li><strong>Piaus:</strong> Funcionam bem em águas mais calmas</li></ul><p><strong>Iscas Artificiais:</strong></p><ul><li><strong>Plugs de meia água:</strong> Imitam peixes feridos</li><li><strong>Hélices:</strong> Causam grande alvoroço na superfície</li><li><strong>Jigs:</strong> Para pesca mais profunda</li><li><strong>Colheres:</strong> Eficientes em corredeiras</li></ul><h3>Técnicas de Captura</h3><p><strong>Equipamento Recomendado:</strong></p><ul><li>Vara de ação média-pesada, 6 a 7 pés</li><li>Carretilha ou molinete com capacidade para linha de 20-30 lb</li><li>Linha multifilamento para maior sensibilidade</li><li>Líder de aço ou fluorocarbono resistente</li></ul><p><strong>Dicas de Briga:</strong></p><ul><li>O dourado é conhecido por saltos espetaculares</li><li>Mantenha a vara alta durante os saltos</li><li>Não force a recolhida, deixe o peixe cansar</li><li>Use puçá para finalizar a captura com segurança</li></ul><h3>Conservação</h3><p>O dourado é uma espécie que precisa de nossa proteção:</p><ul><li><strong>Pratique pesque e solte</strong></li><li><strong>Respeite o tamanho mínimo de captura</strong></li><li><strong>Não pesque durante a piracema</strong></li><li><strong>Use anzóis sem farpa</strong> para facilitar a soltura</li></ul>',
  'Espécies',
  ARRAY['dourado', 'espécies', 'peixes', 'técnicas', 'iscas'],
  '/src/assets/blog/dourado-gigante.jpg',
  true,
  '2024-08-08 14:00:00',
  428
),
(
  'Regulamentação da Pesca em 2024: O Que Você Precisa Saber',
  'regulamentacao-pesca-2024',
  'Fique por dentro das novas regras de pesca, períodos de defeso e licenças necessárias para pescar no Rio São Francisco.',
  '<h2>Legislação de Pesca Atualizada</h2><p>Conhecer e respeitar a legislação é fundamental para a preservação dos recursos pesqueiros e para evitar multas e penalidades.</p><h3>Licença de Pesca Amadora</h3><p>Todo pescador precisa estar licenciado:</p><ul><li><strong>Onde tirar:</strong> Sistema online do IBAMA ou Ministério da Pesca</li><li><strong>Validade:</strong> 1 ano a partir da emissão</li><li><strong>Custo:</strong> Varia conforme a categoria (gratuita para alguns grupos)</li><li><strong>Obrigatoriedade:</strong> Necessária para pescar em qualquer corpo de água</li></ul><h3>Período de Defeso (Piracema) 2024</h3><p><strong>Datas:</strong> 1º de novembro a 28 de fevereiro</p><p>Durante este período:</p><ul><li>Pesca proibida em todo o Rio São Francisco</li><li>Proteção da reprodução das espécies</li><li>Multas pesadas para infratores</li><li>Fiscalização intensificada</li></ul><h3>Cotas e Limites</h3><p><strong>Pesca Amadora:</strong></p><ul><li><strong>Quantidade:</strong> Máximo de 10 kg + 1 exemplar por dia</li><li><strong>Transporte:</strong> Limite de 15 kg durante o trajeto</li><li><strong>Armazenamento:</strong> Até 30 kg no local de residência</li></ul><p><strong>Tamanhos Mínimos:</strong></p><ul><li><strong>Dourado:</strong> 55 cm</li><li><strong>Surubim:</strong> 60 cm</li><li><strong>Piau:</strong> 25 cm</li><li><strong>Matrinxã:</strong> 30 cm</li></ul><h3>Petrechos Permitidos</h3><p><strong>Permitidos:</strong></p><ul><li>Vara, linha e anzol (sem restrição de quantidade)</li><li>Molinete ou carretilha</li><li>Iscas naturais e artificiais</li><li>Puçá (rede de mão)</li></ul><p><strong>Proibidos:</strong></p><ul><li>Redes de qualquer tipo</li><li>Espinhéis com mais de 10 anzóis</li><li>Aparelhos de respiração artificial</li><li>Explosivos, venenos ou substâncias tóxicas</li><li>Luz artificial para atração de peixes</li></ul><h3>Áreas Protegidas</h3><p>Algumas áreas do Rio São Francisco têm restrições especiais:</p><ul><li><strong>Unidades de Conservação:</strong> Regras específicas para cada área</li><li><strong>Próximo a barragens:</strong> Geralmente proibido até 200m</li><li><strong>Áreas indígenas:</strong> Necessária autorização especial</li></ul><h3>Penalidades</h3><p>O descumprimento pode resultar em:</p><ul><li>Multas de R$ 700 a R$ 100.000</li><li>Apreensão de equipamentos</li><li>Apreensão do pescado</li><li>Processos criminais em casos graves</li></ul><h3>Pesque e Solte</h3><p>Incentivamos fortemente a prática de pesque e solte:</p><ul><li>Contribui para a sustentabilidade</li><li>Mantém os estoques pesqueiros</li><li>Garante a pesca para futuras gerações</li><li>Use anzóis sem farpa</li><li>Manuseie os peixes com cuidado</li></ul><p><strong>Lembre-se:</strong> A fiscalização é constante. Mantenha sempre sua licença em mãos e respeite todas as normas!</p>',
  'Regulamentação',
  ARRAY['regras', 'legislação', 'defeso', 'licença', 'ibama'],
  '/src/assets/blog/regulamentacao-pesca.png',
  true,
  '2024-08-05 09:00:00',
  567
)
ON CONFLICT (slug) DO NOTHING;