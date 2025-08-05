import { useState, useEffect } from 'react';

interface ViewerData {
  currentViewers: number;
  peakViewers: number;
  totalViews: number;
}

export const useViewerCount = () => {
  const [viewerData, setViewerData] = useState<ViewerData>({
    currentViewers: 127,
    peakViewers: 205,
    totalViews: 1847
  });

  useEffect(() => {
    const getTimeBasedRange = () => {
      const hour = new Date().getHours();
      
      // Horários de pico (manhã e tarde)
      if ((hour >= 6 && hour <= 10) || (hour >= 14 && hour <= 18)) {
        return { min: 150, max: 220 };
      }
      // Horários normais
      else if (hour >= 11 && hour <= 13) {
        return { min: 120, max: 180 };
      }
      // Horários baixos (madrugada e noite)
      else {
        return { min: 85, max: 140 };
      }
    };

    const updateViewerCount = () => {
      setViewerData(prev => {
        const range = getTimeBasedRange();
        const baseVariation = Math.random() * (range.max - range.min) + range.min;
        const smallFluctuation = (Math.random() - 0.5) * 20; // ±10 pessoas
        
        let newViewers = Math.round(baseVariation + smallFluctuation);
        
        // Ocasionalmente criar picos especiais
        if (Math.random() < 0.05) { // 5% chance
          newViewers += Math.round(Math.random() * 50 + 30); // +30 a +80
        }
        
        // Garantir valores mínimos
        newViewers = Math.max(newViewers, 75);
        
        // Atualizar pico se necessário
        const newPeak = Math.max(prev.peakViewers, newViewers);
        
        // Incrementar visualizações totais gradualmente
        const viewsIncrement = Math.round(Math.random() * 3) + 1;
        
        return {
          currentViewers: newViewers,
          peakViewers: newPeak,
          totalViews: prev.totalViews + viewsIncrement
        };
      });
    };

    // Atualização inicial
    updateViewerCount();
    
    // Atualizar a cada 20-35 segundos
    const interval = setInterval(() => {
      updateViewerCount();
    }, Math.random() * 15000 + 20000); // 20-35 segundos

    return () => clearInterval(interval);
  }, []);

  return viewerData;
};