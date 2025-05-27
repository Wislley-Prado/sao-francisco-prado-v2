
import React from 'react';
import { Fish, Users, MapPin, Star } from 'lucide-react';

const PackageFeatures = () => {
  return (
    <div className="mt-16 text-center">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Todos os pacotes incluem
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-rio-blue rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Fish className="h-8 w-8 text-white" />
            </div>
            <p className="font-medium">Equipamentos</p>
            <p className="text-sm text-gray-600">Varas, molinetes e acessórios</p>
          </div>
          <div className="text-center">
            <div className="bg-water-green rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <p className="font-medium">Guia Especializado</p>
            <p className="text-sm text-gray-600">Conhecimento local</p>
          </div>
          <div className="text-center">
            <div className="bg-sunset-orange rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <p className="font-medium">Melhores Pontos</p>
            <p className="text-sm text-gray-600">Locais exclusivos</p>
          </div>
          <div className="text-center">
            <div className="bg-gray-600 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Star className="h-8 w-8 text-white" />
            </div>
            <p className="font-medium">Seguro Total</p>
            <p className="text-sm text-gray-600">Cobertura completa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageFeatures;
