
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Fish, Star, Calendar } from 'lucide-react';

interface Package {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  people: string;
  rating: number;
  features: string[];
  image: string;
  popular: boolean;
  vip?: boolean;
  location?: string;
  totalValue?: string;
  pricePerPerson?: string;
  paymentOptions?: {
    installments?: string;
    creditCard?: string;
    pix?: string;
  };
  structure?: string[];
  meals?: string[];
  fishing?: string[];
  cleaning?: string[];
}

interface PackageCardProps {
  pkg: Package;
}

const PackageCard = ({ pkg }: PackageCardProps) => {
  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        pkg.vip 
          ? 'ring-2 ring-yellow-400 shadow-2xl bg-gradient-to-br from-yellow-50 to-amber-50' 
          : pkg.popular 
          ? 'ring-2 ring-sunset-orange shadow-xl scale-105' 
          : 'hover:shadow-lg'
      }`}
    >
      {pkg.vip && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold">
            🌟 VIP EXCLUSIVO
          </Badge>
        </div>
      )}
      {pkg.popular && !pkg.vip && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-sunset-orange text-white">
            Mais Popular
          </Badge>
        </div>
      )}

      <CardHeader className="p-0">
        <div className="h-48 bg-gradient-to-br from-rio-blue to-water-green relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-medium">{pkg.rating}</span>
            </div>
            <CardTitle className="text-2xl font-bold">{pkg.title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <p className="text-gray-600 mb-4">{pkg.description}</p>
        
        {pkg.location && (
          <p className="text-sm text-gray-500 mb-4">📍 {pkg.location}</p>
        )}

        {/* Package Info */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-3xl font-bold text-rio-blue">{pkg.price}</div>
          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {pkg.duration}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {pkg.people}
            </div>
          </div>
        </div>

        {/* VIP Price Breakdown */}
        {pkg.vip && pkg.totalValue && pkg.pricePerPerson && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="text-lg font-bold text-yellow-800 mb-2">
              💰 VALOR TOTAL: {pkg.totalValue}
            </div>
            <div className="text-md text-yellow-700">
              🧍 {pkg.pricePerPerson} por pescador
            </div>
          </div>
        )}

        {/* Features */}
        <div className="space-y-2 mb-6">
          {pkg.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <Fish className="h-4 w-4 mr-2 text-water-green" />
              {feature}
            </div>
          ))}
        </div>

        {/* VIP Payment Options */}
        {pkg.vip && pkg.paymentOptions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-blue-800 mb-2">💳 PAGAMENTO FACILITADO:</h4>
            <div className="space-y-2 text-sm text-blue-700">
              {pkg.paymentOptions.installments && (
                <div>✅ {pkg.paymentOptions.installments}</div>
              )}
              {pkg.paymentOptions.creditCard && (
                <div>✅ {pkg.paymentOptions.creditCard}</div>
              )}
              {pkg.paymentOptions.pix && (
                <div>✅ {pkg.paymentOptions.pix}</div>
              )}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button 
          className={`w-full ${
            pkg.vip 
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold' 
              : pkg.popular 
              ? 'bg-sunset-orange hover:bg-orange-600 text-white' 
              : 'bg-rio-blue hover:bg-blue-600 text-white'
          }`}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {pkg.vip ? 'Consultar Disponibilidade' : 'Reservar Agora'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PackageCard;
