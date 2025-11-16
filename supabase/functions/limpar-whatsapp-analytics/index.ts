import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Não autorizado')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Não autorizado')
    }

    // Verificar se é admin
    const { data: roleData, error: roleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' })

    if (roleError || !roleData) {
      console.error('Erro ao verificar role:', roleError)
      throw new Error('Acesso negado - apenas administradores')
    }

    const { tipo, dataInicio, dataFim, diasAntigos } = await req.json()

    console.log('Iniciando limpeza de dados:', { tipo, dataInicio, dataFim, diasAntigos })

    let deleteQuery = supabase.from('whatsapp_analytics').delete()
    let countQuery = supabase.from('whatsapp_analytics').select('id', { count: 'exact', head: true })

    if (tipo === 'periodo' && dataInicio && dataFim) {
      deleteQuery = deleteQuery.gte('created_at', dataInicio).lte('created_at', dataFim)
      countQuery = countQuery.gte('created_at', dataInicio).lte('created_at', dataFim)
    } else if (tipo === 'antigos' && diasAntigos) {
      const dataLimite = new Date()
      dataLimite.setDate(dataLimite.getDate() - diasAntigos)
      const dataLimiteISO = dataLimite.toISOString()
      
      deleteQuery = deleteQuery.lt('created_at', dataLimiteISO)
      countQuery = countQuery.lt('created_at', dataLimiteISO)
    } else if (tipo === 'tudo') {
      // Sem filtros, deleta tudo
    } else {
      throw new Error('Tipo de limpeza inválido')
    }

    // Contar quantos registros serão deletados
    const { count } = await countQuery

    // Executar o DELETE
    const { error: deleteError } = await deleteQuery

    if (deleteError) {
      console.error('Erro ao deletar registros:', deleteError)
      throw new Error('Erro ao limpar dados: ' + deleteError.message)
    }

    console.log('Limpeza concluída:', { registrosDeletados: count })

    return new Response(
      JSON.stringify({
        success: true,
        registrosDeletados: count || 0,
        timestamp: new Date().toISOString(),
        mensagem: `${count || 0} registros excluídos com sucesso!`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro na função limpar-whatsapp-analytics:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor',
        success: false
      }),
      { 
        status: error.message.includes('autorizado') || error.message.includes('Acesso negado') ? 403 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
