import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, MapPin, Ruler, DollarSign } from 'lucide-react';
import { useAnuncios, Anuncio } from '@/hooks/useOptimizedData';
import { getOptimizedUrl } from '@/lib/imageUtils';

interface SidebarAnunciosProps {
    className?: string;
    limit?: number;
}

const viewedAdsSession = new Set<string>();

export const SidebarAnuncios = ({ className = '', limit = 3 }: SidebarAnunciosProps) => {
    const { data: anuncios = [], isLoading } = useAnuncios('sidebar');

    const registerView = useCallback(async (anuncio: Anuncio) => {
        if (viewedAdsSession.has(anuncio.id)) return;
        viewedAdsSession.add(anuncio.id);

        try {
            await supabase
                .from('anuncios')
                .update({ visualizacoes: (anuncio.visualizacoes || 0) + 1 })
                .eq('id', anuncio.id);
        } catch (error) {
            console.error('Erro ao registrar visualização:', error);
        }
    }, []);

    useEffect(() => {
        if (anuncios.length > 0 && !isLoading) {
            anuncios.slice(0, limit).forEach(anuncio => {
                registerView(anuncio);
            });
        }
    }, [anuncios, isLoading, limit, registerView]);

    const registerClick = async (anuncio: Anuncio) => {
        try {
            await supabase
                .from('anuncios')
                .update({ cliques: (anuncio.cliques || 0) + 1 })
                .eq('id', anuncio.id);
        } catch (error) {
            console.error('Erro ao registrar clique:', error);
        }
    };

    if (isLoading) {
        return (
            <div className={`space-y-4 ${className}`}>
                {[1, 2].map((i) => (
                    <Skeleton key={i} className="w-full h-[250px] rounded-xl" />
                ))}
            </div>
        );
    }

    if (anuncios.length === 0) {
        return null;
    }

    const renderAdContent = (anuncio: Anuncio) => {
        if (anuncio.custom_html) {
            return (
                <div
                    dangerouslySetInnerHTML={{ __html: anuncio.custom_html }}
                    className="w-full overflow-hidden flex justify-center py-2"
                    ref={(el) => {
                        if (el) {
                            const scripts = el.getElementsByTagName('script');
                            for (let i = 0; i < scripts.length; i++) {
                                const s = document.createElement('script');
                                s.text = scripts[i].text;
                                for (let j = 0; j < scripts[i].attributes.length; j++) {
                                    s.setAttribute(scripts[i].attributes[j].name, scripts[i].attributes[j].value);
                                }
                                scripts[i].parentNode?.replaceChild(s, scripts[i]);
                            }
                        }
                    }}
                />
            );
        }

        return (
            <div className="relative group overflow-hidden rounded-xl">
                <a
                    href={anuncio.link_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => registerClick(anuncio)}
                    className="block relative overflow-hidden rounded-xl bg-muted"
                >
                    <img
                        src={getOptimizedUrl(anuncio.imagem_url, 400)}
                        alt={anuncio.titulo}
                        className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white/80 text-[10px] font-normal z-10 border-none">
                        Patrocinado
                    </Badge>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="font-bold text-sm line-clamp-1">{anuncio.titulo}</h4>
                        <p className="text-[10px] line-clamp-2 opacity-90">{anuncio.descricao}</p>
                    </div>
                </a>
            </div>
        );
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Anúncios</h3>
            {anuncios.slice(0, limit).map((anuncio) => (
                <Card key={anuncio.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                        {renderAdContent(anuncio)}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
