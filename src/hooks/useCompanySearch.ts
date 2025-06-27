import { useState, useCallback } from 'react';
import { Company, SearchFilters, NearPointFilters } from '../types/company';
import { CompanySearchService, SearchResponse } from '../services/api';

export const useCompanySearch = () => {
  const [results, setResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const searchCompanies = useCallback(async (
    query: string, 
    page: number = 1, 
    filters?: SearchFilters
  ) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);
    setCurrentPage(page);

    try {
      let response: SearchResponse;
      
      if (CompanySearchService.isSiren(query)) {
        // Recherche directe par SIREN
        const company = await CompanySearchService.getCompanyBySiren(query);
        response = {
          results: company ? [company] : [],
          total_results: company ? 1 : 0,
          page: 1,
          per_page: 1,
          total_pages: 1
        };
      } else if (CompanySearchService.isSiret(query)) {
        // Recherche directe par SIRET
        const company = await CompanySearchService.getCompanyBySiret(query);
        response = {
          results: company ? [company] : [],
          total_results: company ? 1 : 0,
          page: 1,
          per_page: 1,
          total_pages: 1
        };
      } else {
        // Recherche générale avec filtres
        response = await CompanySearchService.searchCompanies(query, page, 20, filters);
      }

      setResults(response.results);
      setTotalResults(response.total_results);
      setTotalPages(response.total_pages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite';
      setError(errorMessage);
      setResults([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchNearPoint = useCallback(async (
    filters: NearPointFilters,
    page: number = 1
  ) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuery(`Recherche géographique (${filters.lat}, ${filters.long})`);
    setCurrentPage(page);

    try {
      const response = await CompanySearchService.searchNearPoint(filters, page, 20);

      setResults(response.results);
      setTotalResults(response.total_results);
      setTotalPages(response.total_pages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite';
      setError(errorMessage);
      setResults([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (currentPage >= totalPages || isLoading) return;

    const nextPage = currentPage + 1;
    setIsLoading(true);

    try {
      const response = await CompanySearchService.searchCompanies(currentQuery, nextPage, 20);
      
      setResults(prev => [...prev, ...response.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des résultats supplémentaires';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentQuery, currentPage, totalPages, isLoading]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setTotalResults(0);
    setCurrentQuery('');
    setCurrentPage(1);
    setTotalPages(1);
  }, []);

  return {
    results,
    isLoading,
    error,
    totalResults,
    currentQuery,
    currentPage,
    totalPages,
    searchCompanies,
    searchNearPoint,
    loadMore,
    clearResults,
    hasMore: currentPage < totalPages
  };
};