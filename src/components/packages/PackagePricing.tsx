import { Check, MessageCircle, Shield, TrendingUp } from 'lucide-react';
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
  vip: 'border-blue-500/30',
  luxo: 'border-emerald-500/30',
  diamante: 'border-amber-500/30',
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

  return (
    <Card className={`${tierColors[tier]} border-2 ${sticky ? 'sticky top-24' : ''}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Badge de Urgência */}
          {spotsLeft && spotsLeft <= 5 && (
            <Badge variant="destructive" className="w-full justify-center py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Últimas {spotsLeft} vagas disponíveis!
            </Badge>
          )}

          {/* Preço */}
          <div className="text-center space-y-1">
            {installments && (
              <div className="text-3xl font-bold text-foreground">
                {installments.count}x de R$ {installments.value.toFixed(2)}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              {discount && (
                <span className="line-through mr-2">R$ {price.toFixed(2)}</span>
              )}
              <span className="text-lg font-semibold text-foreground">
                R$ {discountedPrice.toFixed(2)} à vista
              </span>
            </div>
            {discount && (
              <Badge variant="secondary" className="mt-1">
                {discount}% de desconto no pagamento à vista
              </Badge>
            )}
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            <Button 
              size="lg" 
              className="w-full font-semibold"
              onClick={onReserveClick}
            >
              Reservar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full"
              onClick={onWhatsAppClick}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Falar no WhatsApp
            </Button>
          </div>

          {/* Garantias */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Cancelamento grátis até 7 dias antes</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Melhor preço garantido</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Pagamento 100% seguro</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
