import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useDamData } from '@/hooks/useDamData';
import { useVideoSettings, extractYouTubeId } from '@/hooks/useVideoSettings';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: weatherData } = useWeatherData();
  const { data: damData } = useDamData();
  const { settings } = useVideoSettings();
  const [showVideo, setShowVideo] = useState(false);



  const videoId = settings?.youtube_video_url 
    ? extractYouTubeId(settings.youtube_video_url)
    : 'cN_BspPR2gg';
  const isShorts = settings?.youtube_video_url?.includes('/shorts/') || false;
  
  const temperature = weatherData?.current.temperature || 24;
  const damLevel = damData?.volume_util_percentual ? parseFloat(damData.volume_util_percentual).toFixed(1) : '86.0';
  const windSpeed = weatherData?.current.wind_speed || 12;
  const conditions = weatherData?.current.weather_description || 'Excelente';

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const sunrise = weatherData?.current.sunrise ? formatTime(weatherData.current.sunrise) : '06:00';
  const sunset = weatherData?.current.sunset ? formatTime(weatherData.current.sunset) : '18:30';

  return <section id="home" className="relative min-h-screen bg-river-gradient flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRINHY0aC00djJoNHY0aDJWNmg0VjRoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] animate-wave"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-white space-y-6 sm:space-y-8 animate-fade-in order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {t('hero.titlePart1', 'Sua Experiência de Pesca no ')}
                <span className="text-sand-beige">{t('hero.titlePart2', 'Rio São Francisco')}</span>
                {t('hero.titlePart3', ' Começa Aqui')}
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed">
                {t('hero.subtitle', 'Ranchos exclusivos, pacotes de pesca completos e informações em tempo real da Represa de Três Marias/MG.')}
              </p>
            </div>


          </div>

          <div className="animate-fade-in order-1 lg:order-2">
            <Card id="live-video-card" className="bg-white bg-opacity-10 backdrop-blur-md border-white border-opacity-20">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-lg sm:text-xl font-semibold">
                      {t('hero.liveTitle')}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs sm:text-sm">LIVE</span>
                    </div>
                  </div>
                  
                  {/* YouTube Facade - loads iframe only on click */}
                  <div className={`${isShorts ? 'aspect-[9/16] max-w-[280px] sm:max-w-xs mx-auto' : 'aspect-video'} bg-black rounded-lg overflow-hidden relative`}>
                    {showVideo ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1`} 
                        title="Vídeo do Rio São Francisco" 
                        className="w-full h-full" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                      />
                    ) : (
                      <button 
                        onClick={() => setShowVideo(true)}
                        className="w-full h-full relative group cursor-pointer"
                        aria-label="Reproduzir vídeo"
                      >
                        <img 
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt="Vídeo do Rio São Francisco"
                          className="w-full h-full object-cover"
                          loading="eager"
                          fetchPriority="high"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white" onClick={() => navigate('/live')}>
                      <Play className="mr-2 h-4 w-4" />
                      {t('hero.liveButton')}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-white text-xs sm:text-sm">
                    <div>
                      <p className="opacity-80">{t('labels.weatherWater')}</p>
                      <p className="font-semibold">{temperature}°C</p>
                    </div>
                    <div>
                      <p className="opacity-80">{t('labels.weatherDam')}</p>
                      <p className="font-semibold">{damLevel}%</p>
                    </div>
                    <div>
                      <p className="opacity-80">{t('labels.weatherConditions')}</p>
                      <p className="font-semibold text-sand-beige capitalize">{t(`conditions.${conditions.toLowerCase()}`, conditions)}</p>
                    </div>
                    <div>
                      <p className="opacity-80">{t('labels.weatherWind')}</p>
                      <p className="font-semibold">{windSpeed} km/h</p>
                    </div>
                    <div>
                      <p className="opacity-80">{t('labels.weatherSunrise')}</p>
                      <p className="font-semibold text-sunset-orange">{sunrise}</p>
                    </div>
                    <div>
                      <p className="opacity-80">{t('labels.weatherSunset')}</p>
                      <p className="font-semibold text-sunset-orange">{sunset}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;