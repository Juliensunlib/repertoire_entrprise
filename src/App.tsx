import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { CompanyDetails } from './components/CompanyDetails';
import { useCompanySearch } from './hooks/useCompanySearch';
import { Company } from './types/company';

function App() {
  const {
    results,
    isLoading,
    error,
    totalResults,
    currentQuery,
    searchCompanies
  } = useCompanySearch();

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleCloseDetails = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar 
            onSearch={searchCompanies}
            isLoading={isLoading}
          />
        </div>

        <SearchResults
          results={results}
          isLoading={isLoading}
          error={error}
          query={currentQuery}
          totalResults={totalResults}
          onViewDetails={handleViewDetails}
        />
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 SunLib - Données fournies par l'API officielle de l'annuaire des entreprises françaises
          </p>
        </div>
      </footer>

      {/* Modal de détails */}
      {selectedCompany && (
        <CompanyDetails
          company={selectedCompany}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

export default App;