import React from 'react';
import { CompanyCard } from './CompanyCard';
import { Company } from '../types/company';
import { Building2, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  results: Company[];
  isLoading: boolean;
  error: string | null;
  query: string;
  totalResults?: number;
  onViewDetails: (company: Company) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  query,
  totalResults,
  onViewDetails
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Recherche en cours...</p>
        <p className="text-gray-400 text-sm mt-1">Veuillez patienter</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de recherche</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-red-500">
            Vérifiez votre terme de recherche et réessayez.
          </p>
        </div>
      </div>
    );
  }

  if (query && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun résultat</h3>
          <p className="text-gray-600 mb-4">
            Aucune entreprise trouvée pour "{query}"
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>• Vérifiez l'orthographe</p>
            <p>• Essayez des termes plus généraux</p>
            <p>• Utilisez le numéro SIREN exact (9 chiffres)</p>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          {totalResults ? (
            <>
              <span className="font-semibold text-emerald-600">{totalResults.toLocaleString('fr-FR')}</span>
              {' '}résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''} pour 
              <span className="font-medium"> "{query}"</span>
            </>
          ) : (
            <>
              <span className="font-semibold text-emerald-600">{results.length}</span>
              {' '}résultat{results.length > 1 ? 's' : ''}
            </>
          )}
        </p>
        {totalResults && totalResults > results.length && (
          <p className="text-sm text-gray-500 mt-1">
            Affichage des {results.length} premiers résultats
          </p>
        )}
      </div>
      
      <div className="grid gap-6">
        {results.map((company) => (
          <CompanyCard 
            key={company.siren} 
            company={company} 
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};