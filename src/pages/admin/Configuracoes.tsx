import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Code2, TrendingUp, Webhook, AlertCircle, RefreshCw, Database, Clock, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

const Configuracoes = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    facebook_pixel: '',
    google_analytics: '',
    google_tag_manager: '',
    custom_head_scripts: '',
    dam_webhook_url: '',
    autor_avatar_url: ''
  });

  useEffect(() => {
    fetchSettings();
    fetchLastDamUpdate();
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
          custom_head_scripts: data.custom_head_scripts || '',
          dam_webhook_url: (data as any).dam_webhook_url || '',
          autor_avatar_url: (data as any).autor_avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const fetchLastDamUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('dam_data')
        .select('updated_at')
        .eq('id', 1)
        .single();

      if (!error && data?.updated_at) {
        setLastUpdate(data.updated_at);
      }
    } catch (error) {
      console.log('Sem dados da represa ainda');
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

  const handleRefreshDamData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('https://zeqloqlhnbdeivnyghkx.supabase.co/functions/v1/dam-data-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar dados');
      }

      const data = await response.json();
      
      if (data.saved_to_db) {
        toast.success('Dados da represa atualizados com sucesso!');
        setLastUpdate(new Date().toISOString());
      } else {
        toast.warning('Dados recebidos mas não salvos no banco');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados da represa:', error);
      toast.error('Erro ao atualizar dados da represa. Verifique se o workflow n8n está ativo.');
    } finally {
      setRefreshing(false);
    }
  };

  const formatLastUpdate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <Webhook className="w-5 h-5" />
              Integrações Externas
            </CardTitle>
            <CardDescription>
              Configure URLs de webhooks e integrações com sistemas externos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dam_webhook_url">URL do Webhook da Represa (n8n)</Label>
              <Input
                id="dam_webhook_url"
                placeholder="https://webhook.exemplo.com/webhook/represa"
                value={settings.dam_webhook_url}
                onChange={(e) => setSettings({ ...settings, dam_webhook_url: e.target.value })}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                URL do webhook n8n que retorna os dados da represa de Três Marias
              </p>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Importante:</strong> O workflow no n8n deve estar <strong>ativo</strong> para funcionar. 
                Ative usando o toggle no canto superior direito do editor do n8n.
              </AlertDescription>
            </Alert>

            {/* Seção de Dados da Represa */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Dados da Represa no Banco</span>
                </div>
                {lastUpdate && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Atualizado: {formatLastUpdate(lastUpdate)}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefreshDamData}
                  disabled={refreshing}
                  className="flex items-center gap-2"
                >
                  {refreshing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Atualizar Agora
                    </>
                  )}
                </Button>
                <span className="text-xs text-muted-foreground">
                  Força uma atualização imediata dos dados da represa
                </span>
              </div>

              <Alert className="mt-4">
                <Database className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Os dados são atualizados automaticamente <strong>4x ao dia</strong> (06h, 12h, 18h, 00h).
                  Use o botão acima apenas para atualizações emergenciais.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Avatar do Autor (PradoAqui)
            </CardTitle>
            <CardDescription>
              Configure a imagem do avatar que aparece nos posts do blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="autor_avatar_url">URL do Avatar</Label>
              <Input
                id="autor_avatar_url"
                placeholder="https://exemplo.com/avatar.jpg"
                value={settings.autor_avatar_url}
                onChange={(e) => setSettings({ ...settings, autor_avatar_url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                URL da imagem do avatar do PradoAqui (recomendado: 100x100px)
              </p>
            </div>
            {settings.autor_avatar_url && (
              <div className="flex items-center gap-3">
                <img 
                  src={settings.autor_avatar_url} 
                  alt="Preview do avatar" 
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <span className="text-sm text-muted-foreground">Preview do avatar</span>
              </div>
            )}
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
