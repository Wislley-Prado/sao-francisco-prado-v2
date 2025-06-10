
import React, { useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DamData } from '@/types/damData';
import { getStatusFromLevel } from '@/utils/damStatus';

interface DamLevelCardProps {
  damData: DamData | undefined;
  dataUpdatedAt: number;
  renderCount: number;
}

const DamLevelCard: React.FC<DamLevelCardProps> = ({
  damData,
  dataUpdatedAt,
  renderCount
}) => {
  const currentLevel = damData?.volume_util_percentual ? parseFloat(damData.volume_util_percentual) : 82;
  const nivelAtualMetros = damData?.nivel_atual ? parseFloat(damData.nivel_atual) : 569.8;
  const levelStatus = getStatusFromLevel(currentLevel);

  // Usar useMemo para garantir que os dados do gráfico sejam recalculados quando damData mudar
  const trendData = useMemo(() => {
    console.log('📊 [CHART] === RECALCULANDO DADOS DO GRÁFICO ===');
    console.log('📊 [CHART] damData existe?', !!damData);
    console.log('📊 [CHART] historico_dias existe?', !!damData?.historico_dias);
    console.log('📊 [CHART] historico_dias length:', damData?.historico_dias?.length || 0);
    console.log('📊 [CHART] dataUpdatedAt:', new Date(dataUpdatedAt).toISOString());
    console.log('📊 [CHART] renderCount:', renderCount);
    
    if (!damData?.historico_dias || damData.historico_dias.length === 0) {
      console.log('⚠️ [CHART] Sem dados de histórico, retornando array vazio');
      return [];
    }

    console.log('📊 [CHART] Dados brutos do histórico:', damData.historico_dias);

    // Ordenar os dados por data (mais recente primeiro) e pegar os últimos 7 dias
    const sortedData = [...damData.historico_dias]
      .sort((a, b) => new Date(b.dia).getTime() - new Date(a.dia).getTime())
      .slice(0, 7) // Pegar os 7 mais recentes
      .reverse(); // Inverter para mostrar cronologicamente (mais antigo para mais recente)

    console.log('📊 [CHART] Dados ordenados (últimos 7 dias):', sortedData);

    const chartData = sortedData.map((dia, index) => {
      console.log(`📊 [CHART] Processando dia ${index + 1}:`, dia);
      
      const dataFormatada = new Date(dia.dia).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
      const nivel = parseFloat(dia.vol_util_final) || 0;
      const aflData = parseFloat(dia.vazao_afl) || 0;
      const defData = parseFloat(dia.vazao_def) || 0;
      
      console.log(`📈 [CHART] Dia ${index + 1}: ${dataFormatada} - Nível: ${nivel}%, Afl: ${aflData}, Def: ${defData}`);
      
      return {
        time: dataFormatada,
        nivel: nivel,
        afluencia: aflData,
        defluencia: defData,
        dataCompleta: dia.dia
      };
    });

    console.log('✅ [CHART] Dados finais do gráfico processados:', chartData);
    console.log('✅ [CHART] Período do gráfico: de', chartData[0]?.dataCompleta, 'até', chartData[chartData.length - 1]?.dataCompleta);
    console.log('✅ [CHART] === FIM DO RECÁLCULO ===');
    return chartData;
  }, [damData?.historico_dias, dataUpdatedAt, renderCount]);

  // Log quando trendData mudar
  useEffect(() => {
    console.log('📊 [CHART] trendData MUDOU! Nova length:', trendData.length);
    console.log('📊 [CHART] Novos dados:', trendData);
    console.log('📊 [CHART] Timestamp da mudança:', new Date().toISOString());
    if (trendData.length > 0) {
      console.log('📊 [CHART] Período atualizado: de', trendData[0]?.dataCompleta, 'até', trendData[trendData.length - 1]?.dataCompleta);
    }
  }, [trendData]);

  // Criar uma chave única para forçar re-render do gráfico
  const chartKey = `chart-${dataUpdatedAt}-${trendData.length}-${renderCount}`;
  console.log('🔑 [CHART] Chart key gerada:', chartKey);

  return (
    <Card className="h-full border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-base sm:text-lg">
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span>Nível da Represa</span>
          </div>
          <Badge className={`${levelStatus.color} text-white text-xs sm:text-sm`}>
            {levelStatus.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Nível em metros */}
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              {nivelAtualMetros.toFixed(1)}m
            </div>
            <div className="text-sm text-gray-600 mb-3">
              Cota atual: {nivelAtualMetros.toFixed(1)} metros
            </div>
            
            {/* Volume útil percentual */}
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
              {currentLevel.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mb-3">Volume útil</div>
            
            <Progress value={currentLevel} className="h-3 mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Gráfico de Tendência com dados reais */}
          {trendData.length > 0 && (
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-700 mb-3">
                Tendência Últimos 7 Dias - {trendData.length} registros - Atualizado: {new Date(dataUpdatedAt).toLocaleTimeString('pt-BR')}
              </h5>
              <div className="h-24 sm:h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={trendData} 
                    key={chartKey}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="time" 
                      fontSize={10}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      fontSize={10}
                      stroke="#6b7280"
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      formatter={(value, name) => [
                        `${value}${name === 'nivel' ? '%' : ' m³/s'}`,
                        name === 'nivel' ? 'Nível' : name === 'afluencia' ? 'Afluência' : 'Defluência'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="nivel" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Período: {trendData[0]?.dataCompleta} até {trendData[trendData.length - 1]?.dataCompleta} | Key={chartKey}
              </div>
            </div>
          )}

          {trendData.length === 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Aguardando dados históricos...</p>
              <div className="text-xs text-gray-400 mt-1">
                Debug: historico_dias length = {damData?.historico_dias?.length || 0}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DamLevelCard;
