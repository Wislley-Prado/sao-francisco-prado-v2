import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Settings, Shield, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';

const CookieConsent = () => {
  const { 
    showBanner, 
    preferences, 
    acceptAll, 
    rejectOptional, 
    savePreferences,
    setShowBanner 
  } = useCookieConsent();
  
  const [showSettings, setShowSettings] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<CookiePreferences>(preferences);

  if (!showBanner) return null;

  const handleSettingsOpen = () => {
    setTempPreferences(preferences);
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    savePreferences(tempPreferences);
    setShowSettings(false);
  };

  const updateTempPreference = (key: keyof CookiePreferences, value: boolean) => {
    setTempPreferences(prev => ({
      ...prev,
      [key]: key === 'necessary' ? true : value // Necessary cookies cannot be disabled
    }));
  };

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-md border-t shadow-lg">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Cookie className="h-6 w-6 text-rio-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nós usamos cookies
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Usamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo. 
                  Alguns cookies são necessários para o funcionamento do site, enquanto outros nos ajudam a entender 
                  como você interage com nossa plataforma.{' '}
                  <Link 
                    to="/politica-privacidade" 
                    className="text-rio-blue hover:underline font-medium"
                  >
                    Saiba mais sobre nossa política de privacidade
                  </Link>
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBanner(false)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0">
            <Button
              onClick={acceptAll}
              className="bg-rio-blue hover:bg-rio-blue/90 text-white flex-1 sm:flex-initial"
            >
              <Shield className="h-4 w-4 mr-2" />
              Aceitar Todos
            </Button>
            <Button
              variant="outline"
              onClick={handleSettingsOpen}
              className="flex-1 sm:flex-initial"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
            <Button
              variant="ghost"
              onClick={rejectOptional}
              className="flex-1 sm:flex-initial"
            >
              Rejeitar Opcionais
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações de Cookies
            </DialogTitle>
            <DialogDescription>
              Gerencie suas preferências de cookies. Os cookies necessários são sempre ativados para garantir 
              o funcionamento básico do site.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1">
                <Label className="text-base font-medium">Cookies Necessários</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Essenciais para o funcionamento básico do site. Não podem ser desativados.
                </p>
              </div>
              <Switch
                checked={true}
                disabled={true}
                className="data-[state=checked]:bg-rio-blue"
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1">
                <Label className="text-base font-medium">Cookies de Análise</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Nos ajudam a entender como os visitantes interagem com o site através da coleta de informações 
                  de forma anônima.
                </p>
              </div>
              <Switch
                checked={tempPreferences.analytics}
                onCheckedChange={(checked) => updateTempPreference('analytics', checked)}
                className="data-[state=checked]:bg-rio-blue"
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1">
                <Label className="text-base font-medium">Cookies de Marketing</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Usados para rastrear visitantes em sites e exibir anúncios relevantes e envolventes.
                </p>
              </div>
              <Switch
                checked={tempPreferences.marketing}
                onCheckedChange={(checked) => updateTempPreference('marketing', checked)}
                className="data-[state=checked]:bg-rio-blue"
              />
            </div>

            {/* Personalization Cookies */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1">
                <Label className="text-base font-medium">Cookies de Personalização</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Permitem que o site lembre de suas escolhas e forneça recursos aprimorados e personalizados.
                </p>
              </div>
              <Switch
                checked={tempPreferences.personalization}
                onCheckedChange={(checked) => updateTempPreference('personalization', checked)}
                className="data-[state=checked]:bg-rio-blue"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleSaveSettings}
              className="bg-rio-blue hover:bg-rio-blue/90 text-white flex-1"
            >
              Salvar Preferências
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;