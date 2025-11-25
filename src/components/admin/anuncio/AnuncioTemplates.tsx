import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Zap, Building2, Megaphone, Gift, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  nome: string;
  descricao: string;
  icon: React.ComponentType<{ className?: string }>;
  categoria: string;
  config: {
    tipo: string;
    posicao: string;
    duracao_exibicao: number;
    ordem: number;
    texto_botao: string;
  };
  preview: {
    cores: string;
    exemplo: string;
  };
}

interface AnuncioTemplatesProps {
  onSelectTemplate: (config: Template['config']) => void;
  selectedTemplate?: string;
}

const templates: Template[] = [
  {
    id: 'promocao-flash',
    nome: 'Promoção Flash',
    descricao: 'Para ofertas urgentes e descontos por tempo limitado',
    icon: Zap,
    categoria: 'promocional',
    config: {
      tipo: 'banner_principal',
      posicao: 'topo',
      duracao_exibicao: 5,
      ordem: 0,
      texto_botao: 'Aproveitar Agora',
    },
    preview: {
      cores: 'bg-gradient-to-r from-red-500 to-orange-500',
      exemplo: 'Banner impactante com urgência visual',
    },
  },
  {
    id: 'institucional',
    nome: 'Institucional',
    descricao: 'Para comunicados da empresa e valores da marca',
    icon: Building2,
    categoria: 'institucional',
    config: {
      tipo: 'full_width',
      posicao: 'meio',
      duracao_exibicao: 12,
      ordem: 5,
      texto_botao: 'Saiba Mais',
    },
    preview: {
      cores: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      exemplo: 'Layout elegante e profissional',
    },
  },
  {
    id: 'lancamento',
    nome: 'Lançamento de Produto',
    descricao: 'Destaque para novos produtos ou serviços',
    icon: Megaphone,
    categoria: 'lancamento',
    config: {
      tipo: 'card_secundario',
      posicao: 'meio',
      duracao_exibicao: 10,
      ordem: 3,
      texto_botao: 'Conhecer',
    },
    preview: {
      cores: 'bg-gradient-to-r from-purple-600 to-pink-600',
      exemplo: 'Card com foto e descrição detalhada',
    },
  },
  {
    id: 'evento-especial',
    nome: 'Evento Especial',
    descricao: 'Para anunciar eventos, webinars ou datas comemorativas',
    icon: Gift,
    categoria: 'evento',
    config: {
      tipo: 'banner_principal',
      posicao: 'topo',
      duracao_exibicao: 8,
      ordem: 1,
      texto_botao: 'Participar',
    },
    preview: {
      cores: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      exemplo: 'Banner festivo com call-to-action forte',
    },
  },
  {
    id: 'venda-sazonal',
    nome: 'Venda Sazonal',
    descricao: 'Para campanhas de Natal, Black Friday, etc',
    icon: TrendingUp,
    categoria: 'promocional',
    config: {
      tipo: 'banner_principal',
      posicao: 'topo',
      duracao_exibicao: 7,
      ordem: 0,
      texto_botao: 'Ver Ofertas',
    },
    preview: {
      cores: 'bg-gradient-to-r from-amber-500 to-red-600',
      exemplo: 'Banner temático com elementos sazonais',
    },
  },
  {
    id: 'conteudo-informativo',
    nome: 'Conteúdo Informativo',
    descricao: 'Para blog posts, guias e materiais educativos',
    icon: Clock,
    categoria: 'conteudo',
    config: {
      tipo: 'card_secundario',
      posicao: 'rodape',
      duracao_exibicao: 15,
      ordem: 10,
      texto_botao: 'Ler Mais',
    },
    preview: {
      cores: 'bg-gradient-to-r from-slate-600 to-gray-700',
      exemplo: 'Card discreto com foco no conteúdo',
    },
  },
];

const categoriaLabels: Record<string, { label: string; color: string }> = {
  promocional: { label: 'Promocional', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  institucional: { label: 'Institucional', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  lancamento: { label: 'Lançamento', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  evento: { label: 'Evento', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  conteudo: { label: 'Conteúdo', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
};

export function AnuncioTemplates({ onSelectTemplate, selectedTemplate }: AnuncioTemplatesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Templates de Anúncios</CardTitle>
        <CardDescription>
          Escolha um template pré-configurado para começar rapidamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const Icon = template.icon;
            const categoria = categoriaLabels[template.categoria];
            const isSelected = selectedTemplate === template.id;

            return (
              <Card
                key={template.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md relative',
                  isSelected && 'ring-2 ring-primary shadow-lg'
                )}
                onClick={() => onSelectTemplate(template.config)}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={cn('p-2 rounded-lg', template.preview.cores)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <Badge variant="outline" className={cn('text-xs', categoria.color)}>
                      {categoria.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.nome}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.descricao}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Preview visual */}
                  <div className={cn('h-20 rounded-md', template.preview.cores, 'flex items-center justify-center')}>
                    <span className="text-white text-xs font-medium text-center px-4">
                      {template.preview.exemplo}
                    </span>
                  </div>

                  {/* Configurações */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">
                        {template.config.tipo === 'banner_principal' && 'Banner Principal'}
                        {template.config.tipo === 'card_secundario' && 'Card Secundário'}
                        {template.config.tipo === 'full_width' && 'Largura Total'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Posição:</span>
                      <span className="font-medium capitalize">{template.config.posicao}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Duração:</span>
                      <span className="font-medium">{template.config.duracao_exibicao}s</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Botão:</span>
                      <span className="font-medium truncate">{template.config.texto_botao}</span>
                    </div>
                  </div>

                  {/* Botão de seleção */}
                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(template.config);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Selecionado
                      </>
                    ) : (
                      'Usar Template'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Dicas de uso:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Promoções rápidas</strong>: Use durações curtas (5-7s) para criar urgência</li>
            <li>• <strong>Conteúdo institucional</strong>: Use durações longas (12-15s) para leitura completa</li>
            <li>• <strong>Posição topo</strong>: Melhor para anúncios de alta prioridade</li>
            <li>• <strong>Cards secundários</strong>: Ideais para múltiplos produtos ou serviços</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
