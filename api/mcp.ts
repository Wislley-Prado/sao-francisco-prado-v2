import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com fallback seguro usando Service Role Key para permitir inserção no blog
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pradoaqui.vendopro.com.br';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MTUwNTA4MDAsCiAgImV4cCI6IDE4NzI4MTcyMDAKfQ.Yl30TXhhTdohurjkqf3tU76Ow-jWJhqvn7A1qmWAkdw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Chave secreta opcional para proteger o endpoint
const MCP_SECRET = process.env.MCP_SECRET || '';

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

// Definição das ferramentas MCP expostas para o Gemini
const TOOLS = [
  {
    name: 'criar_post_blog',
    description: 'Cria e salva um novo artigo no blog do portal PradoAqui (sobre pesca, Rio São Francisco, turismo, dicas, notícias ou equipamentos). Pode ser salvo como rascunho para revisão ou publicado imediatamente.',
    inputSchema: {
      type: 'object',
      properties: {
        titulo: {
          type: 'string',
          description: 'Título atrativo, engajador e otimizado para SEO do artigo'
        },
        conteudo: {
          type: 'string',
          description: 'Conteúdo completo do artigo formatado em HTML limpo (usar <h2>, <h3>, <p>, <ul>, <li>, <strong>, etc.)'
        },
        resumo: {
          type: 'string',
          description: 'Resumo curto de 1 a 2 parágrafos apresentando o tema e atraindo o leitor'
        },
        categoria: {
          type: 'string',
          description: 'Categoria do artigo. Exemplos: Pesca Esportiva, Dicas de Pesca, Guias, Rio São Francisco, Represa de Três Marias, Ecoturismo, Notícias'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lista de tags ou palavras-chave relacionadas (ex: ["dourado", "rio sao francisco", "tres marias"])'
        },
        imagem_destaque: {
          type: 'string',
          description: 'URL de uma imagem de capa para o post (opcional)'
        },
        publicado: {
          type: 'boolean',
          description: 'Se true, publica o post imediatamente no site. Se false, salva como rascunho para você revisar no painel /admin/blog antes de ir ao ar (Recomendado: false)'
        }
      },
      required: ['titulo', 'conteudo', 'resumo', 'categoria']
    }
  },
  {
    name: 'listar_posts_recentes',
    description: 'Retorna a lista dos últimos artigos publicados ou em rascunho no blog PradoAqui. Útil para consultar os temas já abordados e evitar repetições.',
    inputSchema: {
      type: 'object',
      properties: {
        limite: {
          type: 'number',
          description: 'Quantidade de posts a retornar (padrão: 5, máximo: 20)'
        }
      }
    }
  },
  {
    name: 'listar_categorias',
    description: 'Lista todas as categorias de artigos atualmente utilizadas no blog PradoAqui.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'buscar_post_por_slug',
    description: 'Busca um artigo completo do blog pelo seu slug para consulta ou referência.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'O slug (identificador de URL) do artigo'
        }
      },
      required: ['slug']
    }
  }
];

