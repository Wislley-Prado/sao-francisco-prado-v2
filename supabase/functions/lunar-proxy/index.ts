import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🌙 [LUNAR PROXY] Buscando dados da FarmSense API...');
    
    // Buscar dados da API FarmSense
    const response = await fetch('https://api.farmsense.net/v1/moonphases/?d=1', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`FarmSense API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🌙 [LUNAR PROXY] Dados recebidos:', JSON.stringify(data));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
      },
    });

  } catch (error) {
    console.error('🌙 [LUNAR PROXY] Erro:', error);
    
    // Fallback: calcular fase lunar localmente
    const lunarData = calculateLunarPhase();
    
    return new Response(JSON.stringify([{ moon: lunarData }]), {
      status: 200,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Fallback': 'true'
      },
    });
  }
});

// Cálculo astronômico preciso da fase lunar
function calculateLunarPhase() {
  const now = new Date();
  const currentTimestamp = now.getTime();
  
  // Lua Nova de referência: 29 de janeiro de 2026 às 12:36 UTC
  const referenceNewMoon = new Date('2026-01-29T12:36:00Z').getTime();
  
  // Ciclo lunar sinódico preciso em dias
  const lunarCycle = 29.530588853;
  const lunarCycleMs = lunarCycle * 24 * 60 * 60 * 1000;
  
  // Calcular idade da lua em dias
  const msSinceReference = currentTimestamp - referenceNewMoon;
  const daysSinceReference = msSinceReference / (24 * 60 * 60 * 1000);
  const ageInDays = daysSinceReference % lunarCycle;
  
  // Calcular iluminação (0-1)
  const illumination = (1 - Math.cos(2 * Math.PI * ageInDays / lunarCycle)) / 2;
  
  // Determinar nome da fase
  let phaseName: string;
  if (ageInDays < 1.85) {
    phaseName = 'New Moon';
  } else if (ageInDays < 7.38) {
    phaseName = 'Waxing Crescent';
  } else if (ageInDays < 9.22) {
    phaseName = 'First Quarter';
  } else if (ageInDays < 14.77) {
    phaseName = 'Waxing Gibbous';
  } else if (ageInDays < 16.61) {
    phaseName = 'Full Moon';
  } else if (ageInDays < 22.14) {
    phaseName = 'Waning Gibbous';
  } else if (ageInDays < 23.98) {
    phaseName = 'Last Quarter';
  } else if (ageInDays < 27.68) {
    phaseName = 'Waning Crescent';
  } else {
    phaseName = 'New Moon';
  }
  
  // Calcular próximas fases
  const daysToNextNewMoon = lunarCycle - ageInDays;
  const daysToFirstQuarter = (7.38 - ageInDays + lunarCycle) % lunarCycle;
  const daysToFullMoon = (14.77 - ageInDays + lunarCycle) % lunarCycle;
  const daysToLastQuarter = (22.14 - ageInDays + lunarCycle) % lunarCycle;
  
  const nextNewMoon = new Date(currentTimestamp + daysToNextNewMoon * 24 * 60 * 60 * 1000);
  const nextFirstQuarter = new Date(currentTimestamp + daysToFirstQuarter * 24 * 60 * 60 * 1000);
  const nextFullMoon = new Date(currentTimestamp + daysToFullMoon * 24 * 60 * 60 * 1000);
  const nextLastQuarter = new Date(currentTimestamp + daysToLastQuarter * 24 * 60 * 60 * 1000);
  
  // Distância média da lua em km (com variação sinusoidal)
  const distance = 384400 + Math.sin(2 * Math.PI * ageInDays / lunarCycle) * 21000;
  
  console.log(`🌙 [LUNAR CALC] Idade: ${ageInDays.toFixed(2)} dias, Fase: ${phaseName}, Iluminação: ${(illumination * 100).toFixed(1)}%`);
  
  return {
    phase_name: phaseName,
    illumination: illumination,
    age: ageInDays,
    distance: Math.round(distance),
    angular_diameter: 0.5,
    sun_distance: 149600000,
    next_new_moon: nextNewMoon.toISOString(),
    next_full_moon: nextFullMoon.toISOString(),
    next_first_quarter: nextFirstQuarter.toISOString(),
    next_last_quarter: nextLastQuarter.toISOString()
  };
}
