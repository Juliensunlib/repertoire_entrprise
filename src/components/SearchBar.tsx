import React, { useState } from 'react';
import { Search, Building2, Hash, MapPin, Filter, X } from 'lucide-react';
import { SearchFilters } from '../types/company';
import { CompanySearchService } from '../services/api';

interface SearchBarProps {
  onSearch: (query: string, page?: number, filters?: SearchFilters) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), 1, filters);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | boolean | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const removeFilter = (key: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const getPlaceholder = () => {
    return 'Rechercher par nom d\'entreprise, SIREN ou SIRET...';
  };

  const getSearchIcon = () => {
    const cleanQuery = query.replace(/\s/g, '');
    if (/^\d{9}$/.test(cleanQuery)) {
      return <Hash className="w-5 h-5 text-emerald-500" />;
    } else if (/^\d{14}$/.test(cleanQuery)) {
      return <Hash className="w-5 h-5 text-emerald-500" />;
    } else if (query.length > 0) {
      return <Building2 className="w-5 h-5 text-emerald-500" />;
    }
    return <Search className="w-5 h-5 text-gray-400" />;
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(v => v !== undefined && v !== null && v !== '').length;
  };

  const getFilterDisplayValue = (key: keyof SearchFilters, value: any): string => {
    if (typeof value === 'boolean') {
      return CompanySearchService.getCertificationLabel(key);
    }
    if (key === 'tranche_effectif_salarie') {
      return CompanySearchService.getTrancheEffectifLabel(value);
    }
    if (key === 'section_activite_principale') {
      return CompanySearchService.getSectionActiviteLabel(value);
    }
    if (key === 'etat_administratif') {
      return CompanySearchService.getStatusLabel(value);
    }
    return value.toString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {getSearchIcon()}
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            className="w-full pl-12 pr-40 py-4 text-lg bg-white border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                hasActiveFilters || showFilters
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtres
              {hasActiveFilters && (
                <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Rechercher'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (value === undefined || value === null || value === '') return null;
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
              >
                {getFilterDisplayValue(key as keyof SearchFilters, value)}
                <button
                  onClick={() => removeFilter(key as keyof SearchFilters)}
                  className="hover:bg-emerald-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
          <button
            onClick={clearFilters}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Tout effacer
          </button>
        </div>
      )}

      {/* Filtres avancés */}
      {showFilters && (
        <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtres de recherche</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Effacer les filtres
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Localisation */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Localisation
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Code postal</label>
                  <input
                    type="text"
                    value={filters.code_postal || ''}
                    onChange={(e) => handleFilterChange('code_postal', e.target.value)}
                    placeholder="75001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Département</label>
                  <input
                    type="text"
                    value={filters.departement || ''}
                    onChange={(e) => handleFilterChange('departement', e.target.value)}
                    placeholder="75"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Région</label>
                  <input
                    type="text"
                    value={filters.region || ''}
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    placeholder="11"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Activité */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Activité</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Code NAF</label>
                  <input
                    type="text"
                    value={filters.activite_principale || ''}
                    onChange={(e) => handleFilterChange('activite_principale', e.target.value)}
                    placeholder="62.01Z"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Section d'activité</label>
                  <select
                    value={filters.section_activite_principale || ''}
                    onChange={(e) => handleFilterChange('section_activite_principale', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Toutes</option>
                    <option value="A">Agriculture, sylviculture et pêche</option>
                    <option value="B">Industries extractives</option>
                    <option value="C">Industrie manufacturière</option>
                    <option value="D">Production et distribution d'électricité, de gaz</option>
                    <option value="E">Production et distribution d'eau</option>
                    <option value="F">Construction</option>
                    <option value="G">Commerce</option>
                    <option value="H">Transports et entreposage</option>
                    <option value="I">Hébergement et restauration</option>
                    <option value="J">Information et communication</option>
                    <option value="K">Activités financières et d'assurance</option>
                    <option value="L">Activités immobilières</option>
                    <option value="M">Activités spécialisées, scientifiques et techniques</option>
                    <option value="N">Activités de services administratifs et de soutien</option>
                    <option value="O">Administration publique</option>
                    <option value="P">Enseignement</option>
                    <option value="Q">Santé humaine et action sociale</option>
                    <option value="R">Arts, spectacles et activités récréatives</option>
                    <option value="S">Autres activités de services</option>
                    <option value="T">Activités des ménages</option>
                    <option value="U">Activités extra-territoriales</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Caractéristiques */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Caractéristiques</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nature juridique</label>
                  <select
                    value={filters.nature_juridique || ''}
                    onChange={(e) => handleFilterChange('nature_juridique', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Toutes</option>
                    <option value="5710">SAS</option>
                    <option value="5720">SARL</option>
                    <option value="5499">SA</option>
                    <option value="1000">Entrepreneur individuel</option>
                    <option value="9220">Association</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tranche d'effectif</label>
                  <select
                    value={filters.tranche_effectif_salarie || ''}
                    onChange={(e) => handleFilterChange('tranche_effectif_salarie', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Toutes</option>
                    <option value="00">0 salarié</option>
                    <option value="01">1 ou 2 salariés</option>
                    <option value="02">3 à 5 salariés</option>
                    <option value="03">6 à 9 salariés</option>
                    <option value="11">10 à 19 salariés</option>
                    <option value="12">20 à 49 salariés</option>
                    <option value="21">50 à 99 salariés</option>
                    <option value="22">100 à 199 salariés</option>
                    <option value="31">200 à 249 salariés</option>
                    <option value="32">250 à 499 salariés</option>
                    <option value="41">500 à 999 salariés</option>
                    <option value="42">1000 à 1999 salariés</option>
                    <option value="51">2000 à 4999 salariés</option>
                    <option value="52">5000 à 9999 salariés</option>
                    <option value="53">10000 salariés et plus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">État administratif</label>
                  <select
                    value={filters.etat_administratif || ''}
                    onChange={(e) => handleFilterChange('etat_administratif', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Tous</option>
                    <option value="A">Active</option>
                    <option value="C">Cessée</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Certifications et labels */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Certifications et labels</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { key: 'est_ess', label: 'ESS' },
                  { key: 'est_bio', label: 'Bio' },
                  { key: 'est_rge', label: 'RGE' },
                  { key: 'est_qualiopi', label: 'Qualiopi' },
                  { key: 'est_siae', label: 'SIAE' },
                  { key: 'est_association', label: 'Association' },
                  { key: 'est_entrepreneur_individuel', label: 'Entrepreneur individuel' },
                  { key: 'est_organisme_formation', label: 'Organisme de formation' },
                  { key: 'est_patrimoine_vivant', label: 'Patrimoine vivant' },
                  { key: 'est_service_public', label: 'Service public' },
                  { key: 'est_societe_mission', label: 'Société à mission' },
                  { key: 'egapro_renseignee', label: 'Égapro' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters[key as keyof SearchFilters] === true}
                      onChange={(e) => handleFilterChange(key as keyof SearchFilters, e.target.checked)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex flex-wrap gap-2 justify-center text-sm text-gray-600">
        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
          <Building2 className="w-4 h-4" />
          <span>Nom d'entreprise</span>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
          <Hash className="w-4 h-4" />
          <span>SIREN (9 chiffres)</span>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
          <Hash className="w-4 h-4" />
          <span>SIRET (14 chiffres)</span>
        </div>
      </div>
    </div>
  );
};