export default async function handler(req: any, res: any) {
  // Configuração CORS permissiva para clientes MCP (Gemini, Claude, Cursor, etc.)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificação de autenticação se MCP_SECRET estiver configurado
  if (MCP_SECRET) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '') || req.query?.token;
    if (token !== MCP_SECRET) {
      return res.status(401).json({ error: 'Não autorizado. Token inválido.' });
    }
  }

  // 1. Conexão SSE (Server-Sent Events) - Handshake do Gemini MCP
  const acceptHeader = req.headers['accept'] || '';
  const isSseRequest = acceptHeader.includes('text/event-stream') || req.query?.sse === 'true';

  if (req.method === 'GET' && isSseRequest) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const sessionId = Math.random().toString(36).substring(2, 15);
    // Notifica o endpoint para onde o Gemini deve enviar as chamadas POST
    res.write(`event: endpoint\ndata: /api/mcp?sessionId=${sessionId}\n\n`);

    // Mantém a conexão aberta com ping
    const interval = setInterval(() => {
      res.write(': ping\n\n');
    }, 15000);

    req.on('close', () => {
      clearInterval(interval);
    });

    return;
  }

  // 2. Visita pelo navegador (Página informativa com status)
  if (req.method === 'GET') {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>PradoAqui - Servidor MCP Blog Agent</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
          .card { background: #1e293b; border-radius: 12px; padding: 24px; border: 1px solid #334155; margin-top: 20px; }
          .badge { background: #10b981; color: white; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 12px; display: inline-block; }
          pre { background: #090d16; padding: 12px; border-radius: 8px; overflow-x: auto; color: #38bdf8; }
          code { font-family: monospace; }
        </style>
      </head>
      <body>
        <h1><span class="badge">ONLINE</span> PradoAqui Blog Agent (MCP)</h1>
        <p>Servidor MCP ativo e pronto para conectar ao <strong>Google Gemini</strong>.</p>
        
        <div class="card">
          <h3>Como conectar no Gemini Spark / Apps:</h3>
          <ol>
            <li>Acesse <code>gemini.google.com/apps</code></li>
            <li>Cole a URL abaixo no campo de app personalizada:</li>
          </ol>
          <pre>${req.headers.host ? `https://${req.headers.host}/api/mcp` : 'https://seu-dominio.vercel.app/api/mcp'}</pre>
        </div>

        <div class="card">
          <h3>Ferramentas disponíveis para o Gemini:</h3>
          <ul>
            <li><code>criar_post_blog</code>: Cria um post com título, conteúdo em HTML, resumo e categoria.</li>
            <li><code>listar_posts_recentes</code>: Permite o Gemini consultar os posts já publicados.</li>
            <li><code>listar_categorias</code>: Lista categorias disponíveis.</li>
            <li><code>buscar_post_por_slug</code>: Busca o conteúdo de um post específico.</li>
          </ul>
        </div>
      </body>
      </html>
    `);
  }

  // 3. Processamento de mensagens JSON-RPC (POST)
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null });
      }
    }

    const { method, params, id } = body || {};

    // Handshake: initialize
    if (method === 'initialize') {
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'PradoAqui Blog Agent',
            version: '1.0.0'
          }
        }
      });
    }

    // Notificação: notifications/initialized
    if (method === 'notifications/initialized') {
      return res.status(200).json({ jsonrpc: '2.0' });
    }

    // Ping
    if (method === 'ping') {
      return res.status(200).json({ jsonrpc: '2.0', id, result: {} });
    }

    // Listar ferramentas: tools/list
    if (method === 'tools/list') {
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS
        }
      });
    }

    // Execução de ferramenta: tools/call
    if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};

      try {
        // FERRAMENTA 1: criar_post_blog
        if (toolName === 'criar_post_blog') {
          const { titulo, conteudo, resumo, categoria, tags = [], imagem_destaque, publicado = false } = args;

          if (!titulo || !conteudo || !resumo || !categoria) {
            return res.status(200).json({
              jsonrpc: '2.0',
              id,
              result: {
                isError: true,
                content: [{ type: 'text', text: 'Erro: Os campos titulo, conteudo, resumo e categoria são obrigatórios.' }]
              }
            });
          }

          // Gerar slug único
          let baseSlug = slugify(titulo);
          let slug = baseSlug;
          let counter = 1;

          while (true) {
            const { data: existing } = await supabase
              .from('blog_posts')
              .select('id')
              .eq('slug', slug)
              .maybeSingle();

            if (!existing) break;
            slug = `${baseSlug}-${counter++}`;
          }

          // Inserir post no Supabase
          const { data: post, error } = await supabase
            .from('blog_posts')
            .insert({
              titulo,
              slug,
              conteudo,
              resumo,
              categoria,
              tags: Array.isArray(tags) ? tags : [],
              imagem_destaque: imagem_destaque || null,
              publicado: Boolean(publicado),
              data_publicacao: new Date().toISOString()
            })
            .select()
            .single();

          if (error) {
            console.error('Erro ao inserir no Supabase:', error);
            return res.status(200).json({
              jsonrpc: '2.0',
              id,
              result: {
                isError: true,
                content: [{ type: 'text', text: `Erro ao salvar no banco de dados: ${error.message}` }]
              }
            });
          }

          const statusText = publicado ? 'Publicado no ar' : 'Salvo como Rascunho (acesse /admin/blog para revisar e publicar)';
          const urlPublica = `https://pradoaqui.com.br/blog/${slug}`;

          return res.status(200).json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `✅ Artigo criado com sucesso no PradoAqui!\n\n📌 Título: ${titulo}\n🔗 Slug: ${slug}\n📂 Categoria: ${categoria}\n📝 Status: ${statusText}\n🌐 Link de visualização: ${urlPublica}\n\nVocê pode revisar ou trocar a imagem pelo painel em https://pradoaqui.com.br/admin/blog`
                }
              ]
            }
          });
        }

        // FERRAMENTA 2: listar_posts_recentes
        if (toolName === 'listar_posts_recentes') {
          const limit = Math.min(Number(args.limite) || 5, 20);
          const { data: posts, error } = await supabase
            .from('blog_posts')
            .select('id, titulo, slug, categoria, publicado, created_at')
            .order('created_at', { ascending: false })
            .limit(limit);

          if (error) {
            return res.status(200).json({
              jsonrpc: '2.0',
              id,
              result: {
                isError: true,
                content: [{ type: 'text', text: `Erro ao buscar posts: ${error.message}` }]
              }
            });
          }

          const lista = (posts || []).map(p => 
            `- "${p.titulo}" | Categoria: ${p.categoria} | Status: ${p.publicado ? 'Publicado' : 'Rascunho'} | Slug: ${p.slug}`
          ).join('\n');

          return res.status(200).json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `Últimos ${posts?.length || 0} artigos no blog PradoAqui:\n\n${lista}`
                }
              ]
            }
          });
        }

        // FERRAMENTA 3: listar_categorias
        if (toolName === 'listar_categorias') {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('categoria');

          if (error) {
            return res.status(200).json({
              jsonrpc: '2.0',
              id,
              result: {
                isError: true,
                content: [{ type: 'text', text: `Erro ao buscar categorias: ${error.message}` }]
              }
            });
          }

          const categoriasPadrao = [
            'Pesca Esportiva',
            'Dicas de Pesca',
            'Rio São Francisco',
            'Represa de Três Marias',
            'Guias',
            'Ranchos',
            'Ecoturismo',
            'Notícias',
            'Equipamentos',
            'Pousadas'
          ];

          const categoriasExistentes = Array.from(
            new Set([...categoriasPadrao, ...(data || []).map(d => d.categoria).filter(Boolean)])
          );

          return res.status(200).json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `Categorias disponíveis no blog PradoAqui:\n\n${categoriasExistentes.map(c => `• ${c}`).join('\n')}`
                }
              ]
            }
          });
        }

        // FERRAMENTA 4: buscar_post_por_slug
        if (toolName === 'buscar_post_por_slug') {
          const { slug } = args;
          const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

          if (error || !post) {
            return res.status(200).json({
              jsonrpc: '2.0',
              id,
              result: {
                isError: true,
                content: [{ type: 'text', text: `Artigo com slug "${slug}" não encontrado.` }]
              }
            });
          }

          return res.status(200).json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `Artigo: "${post.titulo}"\nCategoria: ${post.categoria}\nStatus: ${post.publicado ? 'Publicado' : 'Rascunho'}\nResumo: ${post.resumo}\n\nConteúdo:\n${post.conteudo}`
                }
              ]
            }
          });
        }

        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            isError: true,
            content: [{ type: 'text', text: `Ferramenta "${toolName}" não reconhecida.` }]
          }
        });
      } catch (err: any) {
        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            isError: true,
            content: [{ type: 'text', text: `Erro interno ao executar a ferramenta: ${err?.message || err}` }]
          }
        });
      }
    }

    return res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32601, message: `Método '${method}' não suportado.` },
      id
    });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
