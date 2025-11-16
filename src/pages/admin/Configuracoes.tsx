import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Code2, TrendingUp } from 'lucide-react';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

const Configuracoes = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    facebook_pixel: '',
    google_analytics: '',
    google_tag_manager: '',
    custom_head_scripts: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', SETTINGS_ID)
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          facebook_pixel: data.facebook_pixel || '',
          google_analytics: data.google_analytics || '',
          google_tag_manager: data.google_tag_manager || '',
          custom_head_scripts: data.custom_head_scripts || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', SETTINGS_ID);

      if (error) throw error;

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações de Tracking</h1>
        <p className="text-muted-foreground mt-1">
          Configure códigos de rastreamento globais para todo o site
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Pixels e Analytics
            </CardTitle>
            <CardDescription>
              Configure Facebook Pixel, Google Analytics e Google Tag Manager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_pixel">Facebook Pixel ID</Label>
              <Input
                id="facebook_pixel"
                placeholder="Ex: 1234567890123456"
                value={settings.facebook_pixel}
                onChange={(e) => setSettings({ ...settings, facebook_pixel: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Cole apenas o ID do pixel (números)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_analytics">Google Analytics ID (GA4)</Label>
              <Input
                id="google_analytics"
                placeholder="Ex: G-XXXXXXXXXX"
                value={settings.google_analytics}
                onChange={(e) => setSettings({ ...settings, google_analytics: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Measurement ID do Google Analytics 4
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_tag_manager">Google Tag Manager ID</Label>
              <Input
                id="google_tag_manager"
                placeholder="Ex: GTM-XXXXXXX"
                value={settings.google_tag_manager}
                onChange={(e) => setSettings({ ...settings, google_tag_manager: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Container ID do Google Tag Manager
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Scripts Personalizados
            </CardTitle>
            <CardDescription>
              Adicione scripts personalizados que serão inseridos no &lt;head&gt; do site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="custom_head_scripts">Scripts Personalizados</Label>
              <Textarea
                id="custom_head_scripts"
                placeholder="<script>&#10;  // Seu código aqui&#10;</script>"
                value={settings.custom_head_scripts}
                onChange={(e) => setSettings({ ...settings, custom_head_scripts: e.target.value })}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Cole scripts completos incluindo as tags &lt;script&gt;
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;