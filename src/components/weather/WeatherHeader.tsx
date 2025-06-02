
import React from 'react';
import { Calendar } from 'lucide-react';

interface WeatherHeaderProps {
  currentDate: string;
}

const WeatherHeader = ({ currentDate }: WeatherHeaderProps) => {
  return (
    <div className="text-center mb-8 sm:mb-12">
      <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <span className="text-lg font-semibold text-gray-800 capitalize">{currentDate}</span>
      </div>
      
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Condições Meteorológicas
      </h2>
      <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
        Dados em tempo real para Três Marias/MG. 
        Planeje sua pescaria com informações precisas e atualizadas.
      </p>
    </div>
  );
};

export default WeatherHeader;
