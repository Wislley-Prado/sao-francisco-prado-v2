import { Check, MessageCircle, Shield, TrendingUp, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PackagePricingProps {
  price: number;
  installments?: {
    count: number;
    value: number;
  };
  discount?: number;
  tier: 'vip' | 'luxo' | 'diamante';
  spotsLeft?: number;
  onReserveClick: () => void;
  onWhatsAppClick: () => void;
  sticky?: boolean;
}

const tierColors = {
  vip: 'border-blue-500/30 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-background',
  luxo: 'border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-background',
  diamante: 'border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/20 dark:to-background',
};

const tierButtonColors = {
  vip: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
  luxo: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800',
  diamante: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
};

export const PackagePricing = ({
  price,
  installments,
  discount,
  tier,
  spotsLeft,
  onReserveClick,
  onWhatsAppClick,
  sticky = true,
}: PackagePricingProps) => {
  const discountedPrice = discount ? price * (1 - discount / 100) : price;
  
  // Se não tem installments definido, calcular automaticamente 10x
  const displayInstallments = installments || {
    count: 10,
    value: price / 10
  };

  return (
    <Card className={`${tierColors[tier]} border-2 shadow-xl ${sticky ? 'sticky top-24' : ''}`}>
      <CardContent className="p-6">
        <div className="space-y-5">
          {/* Badge de Urgência */}
          {spotsLeft && spotsLeft <= 5 && (
            <Badge variant="destructive" className="w-full justify-center py-2 text-sm animate-pulse">
              <TrendingUp className="w-4 h-4 mr-2" />
              Últimas {spotsLeft} vagas disponíveis!
            </Badge>
          )}

          {/* Preço em Destaque */}
          <div className="text-center space-y-2 py-4">
            {/* Parcelas - DESTAQUE PRINCIPAL */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-4 px-6 shadow-lg">
              <div className="text-sm font-medium opacity-90">em até</div>
              <div className="text-4xl font-extrabold tracking-tight">
                {displayInstallments.count}x de R$ {displayInstallments.value.toFixed(2).replace('.', ',')}
              </div>
              <div className="text-xs opacity-80 mt-1">sem juros no cartão</div>
            </div>
            
            {/* Preço à vista */}
            <div className="pt-3 space-y-1">
              {discount && discount > 0 ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg line-through text-muted-foreground">
                      R$ {price.toFixed(2).replace('.', ',')}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <Percent className="w-3 h-3 mr-1" />
                      {discount}% OFF
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    R$ {discountedPrice.toFixed(2).replace('.', ',')} <span className="text-base font-normal text-muted-foreground">à vista</span>
                  </div>
                </>
              ) : (
                <div className="text-xl font-semibold text-foreground">
                  ou R$ {price.toFixed(2).replace('.', ',')} à vista
                </div>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Button 
              size="lg" 
              className={`w-full font-bold text-lg py-6 ${tierButtonColors[tier]} text-white shadow-lg hover:shadow-xl transition-all`}
              onClick={onReserveClick}
            >
              Reservar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full py-5 border-2 hover:bg-green-50 hover:border-green-500 hover:text-green-700 dark:hover:bg-green-950/30 dark:hover:text-green-400 transition-all"
              onClick={onWhatsAppClick}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </Button>
          </div>

          {/* Garantias */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-muted-foreground">Cancelamento grátis até 7 dias antes</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-muted-foreground">Melhor preço garantido</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-muted-foreground">Pagamento 100% seguro</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
