import React from 'react';
import { Building2, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-2xl">
              <Sun className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">SunLib</h1>
          </div>
          <h2 className="text-2xl font-light mb-2 flex items-center justify-center gap-2">
            <Building2 className="w-6 h-6" />
            Outil de Recherche d'Entreprises
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            Recherchez facilement des informations sur les entreprises françaises 
            grâce aux données officielles de l'annuaire des entreprises
          </p>
        </div>
      </div>
    </header>
  );
};